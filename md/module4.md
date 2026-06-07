# Module 4: Hoe werkt HTTP nu écht?

---

## 4.1 Request en response: het gesprek van het web

Je klikt op een link en een pagina laadt. Eenvoudig genoeg. Maar onder die klik zit een heel gesprek: jouw browser stuurt een **request** (verzoek) naar een server, en de server antwoordt met een **response** (antwoord). Dat is alles wat HTTP is: een protocol voor dat gesprek.

**HTTP** staat voor HyperText Transfer Protocol. Het is stateless: elke request staat op zichzelf. De server onthoudt niets van je vorige request, tenzij je dat zelf regelt via cookies, tokens of sessies.

Elke request bevat minstens een method, een URL en headers. Elke response bevat een statuscode, headers en optioneel een body. Die structuur geldt voor elk webverzoek dat je app ooit verstuurt of ontvangt.

Dit betekent voor jou: als een API-aanroep faalt, kijk je altijd naar zowel de request als de response. De fout zit soms in wat jij verstuurt, soms in wat de server teruggeeft.

### Test jezelf

**Vraag 1.** Wat betekent stateless in de context van HTTP?

a) Elke request staat op zichzelf; de server onthoudt niets van vorige requests zonder extra mechanisme
b) De server onthoudt alle requests automatisch in zijn cache
c) HTTP versleutelt elke request afzonderlijk
d) Clients mogen slechts één request per sessie sturen

**Vraag 2.** Jouw fetch-aanroep geeft geen resultaat terug. Hoe bepaal je of het probleem bij de request of de response zit?

**Vraag 3.** Noem de drie verplichte onderdelen van een HTTP-request.

---

## 4.2 HTTP methods: GET, POST en de rest

Niet elke request heeft dezelfde bedoeling. Je haalt data op anders dan je data aanmaakt. Daarvoor bestaan **HTTP methods** (HTTP-methoden): GET, POST, PUT, PATCH en DELETE zijn de meest gebruikte.

**GET** vraagt data op zonder bijwerkingen. **POST** stuurt data naar de server om iets nieuws aan te maken. **PUT** vervangt een bestaande resource volledig. **PATCH** past een deel ervan aan. **DELETE** verwijdert een resource.

REST APIs volgen die conventie. Dat maakt code leesbaarder en gedrag voorspelbaarder, zolang iedereen de afspraken respecteert.

Dit betekent voor jou: gebruik de juiste method voor de juiste actie. GET is geen alternatief voor POST als je data aanpast, ook al werkt het soms toevallig.

### Test jezelf

**Vraag 1.** Welke HTTP-method gebruik je om een bestaand record gedeeltelijk aan te passen?

a) PATCH
b) PUT
c) POST
d) GET

**Vraag 2.** Waarom is een GET-request niet geschikt om wachtwoorden of gevoelige data mee te sturen?

**Vraag 3.** Beschrijf het verschil tussen PUT en PATCH in één concrete situatie.

---

## 4.3 Headers: de metadata van je request

De body van een request bevat de data. Maar wie vertelt de server in welk formaat die data zit? Of welke taal de client verwacht? Of welk token de request autoriseert? Dat doet de **header** (koptekst).

Headers zijn sleutel-waardeparen die meegestuurd worden met elke request en response. Voorbeelden: `Content-Type: application/json`, `Authorization: Bearer <token>`, `Accept-Language: nl-BE`.

Ze zijn onzichtbaar in de browser, maar altijd aanwezig. DevTools laat ze zien. Jij moet weten welke headers je app nodig heeft en welke de server verwacht.

Dit betekent voor jou: veel API-fouten hebben niets met data te maken, maar met een ontbrekende of foute header. Check headers even routinematig als je statuscode.

### Test jezelf

**Vraag 1.** Welke header gebruik je om aan de server te zeggen dat je een JSON-body stuurt?

a) `Content-Type: application/json`
b) `Accept: text/html`
c) `Authorization: Basic`
d) `Cache-Control: no-store`

**Vraag 2.** Je POST-request geeft een 415 Unsupported Media Type terug. Welke header ontbreekt waarschijnlijk?

**Vraag 3.** Leg in je eigen woorden het verschil uit tussen `Content-Type` en `Accept`.

---

## 4.4 Statuscodes: wat bedoelt de server?

Je stuurt een request en krijgt een getal terug. Dat getal is de **statuscode** (statuscode). Die vertelt je in één oogopslag of het goed ging, fout ging, of iets anders.

