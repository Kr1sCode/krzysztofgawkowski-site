# krzysztofgawkowski-site

Statyczne portfolio IT (terminal UI) z sekcją CV, diagramem homelab i asystentem RAG opartym o Cloudflare Worker.

## Zawartość repozytorium

| Plik | Opis |
|------|------|
| `index.html` | Strona główna — CV, case study, terminal, asystent „Ask my CV” |
| `homelab.html` | Diagram i opis infrastruktury homelab |
| `workers/cv-rag-worker.js` | Cloudflare Worker — proxy do OpenAI GPT-4o-mini z kontekstem CV |

## Audyt bezpieczeństwa (przed publikacją)

### OK — brak w repo

- Kluczy API / tokenów OpenAI (worker używa `env.OPENAI_API_KEY` w Cloudflare Secrets)
- Haseł w plaintext (boot screen: `Password: ••••••••••` to dekoracja UI)
- Plików `.env`, `wrangler.toml` z sekretami

### Świadomie publiczne (dane CV)

W `index.html` (kontakt) i `workers/cv-rag-worker.js` (`CV_DATA`):

- e-mail, telefon, LinkedIn, lokalizacja — **zamierzone** dla portfolio rekrutacyjnego

Przed push na publiczne repo upewnij się, że akceptujesz ich widoczność.

### Zredagowane w tej wersji repo

| Element | Było | Jest w repo |
|---------|------|-------------|
| URL workera RAG | `cv.gawkowskimail.workers.dev` | `YOUR_SUBDOMAIN.workers.dev` (placeholder) |
| `ALLOWED_ORIGIN` w workerze | konkretna domena | `YOUR_DOMAIN.example` |
| Publiczne IP (OVH, WAN peer) | rzeczywiste | `203.0.113.x` (RFC 5737 TEST-NET-3) |
| DDNS | `duckdns.org` | `example.dyn-dns.test` |
| Sieci w diagramie | `172.x` produkcyjne | `10.x` (uproszczona topologia) |

> **Uwaga:** Oryginalne pliki w `~/Dokumenty/` mogą nadal zawierać rzeczywiste adresy — nie commituj ich bez redakcji.

## Wdrożenie strony statycznej

1. Hostuj `index.html` i `homelab.html` (GitHub Pages, Cloudflare Pages, nginx itd.).
2. W `index.html` ustaw:
   ```javascript
   var RAG_ENDPOINT = "https://TWOJ-WORKER.workers.dev";
   ```
3. Link między stronami: `index.html` → `homelab.html` (już w nav).

## Wdrożenie Cloudflare Worker (RAG)

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create Worker**.
2. Wklej kod z `workers/cv-rag-worker.js`.
3. Ustaw `ALLOWED_ORIGIN` na URL portfolio (np. `https://twoja-domena.pl`).
4. **Settings → Variables and Secrets** → dodaj `OPENAI_API_KEY` (Encrypted).
5. Zapisz URL workera i wstaw go w `RAG_ENDPOINT` w `index.html`.

### Zachowanie asystenta

- Model: `gpt-4o-mini`, max 400 tokenów, temperature 0.3
- Kontekst CV osadzony w `CV_DATA` (bez zewnętrznej bazy wektorowej)
- CORS tylko dla `ALLOWED_ORIGIN`
- Limit pytania: 500 znaków

## Lokalny podgląd

```bash
python3 -m http.server 8080
# http://localhost:8080/index.html
```

Asystent RAG nie zadziała lokalnie bez wdrożonego workera i poprawnego CORS.

## Licencja

Portfolio osobiste — kod workera i strony do użytku referencyjnego.