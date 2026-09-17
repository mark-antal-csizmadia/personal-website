# personal-website

Personal site and small experiments. The git repo is a container for multiple projects, not a Next.js app at the root.

```
web/     Next.js site (Openhedge MCP chat + in-browser XGBoost widget)
```

Later folders (uv Python tools, etc.) can sit beside `web/`.

## Site

```bash
cd web
npm install
cp .env.example .env.local   # OPENROUTER_API_KEY required; OPENROUTER_MODEL is optional
npm run generate-dataset   # one-off; dataset is committed
npm run dev
```

`OPENROUTER_API_KEY` is required for `/openhedge` chat. `OPENHEDGE_MCP_URL` defaults to `https://mcp.openhedge.app/mcp`.

## Railway

The site deploys as a single `web` service. Railway Root Directory must be `web` (the git root is not a Next.js app). Config-as-code is [`web/railway.toml`](web/railway.toml).

Set these service variables (same names as `.env.example`):

- `OPENROUTER_API_KEY` — required
- `OPENHEDGE_MCP_URL` — `https://mcp.openhedge.app/mcp`
- optional: `OPENROUTER_MODEL`, `OPENHEDGE_STEP_TIMEOUT_MS`, `OPENHEDGE_TOOL_TIMEOUT_MS`, `OPENHEDGE_TOTAL_TIMEOUT_MS`

Public hostname is `https://markcsizmadia.com` (`www` redirects there via Cloudflare).