De vijf reeksen:
- **1xx**: informatief, zelden relevant voor jou
- **2xx**: succes — 200 OK, 201 Created, 204 No Content
- **3xx**: redirect — 301 Moved Permanently, 302 Found
- **4xx**: clientfout — 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- **5xx**: serverfout — 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable

De meest verwarrende: 401 vs 403. 401 betekent "ik ken je niet", 403 betekent "ik ken je, maar je mag niet".

Dit betekent voor jou: als je API-aanroepen behandelt, reageer je op de statuscode, niet alleen op de aanwezigheid van een response body.

### Test jezelf

**Vraag 1.** Wat is het verschil tussen een 401 en een 403 statuscode?

a) 401 betekent niet geauthenticeerd, 403 betekent niet geautoriseerd
b) 401 is een serverfout, 403 is een clientfout
c) 401 is voor GET-requests, 403 voor POST-requests
d) Er is geen praktisch verschil

**Vraag 2.** Je app krijgt een 502. Wat is een waarschijnlijke oorzaak?

**Vraag 3.** Wanneer gebruik je 201 in plaats van 200 als responsecode?

---

## 4.5 HTTPS: waarom het slot ertoe doet

Je ziet het bijna niet meer — dat slotje in de adresbalk. Maar het maakt een fundamenteel verschil. **HTTPS** (HTTP Secure) is HTTP met een versleutelde verbinding via **TLS** (Transport Layer Security).

Zonder HTTPS reist data in plaintext over het netwerk. Iedereen die het verkeer kan onderscheppen, leest mee: wachtwoorden, tokens, creditcardnummers. Met HTTPS wordt alles versleuteld zodat alleen client en server de inhoud kunnen lezen.

TLS-certificaten dienen ook voor identiteitsverificatie: je bewijst dat je server echt is wie die beweert te zijn. Let's Encrypt maakt gratis certificaten bereikbaar voor iedereen.

Dit betekent voor jou: gebruik altijd HTTPS, ook in development voor omgevingen die op het netwerk bereikbaar zijn. HTTP is geen valide keuze meer, ook niet tijdelijk.

### Test jezelf

**Vraag 1.** Wat regelt TLS in HTTPS?

a) Versleuteling en authenticatie van de verbinding
b) Sneller laden van afbeeldingen
c) Automatische herstransmissie van verloren packets
d) Compressie van HTML-bestanden

**Vraag 2.** Wat is het praktische risico van een loginformulier dat via HTTP verstuurd wordt?

**Vraag 3.** Wat is het verschil tussen een zelfondertekend certificaat en een certificaat van een publieke CA zoals Let's Encrypt?

---

## 4.6 DevTools: alles live bekijken

Je hoeft niet te gokken wat er over de draad gaat. De browser vertelt het je zelf. Het **Network-tabblad in DevTools** toont elke request die jouw browser verstuurt: URL, method, headers, body, statuscode, timing en responsedata.

Open DevTools met F12 of rechtermuisknop → Inspecteren. Ga naar het tabblad Network en laad de pagina opnieuw. Je ziet nu het volledige HTTP-verkeer van je sessie.

Filter op Fetch/XHR om alleen API-calls te zien. Klik op een request om detail te zien: Request Headers, Response Headers, Preview en Response.

Dit betekent voor jou: DevTools is je eerste debugtool voor alle HTTP-problemen. Kijk er altijd in vóór je code aanpast. Wat je ziet, is de waarheid — niet je aanname over wat verstuurd wordt.

### Test jezelf

**Vraag 1.** Welk DevTools-tabblad gebruik je om HTTP-requests van een webpagina te inspecteren?

a) Network
b) Console
c) Sources
d) Performance

**Vraag 2.** Je fetch-request stuurt een body mee, maar de server ontvangt niets. Hoe bevestig je in DevTools of de body correct verstuurd werd?

**Vraag 3.** Wat toont de timing-kolom in het Network-tabblad en waarom is dat nuttig?

---

## Oefeningen Module 4

### Easy

**E1.** Stuur met curl een GET-request naar `https://httpbin.org/get`. Beschrijf de structuur van de response.

**E2.** Maak een tabel van de vijf HTTP-methods met beschrijving, typisch gebruik en een voorbeeld-URL.

**E3.** Zoek in DevTools de request headers op van één API-call die je app maakt. Noteer drie headers en leg ze uit.

