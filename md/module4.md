# Module 4: The WW..H, the Wonderful World of HTTP

---

## 4.1 Wij moeten eens praten

Je klikt op een link en een pagina laadt. Eenvoudig genoeg. Maar onder die klik zit een heel gesprek: jouw browser stuurt een **request** (verzoek) naar een server, en de server antwoordt met een **response** (antwoord). Dat is alles wat HTTP is: een protocol voor dat gesprek.

**HTTP** staat voor **HyperText Transfer Protocol**. Het is een tekstgebaseerd protocol dat werkt bovenop TCP: de browser bouwt eerst een TCP-verbinding op met de server en stuurt daarna een leesbaar tekstbericht. Een minimale HTTP-request ziet er zo uit:

```
GET /index.html HTTP/1.1
Host: www.voorbeeldwebsite.be
```

Twee regels, meer is er niet nodig om "het internet" te laten werken. De eerste zegt wat je wil doen (`GET`), welke resource je wil (`/index.html`) en welke versie van HTTP je gebruikt (`HTTP/1.1`). De tweede zegt naar welke server je de request gaat sturen. De server antwoordt met een **response**:

```
HTTP/1.1 200 OK
Content-Type: text/html

<html>...</html>
```

Eerst de statusregel (versie + statuscode + beschrijving), dan headers, dan een lege regel, dan de body met de eigenlijke content. Dat patroon van request met methode, pad en headers; response met statuscode, headers en body is de backbone van het web. Alles wat je doet als developer gaat dit patroon volgen.

HTTP is **stateless**: elke request staat op zichzelf. De server onthoudt niets van vorige requests, dus weet ook niet of twee requests van dezelfde persoon komen. Dat is een beperking, maar het is ook de reden waarom HTTP zo eenvoudig en schaalbaar is. In andere web-gerelateerde opleidingsonderdelen gaan we kijken naar oplossingen voor dit stateless probleem.

### Test jezelf

**Vraag 1.** Wat betekent stateless in de context van HTTP?

- Elke request staat op zichzelf; de server onthoudt niets van vorige requests
- De server onthoudt alle requests automatisch in zijn cache
- Het is een request waar geen OK-status voor kan worden teruggegeven
- Clients mogen slechts één request per sessie sturen

**Vraag 2.** Wat betekent het dat HTTP "tekstgebaseerd" is, en wat is het voordeel daarvan voor developers?

---

## 4.2 GET, POST en anderen

Een HTTP-request begint altijd met een **method** (methode), het werkwoord dat zegt wat je wil doen. Die keuze is wel belangrijk, hoewel dat dat niet altijd zichtbaar is. Elke method heeft een betekenis en deze correct gebruiken maakt het developpen (zeker APIs) gemakkelijker.

**GET** vraagt data op. Een GET-request heeft geen body en verandert niets op de server. Je kunt een GET-request onbeperkt herhalen zonder bijwerkingen. Gebruik GET voor alles wat je ophaalt: een lijst van producten, een profiel, een zoekopdracht, ...

**POST** stuurt data naar de server om iets nieuws aan te maken. Een POST heeft wel een body. Twee identieke POST-requests maken twee objecten aan. Gebruik POST wanneer je een nieuw record aanmaakt, een formulier indient, ...

**PUT** vervangt een bestaande resource volledig. Je stuurt de volledige nieuwe versie mee. **PATCH** past een resource gedeeltelijk aan, je stuurt alleen de velden die veranderen. In een API voor gebruikersbeheer gebruik je PUT om een heel profiel te vervangen en PATCH om bvb alleen het e-mailadres bij te werken.

**DELETE** verwijdert een resource. Net als GET heeft het typisch geen body.

**HEAD** werkt als GET, maar de server stuurt alleen de headers terug, geen body. Handig om te controleren of een resource bestaat of hoe groot hij is zonder hem volledig te downloaden (denk aan grotere afbeeldingen of PDF bestanden).

**OPTIONS** vraagt welke methods de server ondersteunt voor een bepaalde URL.

In de praktijk zit de grootste valkuil hier: sommige developers gebruiken GET voor alles, inclusief acties die data wijzigen. Dat is verkeerd want GET-requests worden gecached, gelogd en kunnen opnieuw uitgevoerd worden door browsers en proxies. In de web-vakken gaan we trouwens dieper in op deze verschillen.

