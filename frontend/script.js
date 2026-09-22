const repositories = [
  { name: 'design-system', description: 'A flexible toolkit for thoughtful interfaces.', language: 'TypeScript', dot: '', stars: 12, starred: true, updated: 'updated 2h ago' },
  { name: 'field-notes', description: 'A tiny, private notebook for observations.', language: 'JavaScript', dot: 'blue', stars: 8, starred: false, updated: 'updated yesterday' },
  { name: 'tiny-router', description: 'Small routing primitives for small web apps.', language: 'JavaScript', dot: 'pink', stars: 24, starred: true, updated: 'updated 3d ago' },
  { name: 'garden-log', description: 'Seasonal notes, tasks, and little wins.', language: 'CSS', dot: '', stars: 5, starred: false, updated: 'updated 6d ago' }
];
let issues = [
  { title: 'Button focus state disappears on Safari', number: 42, label: 'bug', meta: 'opened by Priya · 2 days ago' },
  { title: 'Add keyboard shortcuts to the command menu', number: 38, label: 'enhancement', meta: 'opened by Jordan · 4 days ago' },
  { title: 'Document color token naming', number: 35, label: 'docs', meta: 'opened by Marco · 6 days ago' }
];

const repoList = document.querySelector('#repoList');
const issueList = document.querySelector('#issueList');
const toast = document.querySelector('#toast');
function showToast(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function renderRepos() {
  repoList.innerHTML = repositories.map((repo, index) => `<div class="repo-row"><div class="repo-main"><div class="repo-name"><button onclick="selectRepo('${repo.name}')">${repo.name}</button><span style="font:10px var(--mono);color:var(--muted)">public</span></div><div class="repo-description">${repo.description}</div><div class="repo-meta"><span class="language"><i class="dot ${repo.dot}"></i>${repo.language}</span><span>★ ${repo.stars}</span><span>${repo.updated}</span></div></div><button class="star-btn ${repo.starred ? 'starred' : ''}" onclick="toggleStar(${index})">${repo.starred ? '★ Starred' : '☆ Star'}</button></div>`).join('');
  document.querySelector('#repoCount').textContent = String(repositories.length).padStart(2, '0'); document.querySelector('#repoCountLabel').textContent = `${repositories.length} repositories`;
}
function renderIssues() {
  const query = document.querySelector('#issueSearch').value.toLowerCase(); const filter = document.querySelector('#issueFilter').value;
  const shown = issues.filter(issue => issue.title.toLowerCase().includes(query) && (filter === 'all' || issue.label === filter));
  document.querySelector('#issueCount').textContent = `${issues.length} open`;
  issueList.innerHTML = shown.length ? shown.map(issue => `<div class="issue"><div><div class="issue-title">${issue.title}<span class="issue-label">${issue.label}</span></div><div class="issue-sub">${issue.meta}</div></div><span class="issue-number">#${issue.number}</span></div>`).join('') : '<div class="empty">No issues match that search.</div>';
}
window.toggleStar = index => { repositories[index].starred = !repositories[index].starred; repositories[index].stars += repositories[index].starred ? 1 : -1; renderRepos(); showToast(repositories[index].starred ? 'Repository added to your stars.' : 'Repository removed from your stars.'); };
window.selectRepo = name => showToast(`Opening ${name}...`);
renderRepos(); renderIssues();
document.querySelector('#issueSearch').addEventListener('input', renderIssues); document.querySelector('#issueFilter').addEventListener('change', renderIssues);
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-view]').forEach(item => item.classList.remove('active')); button.classList.add('active'); showToast(`${button.textContent.trim()} view selected.`); }));
document.querySelectorAll('[data-tab]').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('[data-tab]').forEach(item => item.classList.remove('active')); tab.classList.add('active'); showToast(`${tab.textContent} view selected.`); }));
function openModal(id) { document.querySelector(`#${id}`).classList.add('open'); document.querySelector(`#${id} input`)?.focus(); }
function closeModal(id) { document.querySelector(`#${id}`).classList.remove('open'); }
document.querySelector('#newRepoBtn').addEventListener('click', () => openModal('repoModal')); document.querySelector('#newIssueBtn').addEventListener('click', () => openModal('issueModal')); document.querySelector('#inviteBtn').addEventListener('click', () => showToast('Invite link copied to clipboard.'));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.dataset.close)));
document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(backdrop.id); }));
document.querySelector('#repoForm').addEventListener('submit', event => { event.preventDefault(); const name = document.querySelector('#repoName').value.trim(); if (!name) return; repositories.unshift({ name, description: document.querySelector('#repoDescription').value.trim() || 'A new project waiting to take shape.', language: document.querySelector('#repoLanguage').value, dot: '', stars: 0, starred: false, updated: 'created just now' }); renderRepos(); closeModal('repoModal'); event.target.reset(); showToast(`${name} created successfully.`); });
document.querySelector('#issueForm').addEventListener('submit', event => { event.preventDefault(); const title = document.querySelector('#issueTitle').value.trim(); if (!title) return; issues.unshift({ title, number: Math.max(...issues.map(issue => issue.number), 0) + 1, label: document.querySelector('#issueLabelInput').value, meta: 'opened by Jordan · just now' }); renderIssues(); closeModal('issueModal'); event.target.reset(); showToast('Issue opened. Your team can pick it up now.'); });
