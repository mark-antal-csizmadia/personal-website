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