### Test jezelf

**Vraag 1.** Welke HTTP-method gebruik je om een bestaand record gedeeltelijk aan te passen?

- PATCH
- PUT
- POST
- GET

**Vraag 2.** Waarom is een GET-request niet geschikt om wachtwoorden of gevoelige data mee te sturen?

---

## 4.3 Je moet je headers erbij houden

Een HTTP-bericht bestaat uit meer dan alleen een method en een body. De **headers** zijn de metadata (informatie over de informatie): hoe moet de boodschap geïnterpreteerd worden, wie stuurt ze, welk antwoord verwachten ze, ... Ze zijn onzichtbaar voor de eindgebruiker maar zijn voor onsals  developer wel belangrijk.

Headers zijn key/value-pairs, één per regel. Hier een voorbeeld:

```
Content-Type: application/json
Authorization: Bearer eyJhbGc...
Accept: application/json
Cache-Control: no-cache
```

Een aantal headers zijn, net zoals poorten, echt overal terug te vinden dus is het goed om te weten wat ze precies doen:
- **Content-Type**: Zegt in welk formaat de body van het bericht is. `application/json` voor JSON-data, `text/html` voor HTML, `multipart/form-data` voor bestandsuploads. Je zegt aan de ontvanger hoe de data moet bekeken worden.
- **Authorization**: Draagt authenticatiegegevens. De meest voorkomende vorm is een **Bearer token**: `Authorization: Bearer <token>`. Dit zie je bij JWT-authenticatie en OAuth. De server controleert dit token bij elke request.
- **Accept**: Zegt in welk formaat de client het antwoord wil. `Accept: application/json` vraagt de server om JSON terug te sturen. Een server die meerdere formaten ondersteunt, gebruikt dit om te beslissen wat hij stuurt.
- **Cache-Control**: Bepaalt of en hoe lang een response gecached mag worden. `Cache-Control: no-cache` zegt dat de response niet gecached mag worden. `Cache-Control: max-age=3600` zegt dat hij een uur geldig is.
- **CORS-headers**: Regelen toegang vanuit andere origins. `Access-Control-Allow-Origin: *` laat alle origins toe.

Naast request-headers zijn er ook **response-headers**. `Location` vertelt de client waar hij naartoe moet na een redirect. `Set-Cookie` plaatst een cookie. `Content-Length` zegt hoe groot de body is.

### Test jezelf

**Vraag 1.** Welke header gebruik je om aan de server te zeggen dat je een JSON-body stuurt?

- `Content-Type: application/json`
- `Accept: application/json`
- `Authorization: json`
- `Cache-Control: no-store`

---

## 4.4 De origine van de 404 moppen

De server antwoordt altijd met een getal van drie cijfers. Dat getal is de **statuscode**, de snelste manier om te zien of een request gelukt is, mislukt is, of iets anders vereist. Ze zijn gegroepeerd per honderdtal, waarbij elke honderd responses een andere "categorië" aanduiden.

**1xx, Informatief:** De server heeft de request ontvangen en is bezig. In de praktijk gaan we deze boodschappen amper te zien krijgen.

**2xx, Succes:** `200 OK` is de standaard succesmelding. `201 Created` gebruik je na een POST die iets nieuws aanmaakt. Het bevestigt dat de resource aangemaakt is en stuurt vaak de URL van het nieuwe object mee in de `Location`-header.

**3xx, Redirect:** De resource is ergens anders. `301 Moved Permanently` zegt dat de resource definitief verhuisd is, browsers en zoekmachines onthouden dit. `302 Found` is een tijdelijke redirect. `304 Not Modified` betekent dat de gecachte versie nog geldig is en de server geen nieuwe body stuurt.

**4xx, Fout van de client:** `400 Bad Request`, de server begrijpt de request niet (ontbrekende of ongeldige data). `401 Unauthorized`, je bent niet geauthenticeerd (geen of ongeldig token). `403 Forbidden`, je bent geauthenticeerd, maar hebt geen toegang tot deze resource. `404 Not Found`, de resource bestaat niet. `405 Method Not Allowed`, de methode is niet toegestaan op dit eindpunt.