**E4.** Verklaar in je eigen woorden het verschil tussen 200, 201, 204 en 400.

**E5.** Zoek op welk statuscode je terugkrijgt bij een pagina die verplaatst is naar een nieuwe URL en nooit terugkomt.

**E6.** Maak het verschil duidelijk tussen `Content-Type` en `Accept` aan de hand van een concreet voorbeeld met een JSON API.

**E7.** Leg uit wat stateless betekent in HTTP en geef één voorbeeld van hoe een app dat compenseert.

**E8.** Inspecteer in DevTools het verkeer van een login op een willekeurige testwebsite. Welke method en statuscode zie je?

---

### Medium

**M1.** Schrijf een mini-API-client in een taal naar keuze die GET, POST en DELETE aanroept op `https://jsonplaceholder.typicode.com`. Log statuscode en body per aanroep.

**M2.** Analyseer het verschil in gedrag bij dezelfde endpoint met en zonder `Authorization`-header. Documenteer beide responses volledig.

**M3.** Bouw een tabel van minstens tien statuscodes die jij in je eigen projecten al bent tegengekomen. Geef per code context en hoe je erop reageert.

**M4.** Vergelijk HTTP/1.1 en HTTP/2 op het vlak van multiplexing, headers en performance. Lever een korte samenvatting voor een junior developer.

**M5.** Schrijf een foutafhandelingspatroon voor fetch-aanroepen in JavaScript dat correct omgaat met 4xx, 5xx en netwerkfouten.

**M6.** Analyseer een case: een POST-request geeft 400 terug, maar je bent zeker dat de data correct is. Geef drie hypotheses en bijhorende debugstappen.

**M7.** Test een API met een ontbrekende `Content-Type`-header. Documenteer het gedrag van de server en de correcte oplossing.

**M8.** Maak een overzicht van alle HTTP-requests die jouw favoriete Vlaamse website maakt bij het laden. Hoeveel zijn er? Welke zijn kritisch?

**M9.** Schrijf een korte handleiding voor teamgenoten: "Hoe lees je een API-fout in DevTools in vijf stappen."

**M10.** Vergelijk CORS-fouten met gewone HTTP-fouten. Hoe herken je een CORS-probleem in DevTools?

---

### Hard

**H1.** Ontwerp een foutafhandelingslaag voor een REST API die zinvolle statuscodes en foutberichten teruggeeft. Gebruik Belgische wetgeving als context voor privacygevoelige data.

**H2.** Analyseer de TLS-handshake in Wireshark tijdens een HTTPS-verbinding. Beschrijf wat je ziet in de eerste vijf pakketten.

**H3.** Schrijf een technisch document: "Veilige API-communicatie voor beginners". Behandel HTTPS, tokens, headers en input validatie.

**H4.** Bouw een testplan voor de volledige HTTP-flow van een loginformulier: request, headers, statuscode, cookie, redirect en authenticatiefout.

**H5.** Onderzoek HTTP-caching met `ETag`, `Cache-Control` en `Last-Modified`. Documenteer wanneer caching nuttig is en wanneer het een debugprobleem wordt.

**H6.** Maak een vergelijking van REST en GraphQL op het vlak van HTTP-gebruik, statuscodes en debugbaarheid.

**H7.** Analyseer een realistisch incident: een productie-API geeft plots 502 terug. Geef vermoedelijke oorzaken, testplan en escalatielogica.

**H8.** Schrijf een beveiligingsaudit checklist voor een eenvoudige REST API: welke headers, methoden en statuscodes zijn verplicht vanuit securityperspectief?

---

### At Home

**AT1. HTTP-dagboek** meerdere uren over meerdere sessies

Inspecteer gedurende drie dagen elke dag minstens vijf API-calls in DevTools. Documenteer per call de method, headers, statuscode en wat je eruit leert. Sluit af met een patroonanalyse.

**AT2. Bouw een HTTP-client van nul** meerdere uren

Schrijf een minimale HTTP-client zonder externe libraries in een taal naar keuze. Ondersteun minstens GET en POST. Toon dat je headers en statuscode correct verwerkt. Documenteer je keuzes.

**AT3. TLS-verkenning** één dag

Onderzoek het TLS-certificaat van vijf websites: wie heeft het uitgegeven, wanneer verloopt het, en welke encryptie wordt gebruikt. Schrijf een analyse van wat je ziet en wat er zou gebeuren als een certificaat verloopt.
