const express = require('express');
const cors = require('cors');
const fs = require('node:fs/promises');
const path = require('node:path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const storePath = path.join(__dirname, 'data', 'store.json');

app.use(cors());
app.use(express.json());

async function readStore() {
  const contents = await fs.readFile(storePath, 'utf8');
  return JSON.parse(contents);
}

async function writeStore(store) {
  await fs.writeFile(storePath, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
}

function sendError(response, status, message) {
  return response.status(status).json({ error: message });
}

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok', service: 'mini-github-backend' });
});

app.get('/api/dashboard', async (request, response, next) => {
  try {
    const store = await readStore();
    response.json({
      repositories: store.repositories,
      issues: store.issues,
      members: store.members,
      activity: store.activity
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/repositories', async (request, response, next) => {
  try {
    const store = await readStore();
    response.json(store.repositories);
  } catch (error) {
    next(error);
  }
});

app.post('/api/repositories', async (request, response, next) => {
  try {
    const { name, description = '', language = 'JavaScript' } = request.body;
    const normalizedName = String(name || '').trim();
    if (!normalizedName) return sendError(response, 400, 'Repository name is required.');

    const store = await readStore();
    if (store.repositories.some(repository => repository.name.toLowerCase() === normalizedName.toLowerCase())) {
      return sendError(response, 409, 'A repository with that name already exists.');
    }

    const repository = {
      name: normalizedName,
      description: String(description).trim() || 'A new project waiting to take shape.',
      language: String(language).trim() || 'JavaScript',
      stars: 0,
      starred: false,
      updated: 'created just now'
    };
    store.repositories.unshift(repository);
    await writeStore(store);
    response.status(201).json(repository);
  } catch (error) {
    next(error);
  }
});

app.post('/api/repositories/:name/star', async (request, response, next) => {
  try {
    const store = await readStore();
    const repository = store.repositories.find(item => item.name === request.params.name);
    if (!repository) return sendError(response, 404, 'Repository not found.');

    repository.starred = !repository.starred;
    repository.stars += repository.starred ? 1 : -1;
    await writeStore(store);
    response.json(repository);
  } catch (error) {
    next(error);
  }
});

app.get('/api/issues', async (request, response, next) => {
  try {
    const store = await readStore();
    const query = String(request.query.search || '').toLowerCase();
    const label = String(request.query.label || 'all').toLowerCase();
    const issues = store.issues.filter(issue => issue.title.toLowerCase().includes(query) && (label === 'all' || issue.label === label));
    response.json({ total: store.issues.length, issues });
  } catch (error) {
    next(error);
  }
});

app.post('/api/issues', async (request, response, next) => {
  try {
    const { title, label = 'bug' } = request.body;
    const normalizedTitle = String(title || '').trim();
    const allowedLabels = new Set(['bug', 'enhancement', 'docs']);
    if (!normalizedTitle) return sendError(response, 400, 'Issue title is required.');
    if (!allowedLabels.has(label)) return sendError(response, 400, 'Issue label must be bug, enhancement, or docs.');

    const store = await readStore();
    const issue = {
      title: normalizedTitle,
      number: Math.max(...store.issues.map(item => item.number), 0) + 1,
      label,
      meta: 'opened by Jordan · just now'
    };
    store.issues.unshift(issue);
    await writeStore(store);
    response.status(201).json(issue);
  } catch (error) {
    next(error);
  }
});

app.get('/api/members', async (request, response, next) => {
  try {
    const store = await readStore();
    response.json(store.members);
  } catch (error) {
    next(error);
  }
});

app.get('/api/activity', async (request, response, next) => {
  try {
    const store = await readStore();
    response.json(store.activity);
  } catch (error) {
    next(error);
  }
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ error: 'Something went wrong while reading the workspace.' });
});

app.listen(port, () => {
  console.log(`Mini GitHub backend running at http://localhost:${port}`);
});
