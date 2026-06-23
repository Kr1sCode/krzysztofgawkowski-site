// Cloudflare Worker — CV RAG Proxy
// 1. Deploy na dash.cloudflare.com -> Workers & Pages -> Create Worker
// 2. Settings -> Variables and Secrets -> dodaj OPENAI_API_KEY (Encrypt)
// 3. Podmień ALLOWED_ORIGIN na swoja domene

// Ustaw domenę portfolio po deployu — patrz README.md
const ALLOWED_ORIGIN = "https://YOUR_DOMAIN.example";

const CV_DATA = `Krzysztof Gawkowski — Senior IT Administrator / IT Infrastructure Engineer

KONTAKT:
- Telefon: +48 884-333-222
- Email: gawkowskimail@gmail.com
- LinkedIn: linkedin.com/in/krzysztof-gawkowski
- Strona: krzysztofgawkowski.pl
- Lokalizacja: Warszawa, Polska

TYTUŁ ZAWODOWY: Senior IT Administrator | Infrastruktura | Bezpieczeństwo | Cloud

PROFIL ZAWODOWY:
Doświadczony administrator IT z ponad 10-letnim stażem w zarządzaniu infrastrukturą serwerową,
wirtualizacją i bezpieczeństwem środowisk on-premise oraz chmurowych. Specjalizacja w administracji
Windows Server / Active Directory, wdrożeniach systemów monitorowania i zgodności z NIS2 / ISO 27001.
Aktywnie rozwijam homelab i środowiska CI/CD.

WYKSZTAŁCENIE:
- Magister inżynier – Informatyka: Technologie Internetowe i Sieci
  Uczelnia Europejska w Warszawie, 03.2020

DOŚWIADCZENIE ZAWODOWE:

1. Senior Administrator IT — Outsourcing (01.2025 — obecnie)
   - Samodzielne zarządzanie infrastrukturą dwóch podmiotów (600 i 50 pracowników): lokalne data center + Microsoft Cloud O365
   - Wdrożenie systemów GLPI, Zabbix, Wazuh oraz realizacja wymagań NIS2 i SZBI/ISO 27001

2. Administrator Systemów IT (Windows) — Luxmed Sp. z o.o. (12.2023 — 12.2025)
   - Administracja serwerów fizycznych i wirtualnych; eliminacja podatności zgodnie z CIS/CVE
   - Wdrożenie modelu tierowania AD (Tier 0/1/2), polityk GPO, MFA oraz CIS Benchmarks
   - Integracja struktur IT spółek grupy kapitałowej (AD, backup, zarządzanie tożsamością)

3. Administrator ds. Infrastruktury — Rhenus Freight Logistics Sp. z o.o. (06.2023 — 12.2023)
   - Zarządzanie i optymalizacja infrastruktury sieciowej i serwerowej (VMware ESXi/vSphere, Linux, Windows Server)
   - Serwisy terenowe: instalacja i modernizacja serwerowni w oddziałach firmy

4. Główny Informatyk / Starszy Informatyk — sektor publiczny, Warszawa (11.2021 — 05.2023)
   - Trzy stanowiska awansem: Starszy Informatyk → Administrator Techniczny Systemów (SZBI ISO 27001) → Główny Informatyk
   - Hardening serwerów, usuwanie podatności EOS, zarządzanie ciągłością działania sieci i systemów

5. Specjalista ds. Systemów Operacyjnych — Grupa Autoneo Sp. z o.o. (04.2021 — 09.2021)
   - Administracja Linux i Windows Server, wsparcie techniczne, szkolenia wewnętrzne, współpraca z dystrybutorami IT

6. Operator Helpdesk — SPIE Building Solutions Sp. z o.o. (01.2019 — 03.2021)
   - Koordynacja zleceń serwisowych (IT, HVAC, SAP, DSO), nadzór nad podwykonawcami, zarządzanie magazynem

7. Jednoosobowa Działalność Gospodarcza — JDG/B2B (05.2015 — 10.2021)
   - Outsourcing IT: CCTV-IP (IVS/ANPR), systemy alarmowe SSWiN, sieci LAN/WLAN, integracja rozwiązań infrastrukturalnych

UMIEJĘTNOŚCI TECHNICZNE:
- Wirtualizacja: VMware vSphere (vCenter, ESXi), Proxmox VE, Hyper-V
- Systemy operacyjne: Windows Server (AD, GPO, DNS, DHCP), Linux (Debian, Ubuntu, OpenSUSE)
- Bezpieczeństwo: Veeam Backup & Replication, ESET Protect, Symantec SEP, Tenable SCCV, Wazuh SIEM, CIS Benchmarks
- Sieć / Firewall: pfSense/Netgate, Fortinet FortiGate, VyOS, Dell EMC Networking
- Storage: NetApp FAS (OnTAP), QNAP QTS, Synology DSM, TrueNAS Core/Scale, Dell PowerStore
- IaC / Automatyzacja: Terraform, Ansible, Bash, Python, PowerShell
- Monitoring / ITSM: Zabbix, Grafana, JIRA, Confluence, GLPI/CMDB

CERTYFIKATY I UPRAWNIENIA:
- CEH – Certified Ethical Hacker | EC-Council (2022) · ID: ECC3078195246
- Microsoft Azure Fundamentals (AZ-900) – Microsoft ESI (05.2025)
- CyberArk Certificate Manager – ClockWise (05.2025)
- ESET Advanced Administration – DAGMA (2022) · ID: 2022-5918-9765-6268
- ESET Management Client Security Professional – DAGMA (2022) · ID: LP21560
- Dahua Advanced Training IP Solution (2018) · ID: GEN-DHSPO1
- Kwalifikowany Pracownik Zabezpieczenia Technicznego II° – KSP (2015) · ID: PZT-19394
- Uprawnienia SEP do 1 kV [E] – eksploatacja urządzeń i sieci gr. 1 (2019–2024)
- Prawo jazdy kat. B (2008)

WYBRANE SZKOLENIA (2024–2025):
- Zabbix Training – Grupa ADM (04.2025)
- Power Protect Data Manager – Dell (03.2025)
- Grafana dla Początkujących – Grupa ADM (10.2024)
- FortiNet: FortiSandbox, Network Building & Security (08–09.2024)
- Bezpieczeństwo w Active Directory – Eclipso (09.2024)
- Dell PowerStore (04.2024)

ZAINTERESOWANIA:
- Homelabbing, symulacja środowisk produkcyjnych
- CI/CD, infrastruktura jako kod (IaC)
- SAP/ERP
- Model hybrydowy: Proxmox VE + sprzęt lokalny, VyOS, TrueNAS, WireGuard VPN, Cloudflare Tunnel, Active Directory, ZFS air-gap backup`;

const SYSTEM_PROMPT = `Jestes asystentem CV Krzysztofa Gawkowskiego — Senior IT Administratora z Poznania.
Odpowiadaj TYLKO na podstawie ponizszych danych CV. Odpowiadaj po polsku lub angielsku w zaleznosci od jezyka pytania.
Badz konkretny, zwiezly i profesjonalny. Jesli pytanie nie dotyczy CV ani kompetencji Krzysztofa, grzecznie odmow.
Nie wymyslaj informacji ktorych nie ma w CV.

=== CV KRZYSZTOFA GAWKOWSKIEGO ===
${CV_DATA}
=== KONIEC CV ===`;

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Bad Request", { status: 400 });
    }

    const userQuestion = (body.question || "").slice(0, 500).trim();
    if (!userQuestion) {
      return new Response(JSON.stringify({ error: "Brak pytania" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 400,
          temperature: 0.3,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userQuestion },
          ],
        }),
      },
    );

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return new Response(
        JSON.stringify({ error: "OpenAI API error", detail: err }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          },
        },
      );
    }

    const data = await openaiRes.json();
    const answer = data.choices?.[0]?.message?.content || "Brak odpowiedzi.";

    return new Response(JSON.stringify({ answer }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
    });
  },
};