**5xx, Fout van de server:** `500 Internal Server Error`, er is iets fout gegaan aan de serverkant en de server weet zelf niet precies wat. `502 Bad Gateway`, de server fungeerde als proxy en het achterliggende systeem reageerde fout. `503 Service Unavailable`, de server is tijdelijk niet beschikbaar (overbelasting of onderhoud).

Het verschil tussen 401 en 403 is een klassieker: 401 zegt "ik weet niet wie je bent", 403 zegt "ik weet wie je bent, maar je mag dit niet". In een goed gebouwde API gebruikt elke statuscode precies de juiste code voor de situatie. Dat maakt het debuggen en de communicatie met andere developers een stuk eenvoudiger.

Dit is ook maar een kleine greep uit het aanbod van alle HTTP status codes. Zoek zelf bijvoorbeeld eens "`HTTP error 418`" op en zeg dan maar dat developers geen gevoel voor humor hebben!

### Test jezelf

**Vraag 1.** Wat is het verschil tussen `401 Unauthorized` en `403 Forbidden`, en wanneer gebruik je welke?

**Vraag 2.** Wanneer gebruik je 201 in plaats van 200 als responsecode?

---

## 4.5 Lock it up!

Zoals we al daarjust hebben gezegd, HTTP verstuurt alles als leesbare tekst. Dat heeft wel enkele implicaties, bijvoorbeeld dat iedereen die het verkeer kan onderscheppen (op een publiek wifi-netwerk, bij je internetprovider, ergens onderweg in het netwerk, ...) je wachtwoorden, sessietokens en persoonlijke data gewoon kan lezen. **HTTPS** lost dat op.

**HTTPS** is HTTP over **TLS** (Transport Layer Security, vroeger bekend als **SSL**). TLS voegt een versleutelde laag toe tussen TCP en HTTP. Voordat er ook maar één byte aan HTTP-data verstuurd wordt, voeren de client en server een **TLS handshake** uit: ze spreken een encryptiemethode af, de server toont zijn **certificaat** (een digitaal bewijs van identiteit) en beide kanten genereren samen een geheime sleutel waarmee alle verdere communicatie versleuteld wordt.

Een **TLS-certificaat** bevat de domeinnaam van de server en een digitale handtekening van een **Certificate Authority**, een vertrouwde organisatie die bevestigt dat de server is wie hij beweert te zijn. Je browser heeft een lijst van vertrouwde CA's ingebouwd. Staat de handtekening van een onbekende of verlopen CA op het certificaat, dan zie je een waarschuwing in de aard van "uw verbinding is niet privé".

Als developer zijn er twee praktische gevolgen. Eerste en vooral, gebruik altijd HTTPS, ook in staging en testomgevingen. Browsers markeren HTTP-sites steeds vaker als "niet veilig" en sommige browser API's (zoals geolocation) weigeren te werken zonder HTTPS. Tools zoals **Let's Encrypt** geven gratis en automatisch verlengbare certificaten.

Ten tweede, begrijp dat HTTPS de inhoud van het verkeer verbergt, maar niet het feit dat er verkeer is. Je internetprovider (of eigenaar van het publieke netwerk waarop je aan het surven bent) ziet nog steeds met welke server je verbindt (via de domeinnaam in het certificaat en via DNS), maar niet wat je precies stuurt of ontvangt.

### Test jezelf

**Vraag 1.** Wat is het praktische risico van een loginformulier dat via HTTP verstuurd wordt?

**Vraag 2.** Wat is het verschil tussen een zelfondertekend certificaat en een certificaat van een publieke CA zoals Let's Encrypt?

---

## 4.6 Piep eens achter de schermen

Je moet HTTP niet zomaar geloven op basis van uitleg. Je kunt elke request en elke response die je browser maakt live bekijken, inspecteren en analyseren. De **DevTools** van je browser laten je toe om eens onder de motorkap van het internet te kijken.

Open DevTools in Chrome, Edge of Firefox met `F12` of `Ctrl+Shift+I` (Windows/Linux) of `Cmd+Option+I` (macOS). Ga naar het tabblad **Network**. Laad een pagina opnieuw. Je ziet elk request dat de browser stuurt: de URL, de method, de statuscode, de grootte, de laadtijd.

