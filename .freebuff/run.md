# Legal Eye — preview run notes

## Reproducing uncommitted artifacts

This worktree contains the source itself — there is nothing extra to copy
(no `.env.local`, no secrets). All uncommitted work lives in tracked source
under `src/` (see `git status`) plus untracked new components/routes:

- `src/components/dashboard/` (CaseCard, CaseSearch, CaseStats, SidebarDrawer)
- `src/components/layout/AppHeader.tsx`
- `src/routes/dashboard.tsx`, `src/routes/upload.tsx`

A fresh checkout reproduces everything with `npm install` (README documents
npm; a `bun.lock`/`bunfig.toml` also exist). `node_modules/` is already
installed in this workspace.

## Running the dev server

```bash
npm run dev
```

The Lovable TanStack config pins the dev server to `http://localhost:8080`
(strictPort). Verify it answers before registering a preview:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/dashboard
```

Detached start (Windows, outlives this session), logs under `.freebuff/`:

```powershell
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -RedirectStandardOutput '.freebuff\preview.log' -RedirectStandardError '.freebuff\preview.log.err' -WindowStyle Hidden -PassThru).Id"
```

Routes: `/` (cinematic intro + login), `/dashboard` (lawyer's dashboard),
`/upload` (case file intake), `/records` (case archive, deep-linkable via
`?case=<id>`).
