# Mini GitHub Backend

A small Express REST API for the Mini GitHub frontend. It uses `data/store.json` as a local persistence layer, so no database setup is required.

## Run locally

```powershell
cd backend
npm install
npm start
```

The API runs at `http://localhost:3000` by default. Set `PORT` to use a different port.

## Endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/repositories`
- `POST /api/repositories`
- `POST /api/repositories/:name/star`
- `GET /api/issues?search=keyboard&label=enhancement`
- `POST /api/issues`
- `GET /api/members`
- `GET /api/activity`

Example repository body:

```json
{
  "name": "morning-coffee",
  "description": "A small project for better mornings.",
  "language": "JavaScript"
}
```

Example issue body:

```json
{
  "title": "Add a repository template",
  "label": "enhancement"
}