Klik op een request om de details te zien. Je vindt er de **Request Headers**, alles wat de browser meestuurt, inclusief cookies, Authorization-headers en Content-Type. Je vindt de **Response Headers**, wat de server teruggestuurd heeft. Je vindt de **Preview** of **Response**, de eigenlijke inhoud van de response en je vindt de **Timing**, hoeveel tijd elke fase van de verbinding duurde (DNS-lookup, TCP-verbinding, TLS-handshake, wachten op de server, downloaden van de response).

Filters maken DevTools bruikbaar bij drukke pagina's. Gebruik `XHR` of `Fetch` om alleen API-calls te zien. Gebruik `Doc` voor HTML-documenten, `JS` voor scripts, `Img` voor afbeeldingen. Je kunt ook filteren op statuscode of domeinnaam.

De knop **Preserve log** zorgt dat requests niet gewist worden bij een paginanavigatie, ideaal om formuliersubmissies of redirects te debuggen. **Disable cache** zorgt dat de browser altijd de laatste versie ophaalt in plaats van een gecachte versie te tonen.

`curl` is het CLI alaternatief. Hoewel DevTools visueel is en interactief heeft `curl` ook wat voordelen, het is namelijk scriptbaar en preciezer. `curl -v https://api.example.com/users` toont de volledige request en response inclusief headers. `curl -X POST -H "Content-Type: application/json" -d '{"name":"Jan"}' https://api.example.com/users` stuurt een POST met JSON-body.

### Test jezelf

**Vraag 1.** Je fetch-request stuurt een body mee, maar de server ontvangt niets. Hoe bevestig je in DevTools of de body correct verstuurd werd?

**Vraag 2.** Wat toont de timing-kolom in het Network-tabblad en waarom is dat nuttig?

---

## Oefeningen Module 4

### Easy

**E1.** Stuur met curl een GET-request naar `https://httpbin.org/get`. Beschrijf de structuur van de response.

**E2.** Zoek op welk statuscode je terugkrijgt bij een pagina die verplaatst is naar een nieuwe URL en nooit terugkomt.

**E3.** Inspecteer in DevTools het verkeer van een login op een willekeurige testwebsite. Welke method en statuscode zie je?

**E4.** Open DevTools in je browser en laad `https://www.vrt.be`. Noteer: hoeveel requests worden er gemaakt bij het laden van de pagina? Wat is de statuscode van het eerste request? Welke Content-Type heeft de HTML-response?

---

### Medium

**M1.** Maak een overzicht van alle HTTP-requests die jouw favoriete website maakt bij het laden. Hoeveel zijn er? Welke zijn kritisch?

**M2.** Schrijf een korte handleiding voor teamgenoten: "Hoe lees je een API-fout in DevTools in vijf stappen."

**M3.** Onderzoek wat **CORS** (Cross-Origin Resource Sharing) is en wanneer het optreedt. Bouw een situatie na waarbij CORS een request blokkeert: een eenvoudige HTML-pagina die via JavaScript een fetch doet naar een andere origin. Documenteer de foutmelding en de oplossing.

**M4.** Gebruik DevTools om de laadtijd van `https://www.belgium.be` te analyseren. Identificeer de drie traagste requests. Wat laadt er traag? Is het een DNS-probleem, een serverresponstijd, of een grote payload?

---

### Hard

**H1.** Analyseer een realistisch incident: een productie-API geeft plots 502 terug. Geef vermoedelijke oorzaken, testplan en escalatielogica.

**H2.** Schrijf een beveiligingsaudit checklist voor een eenvoudige REST API: welke headers, methoden en statuscodes zijn verplicht vanuit securityperspectief?

**H3.** Een collega wil een beveiligingsprobleem oplossen door gevoelige data in HTTP-headers te verbergen in plaats van in de URL. Hij stuurt het gebruikers-ID mee in een custom header `X-User-ID`. Evalueer dit voorstel kritisch: is het veiliger dan een URL-parameter, wat zijn de risico's, en wat is de correcte aanpak voor het meesturen van authenticatie-informatie?

---

### At Home

**AT1. Nog geen idee, is over nadenken**
