# krzysztofgawkowski-site

Static IT portfolio (terminal UI) with a CV section, homelab diagram, and a RAG assistant powered by a Cloudflare Worker.

## Repository Contents

| File | Description |
|------|-------------|
| `index.html` | Main page — CV, case studies, terminal, "Ask my CV" assistant |
| `homelab.html` | Homelab infrastructure diagram and description |
| `workers/cv-rag-worker.js` | Cloudflare Worker — proxy to OpenAI GPT-4o-mini with CV context |

### Description of Shared Data

In `index.html` (contact section) and `workers/cv-rag-worker.js` (`CV_DATA`):

### Redacted in This Version of the Repo

| Element | Original | In Repo |
|---------|----------|---------|
| RAG worker URL | `cv.gawkowskimail.workers.dev` | `krzysztofgawkowski.pl.workers.dev` (placeholder) |
| `ALLOWED_ORIGIN` in worker | specific domain | `krzysztofgawkowski.pl` |
| Public IP (CLOUD, WAN peer) | real addresses | `203.0.113.x` (RFC 5737 TEST-NET-3) |
| DDNS | `duckdns.org` | |
| Network addresses in diagram | `172.x` production | example of server colocation at OVH provided; recommended alternatives: ATMAN (Warsaw), HETZNER, etc. |

## Deploying the Static Site

1. Host `index.html` and `homelab.html` (GitHub Pages, Cloudflare Pages, nginx, etc.).
2. In `index.html`, set:
   ```javascript
   var RAG_ENDPOINT = "https://krzysztofgawkowski.workers.dev";
   ```
3. Link between pages: `index.html` → `homelab.html` (placed in the navigation).

## Deploying the Cloudflare Worker (RAG)

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create Worker**.
2. Paste the code from `workers/cv-rag-worker.js`.
3. Set `ALLOWED_ORIGIN` to the portfolio URL (e.g. `https://krzysztofgawkowski.pl`).
4. **Settings → Variables and Secrets** → add `OPENAI_API_KEY` (Encrypted).
5. Copy the worker URL and paste it into `RAG_ENDPOINT` in `index.html`.

### Assistant Behaviour

- Model: `gpt-4o-mini`, max 400 tokens, temperature 0.3
- CV context embedded in `CV_DATA` (no external vector database)
- CORS restricted to `ALLOWED_ORIGIN`
- Question length limit: 500 characters

## Local Preview

```bash
python3 -m http.server 8080
# http://localhost:8080/index.html
```

The RAG assistant will not work locally without a deployed worker and correct CORS configuration.

## License

Personal portfolio — the worker and page code are provided for reference use.
