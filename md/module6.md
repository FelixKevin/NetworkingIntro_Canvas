# Module 6: Hoe beginnen we te deployen?

---

## 6.1 Staat het nu wel op mijn eigen machine?

Je hebt weken aan je applicatie gewerkt. Alles werkt. De tests slagen, de pagina laadt, de data komt binnen. Dan deploy je naar een server... én niets werkt meer. Hoera, je bent nu een echte developer want je bent bij deployment-issues terecht gekomen!

Het probleem zit zelden in je code zelf. Het zit in het verschil tussen de omgeving waarin je ontwikkelt en de omgeving waarin je applicatie draait. Je laptop is een vertrouwde, geconfigureerde, persoonlijke machine vol tools, instellingen en bestanden die er gewoon zijn omdat jij ze ooit geïnstalleerd hebt. Een server is een blanco, gedeelde, geautomatiseerde omgeving die niets weet van jouw gewoonten.

**Lokaal** betekent: jouw machine, jouw besturingssysteem, jouw versie van Node.js, Python, ..., jouw databaseconfiguratie, jouw omgevingsvariabelen, jouw mappenstructuur. Alles staat precies zoals jij het neergezet hebt.

**Op een server** draait (meestal) een minimale Linux install zonder grafische interface, met beperkte schijfruimte, beperkt geheugen en alleen de software die er expliciet op gezet is. De server heeft geen idee wat jij lokaal hebt staan.

De kloof tussen die twee omgevingen is de bron van verreweg de meeste deployment-problemen. Begrijpen wat er op een server anders is dan op jouw laptop is de eerste stap naar het oplossen en voorkomen van die problemen.

### Test jezelf

**Vraag 1.** Je applicatie gebruikt lokaal een `.env`-bestand met databasecredentials. Na deployment naar een server werkt de databaseverbinding niet. Wat is de meest waarschijnlijke oorzaak?

- Het `.env`-bestand staat niet op de server — omgevingsvariabelen moeten apart geconfigureerd worden in de serveromgeving, los van je lokale bestanden
- Servers ondersteunen geen `.env`-bestanden
- De database draait niet op de server
- De databasecredentials zijn verlopen na de deployment

**Vraag 2.** Hoe documenteer je je lokale omgeving zodat anderen die kunnen reproduceren?

---

## 6.2 Hoe krijg ik dezelfde data bij verschillende users?

De termen "client" en "server" duiken overal op in deze cursus, maar de verhouding ertussen is eigenlijk ingewikkelder dan dat het er op het eerste zicht uit ziet. Het is geen vast onderscheid tussen twee soorten machines, het is een **rol** die een machine of een stuk software op een bepaald moment speelt. Een machine kan een server zijn voor één service, maar een client voor een andere.

Een **server** is elk programma dat wacht op verbindingen en verzoeken beantwoordt. Een **client** is elk programma dat een verbinding initieert en een verzoek stuurt. Je browser is een client ten opzichte van een webserver. Maar die webserver is zelf een client ten opzichte van een databaseserver. En die databaseserver kan zelf een verzoek sturen naar een back-upserver.

Dit onderscheid heeft praktische gevolgen. **Servers luisteren**, ze binden zich aan een poort en wachten op inkomende verbindingen. **Clients verbinden**, ze openen een verbinding naar een server op een specifiek adres en poort. Die richting bepaalt wie verantwoordelijk is voor wat: de server moet bereikbaar zijn (juist IP, open poort, firewall), de client moet weten waar hij naartoe moet (correct adres en poort in de configuratie).

In een typische webapplicatie zijn er minstens drie lagen. De **frontend** draait in de browser van de gebruiker (een client). De **backend** (je API of webserver) draait op een server en ontvangt requests van de frontend. Maar diezelfde backend is een client ten opzichte van de **database**, die op zijn beurt als server luistert op een poort.

