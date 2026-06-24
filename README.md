# krzysztofgawkowski-site

Statyczne portfolio IT (terminal UI) z sekcją CV, diagramem homelab i asystentem RAG opartym o Cloudflare Worker.

## Zawartość repozytorium

| Plik | Opis |
|------|------|
| `index.html` | Strona główna — CV, case study, terminal, asystent „Ask my CV” |
| `homelab.html` | Diagram i opis infrastruktury homelab |
| `workers/cv-rag-worker.js` | Cloudflare Worker — proxy do OpenAI GPT-4o-mini z kontekstem CV |

### Opis danych udostępnionych

W `index.html` (kontakt) i `workers/cv-rag-worker.js` (`CV_DATA`):

### Zredagowane w tej wersji repo

| Element | Było | Jest w repo |
|---------|------|-------------|
| URL workera RAG | `cv.gawkowskimail.workers.dev` | `krzysztofgawkowski.pl.workers.dev` (placeholder) |
| `ALLOWED_ORIGIN` w workerze | konkretna domena | `krzysztofgawkowski.pl` |
| Publiczne IP (CLOUD, WAN peer) | rzeczywiste | `203.0.113.x` (RFC 5737 TEST-NET-3) |
| DDNS | `duckdns.org`
| Sieci w diagramie | `172.x` produkcyjne | podano przykład kolokacji serwera w OVH, polecam ATMAN (Warszawa) , HETZNER itp |

## Wdrożenie strony statycznej

1. Hostowanie `index.html` i `homelab.html` (GitHub Pages, Cloudflare Pages, nginx itd.).
2. W `index.html` ustawiłem:
   ```javascript
   var RAG_ENDPOINT = "https://krzysztofgawkowski.workers.dev";
   ```
3. Link między stronami: `index.html` → `homelab.html` (umieszczono w nawigacji).

## Wdrożenie Cloudflare Worker (RAG)

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create Worker**.
2. Wklejono kod z `workers/cv-rag-worker.js`.
3. Ustawiono `ALLOWED_ORIGIN` na URL portfolio (np. `https://krzysztofgawkowski.pl`).
4. **Settings → Variables and Secrets** → dodano `OPENAI_API_KEY` (Encrypted).
5. Zapisano URL workera i wstawiłem go w `RAG_ENDPOINT` w `index.html`.

### Zachowanie asystenta

- Model: `gpt-4o-mini`, max 400 tokenów, temperature 0.3
- Kontekst CV osadzony w `CV_DATA` (bez zewnętrznej bazy wektorowej)
- CORS tylko dla `ALLOWED_ORIGIN`
- Limit pytania: 500 znaków

## Lokalny podgląd z poziomu

```bash
python3 -m http.server 8080
# http://localhost:8080/index.html
```

Asystent RAG nie zadziała lokalnie bez wdrożonego workera i poprawnego CORS.

## Licencja

Portfolio osobiste — kod workera i strony do użytku referencyjnego.