Wanneer je een verbindingsprobleem debugt, is de eerste vraag altijd: wie is hier de client en wie de server? De client heeft een foutmelding, maar de oorzaak ligt bij de server. Dat is de meest voorkomende verwarring bij beginners.

### Test jezelf

**Vraag 1.** In een typische webapplicatie, wat is de relatie tussen frontend, backend en database?

- Frontend is client van de backend; backend is tegelijk server voor de frontend en client van de database
- Frontend en backend zijn beide servers, database is de client
- Database is de centrale server voor zowel frontend als backend direct
- De rollen zijn altijd vast en kunnen niet wisselen afhankelijk van context

**Vraag 2.** Een Node.js-applicatie maakt verbinding met een Redis-cache. Op welk moment is de Node.js-applicatie een server, en op welk moment een client?

---

## 6.3 Wat gebeurt er als je iets deployt?

"Deployen" klinkt groot en magisch. In de werkelijkheid is het veel minder sexy en is het eerder een grote checklist aan dingen die je moet ondernemen om je applicatie draaiende te krijgen. Begrijpen wat er achter de schermen gebeurt maakt het verschil tussen deployment als black box en deployment als iets wat je controleert.

De basisstappen van een deployment zijn altijd hetzelfde, losstaand van de tool die je gebruikt.

1. **Code overdragen:** Je code moet op de server komen. Dat kan via `git pull`, via een CI/CD-pipeline die automatisch deployt (later in de opleiding meer hierover) na een push naar een branch, of via directe bestandsoverdracht met SCP of SFTP (niet gewenst, maar soms nog gebruikt).
2. **Dependencies installeren:** Je applicatie heeft libraries nodig. Op de server voer je bijvoorbeeld `npm install` en `pip install -r requirements.txt` uit. Dit installeert precies de versies die in je lockfile staan.
3. **Omgevingsvariabelen instellen:** Wachtwoorden, API-sleutels, databaseurls, ... staan hopelijk niet in je code en niet in je Git-repository. Ze worden apart geconfigureerd op de server, via een `.env`-bestand, via omgevingsvariabelen in het OS, of via een secret manager.
4. **Migrations uitvoeren:** Als je database een nieuwe structuur nodig heeft, voer je de migraties uit voor je de nieuwe versie van de applicatie start.
5. **Applicatie starten of herstarten:** De applicatie wordt gestart als een achtergrondproces. Tools zoals **PM2** (Node.js), **Gunicorn** (Python), of **systemd**-services zorgen dat de applicatie blijft draaien, automatisch herstart na een crash en opnieuw opstart na een server reboot.
6. **Verkeer doorsturen:** Een reverse proxy zoals **nginx** of **Caddy** ontvangt het inkomende verkeer op poort 80 of 443 en stuurt het door naar de applicatie op een interne poort (bv. 3000). Zo hoeft de applicatie zelf niet als root te draaien en kun je meerdere applicaties op één server hosten.

Elke stap die je overslaat of vergeet, is een potentiële oorzaak van een deployment die niet werkt.

### Test jezelf

**Vraag 1.** Welke stap mag tijdens een deployment nooit overgeslagen worden?

- Databasemigraties uitvoeren vóór de nieuwe code actief wordt
- De repository publiek zetten
- Alle logs wissen vóór de start
- De server handmatig herstarten zonder checklist

**Vraag 2.** Waarom gebruik je een lockfile (`package-lock.json`, `Pipfile.lock`) bij het installeren van afhankelijkheden op een server, in plaats van gewoon de laatste versies te installeren?

---

## 6.4 "Maar het werkt bij mij thuis"

"Máár het werkt op mijn machine" is de frustrerende zin in softwareontwikkeling. Ze wordt gezegd met een mengeling van oprechte verwarring en lichte schaamte en ze is bijna altijd het begin van tranen, frustraties en debugpogingen.

De oorzaken zijn altijd variaties op hetzelfde thema: de omgeving op de server is anders dan de omgeving op jouw eigen toesten.

**Versieverschillen** zijn de meest voorkomende oorzaak. Je ontwikkelt op Node.js 20, de server draait Node.js 16. Je gebruikt een Python 3.11-feature, de server heeft Python 3.9. Een library gedraagt zich anders in versie 4.x dan in versie 3.x. Pinning van versies in je configuratiebestanden helpt, maar lost het probleem niet volledig op als de runtime zelf verschilt.

**Besturingssysteemverschillen** zijn moeiijker te achterhalen. Je ontwikkelt op macOS of Windows, de server draait Linux. Bestandspaden gebruiken een andere scheidingsteken (`\` vs `/`). Bestandsnamen zijn hoofdlettergevoelig op Linux maar niet op macOS — je bestand heet `Foto.jpg`, je code verwijst naar `foto.jpg` en lokaal werkt het toevallig maar op de server niet.

**Ontbrekende enviornment variables** ken je ondertussen. Maar er zijn subtielere vormen: een variabele die lokaal aanwezig is omdat je hem ooit ergens globaal gezet hebt zonder dat je dat nog weet. Op de server bestaat hij niet.

**Netwerkbeperkingen** op servers zijn strenger. Lokaal staat alles open. Op een productieserver blokkeert de firewall uitgaand verkeer naar bepaalde diensten, of de server heeft geen DNS-configuratie voor interne hostnamen.

De structurele oplossing voor al deze problemen is **containerisatie**, iets waar we in de volgende module dieper op ingaan. Door je applicatie en zijn volledige omgeving samen in een container te verpakken wordt "het werkt op mijn machine" de garantie dat het ook op de server werkt, want de machine is overal dezelfde.

Tot we daaraan toe zijn: **documenteer alles, ook je omgeving**. Zet de vereiste versies in een `README`. Gebruik een `.env.example` als template voor omgevingsvariabelen. Automatiseer de setupstappen in een script, als dat kan. Je toekomstige collega (en jij als je 5 maand later nog eens gaat kijken naar dat project) zullen je dankbaar zijn.

### Test jezelf

**Vraag 1.** Wat is de beste manier om omgevingsspecifieke configuratie te beheren?

- Via omgevingsvariabelen of .env-bestanden, niet hardcoded in de broncode
- Via commentaar in de code dat je voor productie aanpast
- Via een aparte branch voor elk omgeving
- Via een README die collega's handmatig volgen

**Vraag 2.** Geef twee concrete voorbeelden van hardcoded aannames die problemen geven op een productieserver.

---

## 6.5 Is de server dood?

Voordat je begint te graven in logs, configuraties en code, stel je één simpele vraag: is de server eigenlijk bereikbaar? Het antwoord heb je in tien seconden met `ping`.

```bash
ping mijnserver.be
```

Reageert de server niet op ping? Dan is er een basisverbindingsprobleem: de server is offline, het IP-adres klopt niet, of de firewall blokkeert ICMP-verkeer (wat sommige servers doen, waardoor ping onbetrouwbaar wordt als enige test).

Reageert ping wel maar is de applicatie niet bereikbaar? Dan is de server online maar is er iets mis met de applicatie of de firewall op poortniveau. Test dan specifiek de poort:

```bash
nc -zv mijnserver.be 443
```

De `-z`-vlag bij netcat test alleen of de poort open staat, zonder data te sturen. De `-v`-vlag geeft verbose output zodat je het resultaat kunt lezen.

Eenmaal op de server ingelogd via SSH, herhaal je dezelfde tests maar dan van binnenuit. Kan de server zichzelf bereiken op de applicatiepoort? Draait de applicatie? Luistert hij op de verwachte poort?

```bash
curl localhost:3000
netstat -tlnp | grep 3000
```

Die combinatie van buitenaf testen en van binnenuit testen vertel je precies waar het probleem zit: in het netwerk, in de firewall, of in de applicatie zelf.

### Test jezelf

**Vraag 1.** Wat toont een succesvolle ping-respons aan?

- De machine is bereikbaar via het netwerk en ICMP is niet geblokkeerd
- De webserver is actief en antwoordt HTTP-requests
- De database is bereikbaar en queries werken
- De TLS-certificaten zijn geldig

**Vraag 2.** Waarom is een mislukte ping geen bewijs dat een server volledig offline is?

**Vraag 3.** Waarom is het nuttig om dezelfde connectiviteitstests zowel van buitenaf als van binnenuit de server uit te voeren?

---

## 6.6 EHBD: Eerste Hulp Bij Deploymentissues

Een deployment gaat ooit fout gaan. Het is geen kwesite van "if, but when" en meestal is de "when" op het slechtst mogelijke moment. Maar de fouten die gemaakt worden zijn verrassend voorspelbaar. En als je fouten al is hebt gezien zijn ze meestal gemakkelijker om de volgende keer op te lossen.

**Fout 1: Omgevingsvariabelen ontbreken of zijn verkeerd.** De applicatie crasht bij het starten met een vage fout, of draait maar kan geen verbinding maken met de database. Controleer altijd als eerste: zijn alle vereiste omgevingsvariabelen aanwezig op de server? Gebruik een `.env.example` als checklist en vergelijk dat met wat er effectief geconfigureerd is.

**Fout 2: Poort al in gebruik.** Je herstart de applicatie na een update, maar ze start niet op omdat de oude instantie nog draait op dezelfde poort. `netstat -tlnp | grep 3000` toont je welk proces de poort bezet.

**Fout 3: Permission errors.** De applicatie kan een bestand niet lezen of schrijven. Op Linux heeft elk bestand een eigenaar en permissies. Als je applicatie draait als gebruiker `www-data` maar het logfile eigendom is van `root` krijg je een permission fout. Controleer met `ls -la` en pas aan met `chown` of `chmod`.

**Fout 4: Firewall blokkeert de poort.** De applicatie draait en luistert correct, maar van buitenaf is er geen verbinding. Je hebt de poort vergeten te openen in `ufw` of de security group van je cloudprovider. `ufw status` en de consolepagina van je provider zijn je eerste stops.

**Fout 5: Nginx of reverse proxy misconfiguratie.** De nginx-configuratie verwijst naar de verkeerde poort, heeft een typfout in de servernaam, of de configuratie is aangepast maar nginx is niet herladen (`nginx -t` test de configuratie, `systemctl reload nginx` past hem toe zonder downtime).

**Fout 6: Database niet bereikbaar vanuit de applicatie.** De database luistert op `127.0.0.1` en is niet bereikbaar van een andere machine, of de firewall blokkeert de databasepoort. Controleer de `bind-address` in de databaseconfiguratie en de firewallregels. Overweeg een SSH-tunnel als de database niet publiek bereikbaar hoeft te zijn.

**Fout 7: SSL-certificaat verlopen of niet geconfigureerd.** Browsers weigeren de verbinding met een duidelijke foutpagina. `curl -v https://jouwdomein.be` toont de certificaatdetails. Let's Encrypt-certificaten verlopen na 90 dagen, stel automatische verlenging in met Certbot en verifieer dat de crontaak actief is.

Elk van deze fouten heeft één gemeenschappelijke eigenschap: ze zijn volledig te vermijden met een deployment-checklist die je vóór elke deployment doorloopt. Maak die checklist. Gebruik hem. Pas hem aan wanneer je een nieuwe fout tegenkomt.

### Test jezelf

**Vraag 1.** Wat is de meest risicovolle deployment die je kan doen?

- Een deployment zonder rollback-plan, vlak voor een weekend of piekperiode
- Een deployment van een nieuw kleurenschema
- Een deployment met extra logging
- Een deployment waarbij alleen CSS aangepast is

**Vraag 2.** Wat is een rollback en wanneer voer je die uit?

**Vraag 3.** Noem drie punten op een deployment checklist die elke developer zou moeten hanteren.

---

## Oefeningen Module 6

### Easy

**E1.** Voer `ping` uit naar een bekende server en naar een onbestaand adres. Beschrijf het verschil in output.

**E2.** Beschrijf het verschil tussen een ontwikkelomgeving, een testomgeving en een productieomgeving in vijf zinnen.

**E3.** Leg het verschil uit tussen `curl http://example.com` en `ping example.com` als diagnosetools.

**E4.** Wat is een `.env`-bestand? Waarom mag het nooit in een Git-repository terechtkomen? Wat is een `.env.example` en hoe gebruik je het in een team?

**E5.** Leg het verschil uit tussen een **webserver** (zoals nginx) en een **applicatieserver** (zoals een Node.js-proces of een Python WSGI-server). Waarom gebruik je beide in een productieomgeving?

---

### Medium

**M1.** Maak een overzicht van omgevingsverschillen tussen jouw lokale machine en een typische Linux-productieserver.

**M2.** Onderzoek hoe je de actieve versie van een draaiende app herkent zonder je broncode te openen.

**M3.** Schrijf een deployment-checklist voor een eenvoudige webapplicatie. Geordend van pre-deployment tot post-deployment. Elke stap beschrijft wat er gecontroleerd of uitgevoerd wordt en hoe je verifieert dat het gelukt is.

**M4.** Onderzoek hoe **systemd**-services werken op Linux. Schrijf een `.service`-bestand voor een Node.js-applicatie dat: de applicatie automatisch start bij serverherstart, de applicatie herstart bij een crash, en logs schrijft naar journald. Test de service en documenteer de gebruikte commando's.

---

### Hard

**H1.** Een applicatie in productie is plots niet meer bereikbaar. Je hebt SSH-toegang tot de server. Beschrijf alle stappen die je gaat ondernemen van het moment dat je het probleem melding krijgt tot het moment dat je de oorzaak gevonden en opgelost hebt. Gebruik concrete commando's bij elke stap.

**H2.** Onderzoek het concept van een **CI/CD-pipeline** (Continuous Integration / Continuous Deployment). Wat zijn de stappen in zo'n pipeline, van een `git push` tot een werkende deployment op de server? Bouw een minimale pipeline met GitHub Actions die automatisch deployt naar een server bij een push naar de `main`-branch. Documenteer elke stap van de pipeline.

**H3.** Een applicatie werkt correct op de stagingserver maar niet op productie. De code is identiek. De server heeft dezelfde Ubuntu-versie. Beschrijf systematisch hoe je de omgevingsverschillen opspoort. Welke tools gebruik je, welke configuratiebestanden vergelijk je, en hoe sluit je hypothesen een voor een uit?

**H4.** Onderzoek het verschil tussen **verticaal** en **horizontaal schalen** van een server. Wanneer kies je voor welke aanpak? Wat zijn de netwerk- en architectuurimplicaties van horizontaal schalen — denk aan sessiestate, databaseverbindingen en loadbalancing? Beschrijf hoe een **load balancer** past in een horizontaal geschaalde architectuur.

---

### At Home

**AT1. Volledige deployment van een eigen applicatie**

Neem een applicatie die je eerder gebouwd hebt, een API, een webapplicatie, of een eenvoudige website, en deploy die volledig naar een VPS. Doorloop alle stappen: serversetup, SSH-hardening, nginx-configuratie, TLS-certificaat, procesmanagement met PM2 of systemd, en omgevingsvariabelen. De applicatie moet bereikbaar zijn via een domeinnaam (gebruik een gratis subdomein via DuckDNS als je geen eigen domein hebt) en HTTPS. Documenteer elke stap en elke fout die je tegenkwam, inclusief hoe je die oploste.