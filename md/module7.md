# Module 7: Hoe zorg ik dat mijn app overal hetzelfde werkt?

---

## 7.1 Het probleem: afhankelijkheden en omgevingen

Je hebt een app die werkt. Maar dan installeert een collega hem op zijn laptop en krijgt hij errors. Of je deployt naar een nieuwe server en plots gedraagt de app zich anders. Wat is er aan de hand?

Het probleem is **afhankelijkheden** (dependencies): jouw app heeft een specifieke versie nodig van een runtime, een library, een configuratiebestand. Als die niet exact overeenstemmen, is het gedrag onvoorspelbaar.

Je had dat al bij module 6 gezien. Maar nu gaan we dieper: hoe pak je dat structureel aan, zodat je niet elke keer opnieuw moet debuggen?

Dit betekent voor jou: "draait op mijn machine" is niet goed genoeg als deliverable. Je moet een reproduceerbare omgeving kunnen beschrijven én leveren.

### Test jezelf

**Vraag 1.** Wat is de meest structurele oplossing voor het afhankelijkheidsprobleem?

a) De omgeving zelf mee verpakken zodat ze overal identiek is
b) De code aanpassen per server
c) Alleen werken op één vaste machine
d) Dependencies altijd handmatig installeren

**Vraag 2.** Noem twee concrete gevolgen van een versieconflict tussen library op dev en productie.

**Vraag 3.** Hoe communiceer je vandaag de omgevingsvereisten van je app naar teamgenoten?

---

## 7.2 Van fysieke server naar virtuele machine naar container

De evolutie van serverinfrastructuur is er een van steeds meer isolatie en efficiëntie. Die evolutie begrijpen helpt je begrijpen waarom containers nu de standaard zijn.

Een **fysieke server** (physical server) draait één besturingssysteem en één set software. Krachtig, maar weinig flexibel en duur om te vermenigvuldigen.

Een **virtuele machine** (virtual machine, VM) simuleert een volledige computer bovenop echte hardware via een hypervisor. Je kan meerdere VMs naast elkaar draaien, elk met hun eigen OS. Dat geeft meer flexibiliteit, maar elke VM draagt een volledig besturingssysteem mee als overhead.

Een **container** (container) deelt het OS van de host maar isoleert de applicatie in een eigen procesomgeving. Lichter dan een VM, sneller te starten, en veel makkelijker te reproduceren.

Dit betekent voor jou: containers zijn de standaard geworden voor modern deployment. Je hoeft geen expert te zijn, maar je moet kunnen werken met containers in je dagelijkse workflow.

### Test jezelf

**Vraag 1.** Wat is het grootste verschil tussen een VM en een container?

a) Een container deelt het host-OS en is lichter; een VM draait een volledig eigen besturingssysteem
b) Een container is altijd trager dan een VM
c) Een VM kan geen netwerk gebruiken, een container wel
d) VMs zijn alleen voor Windows, containers voor Linux

**Vraag 2.** Waarom startte een container sneller op dan een VM?

**Vraag 3.** Wanneer kies je toch voor een VM in plaats van een container?

---

## 7.3 Wat is een container precies?

Een container is geen virtuele machine. Het is een geïsoleerd proces dat draait op de host, maar zijn eigen bestandssysteem, netwerk en procesruimte heeft.

De sleutel zit in twee Linux-kernelmechanismen: **namespaces** zorgen voor isolatie (wat ziet het process?), **cgroups** beperken resources (hoeveel CPU en RAM mag het gebruiken?). Samen geven ze het gevoel van een aparte machine, zonder de overhead.

Dat klinkt technisch, en dat is het ook. Maar voor jou als developer is het gevolg simpel: een container gedraagt zich overal hetzelfde, van je laptop tot een cluster in de cloud.

Dit betekent voor jou: als een container lokaal werkt, werkt die ook op de server — mits de configuratie klopt. Dat is de belofte van containers, en die is grotendeels waar.

### Test jezelf

**Vraag 1.** Welke twee Linux-mechanismen vormen de basis van containerisatie?

a) Namespaces voor isolatie en cgroups voor resource limiting
b) Firewalls en DNS-filters
c) SSH-tunnels en port forwarding
d) Virtuele interfaces en NAT-tabellen

**Vraag 2.** Waarom gedraagt een container zich overal hetzelfde?

**Vraag 3.** Wat is het verschil tussen een container die draait en een image?

---

## 7.4 Images, containers en volumes: de kernconcepten

Je werkt met containers via drie kernconcepten. Ze klinken gelijkaardig, maar ze zijn heel anders.

Een **image** (containerimage) is een onveranderlijk sjabloon: een bevroren momentopname van besturingssysteem, afhankelijkheden en applicatiecode. Je bouwt eenmalig een image en hergebruikt die overal.

Een **container** is een actieve instantie van een image. Je kan tien containers draaien vanuit dezelfde image. Ze delen de image, maar hebben elk hun eigen toestand.

Een **volume** (volume, schijfkoppeling) is persistente opslag buiten de container. Standaard verdwijnen bestandswijzigingen in een container als die stopt. Met een volume koppel je een map van de host of een extern opslagsysteem aan de container.

Dit betekent voor jou: gebruik altijd volumes voor data die je wil bewaren, zoals databasebestanden, uploads of configuratie die wijzigt tijdens runtime.

### Test jezelf

**Vraag 1.** Wat is het verschil tussen een image en een container?

a) Een image is het sjabloon, een container is de draaiende instantie van dat sjabloon
b) Een container is onveranderlijk, een image kan tijdens runtime aangepast worden
c) Images zijn alleen voor databases, containers voor webapps
d) Er is geen functioneel verschil

**Vraag 2.** Waarom verlies je data als je een container stopt zonder volume?

**Vraag 3.** Noem twee situaties waarin je zeker een volume nodig hebt.

---

## 7.5 Hoe praat een container met de buitenwereld?

Een container is geïsoleerd. Dat is de sterkte, maar ook de uitdaging: hoe bereik je de service die erin draait?

Via **port mapping** (poortkoppeling) verbind je een poort van de host met een poort van de container. Als je app op poort 3000 luistert in de container, en je mapt die naar poort 8080 op de host, dan bereik je hem via `localhost:8080`.

Containers in hetzelfde netwerk kunnen ook rechtstreeks met elkaar praten via hun containernaam als hostnaam. Dat is handig als je een app en een database als aparte containers draait.

Dit betekent voor jou: port mapping en containernetwerken bepalen wie wat kan bereiken. Fouten hier zijn vaak de oorzaak van connection refused in een containeromgeving.

### Test jezelf

**Vraag 1.** Wat doet port mapping bij containers?

a) Het koppelt een poort op de host aan een poort in de container zodat extern verkeer de service bereikt
b) Het versleutelt automatisch alle netwerkcommunicatie
c) Het vervangt DNS voor containerresolutie
d) Het beperkt het netwerk tot alleen inkomend verkeer

**Vraag 2.** Je app in een container luistert op poort 5000 maar je krijgt connection refused via localhost. Wat check je eerst?

**Vraag 3.** Hoe praten twee containers in hetzelfde netwerk met elkaar zonder port mapping naar de host?

---

## 7.6 Docker als de standaard: waarom iedereen het gebruikt

Er zijn andere containertools, maar **Docker** is de standaard geworden. Niet omdat het technisch de beste is op elk vlak, maar omdat het het ecosysteem heeft meegebracht: Docker Hub voor publieke images, Docker Compose voor multi-container setups, en een CLI die consistent werkt op Windows, macOS en Linux.

Met **Docker Compose** beschrijf je een complete omgeving in een YAML-bestand: welke containers, welke images, welke volumes, welke poorten. Eén commando start alles op. Dat is exact de reproductie die je nodig hebt.

Docker is geen vervanging voor een productie-orkestratieplatform zoals Kubernetes. Maar voor development, testing en kleine deployments is het de snelste weg naar consistente omgevingen.

Dit betekent voor jou: leer Docker Compose. Niet als een optioneel extraatje, maar als basisvaardigheid. Bijna elk project waar je mee werkt, heeft er één of vraagt er één.

### Test jezelf

**Vraag 1.** Wat is het voornaamste voordeel van Docker Compose voor een developer?

a) Een volledige multi-container omgeving beschrijven en opstarten met één commando
b) Automatisch CI/CD-pipelines genereren
c) Docker vervangen door een lichtere runtime
d) Kubernetes overbodig maken voor alle omgevingen

**Vraag 2.** Wat is Docker Hub en wanneer gebruik je het?

**Vraag 3.** Beschrijf in je eigen woorden wanneer Docker Compose te klein wordt en je verder moet kijken.

---

## Oefeningen Module 7

### Easy

**E1.** Installeer Docker op je machine en voer `docker run hello-world` uit. Beschrijf wat er gebeurt.

**E2.** Trek een bestaand image van Docker Hub, start een container en stop die. Noteer de commando's die je gebruikt hebt.

**E3.** Maak een tabel met de verschillen tussen fysieke server, VM en container op vlak van opstartsnelheid, isolatie en geheugengebruik.

**E4.** Leg in je eigen woorden het verschil uit tussen een image en een container.

**E5.** Start een PostgreSQL-container en verbind er lokaal mee. Documenteer de commando's en de port mapping die je gebruikte.

**E6.** Zoek op Docker Hub drie officiële images die je in een webproject zou kunnen gebruiken. Beschrijf per image wat het doet.

**E7.** Leg uit waarom data verloren gaat als je een container stopt en hoe je dat oplost.

**E8.** Beschrijf in vijf zinnen het verschil tussen Docker Compose en een enkel docker run commando.

---

### Medium

**M1.** Schrijf een `docker-compose.yml` voor een webapp met een backend en een PostgreSQL-database. Lever werkende configuratie met volumes en port mapping.

**M2.** Voeg een volume toe aan een databasecontainer. Bewijs dat data bewaard blijft na een container stop en start.

**M3.** Analyseer een case: twee containers starten allebei op, maar de app zegt dat de database niet bereikbaar is. Geef drie hypotheses en diagnosetools.

**M4.** Bouw een Dockerfile voor een bestaande Node.js of Python app. Documenteer elke instructie en verklaar je keuzes.

**M5.** Vergelijk Docker Desktop en een native Linux Docker install op vlak van performantie en gebruik op macOS.

**M6.** Gebruik Docker Compose om een volledige development stack op te zetten voor een project. Test of alle services met elkaar praten.

**M7.** Onderzoek hoe je environment variables veilig doorgeeft aan containers zonder ze in je `docker-compose.yml` te hardcoden.

**M8.** Maak een multi-stage Dockerfile die een kleinere productie-image bouwt dan een standaard build.

**M9.** Schrijf een runbook voor het opstarten, debuggen en stoppen van een Compose-stack voor een junior developer.

**M10.** Onderzoek hoe Docker-logging werkt. Hoe bekijk je logs van een draaiende container en hoe stuur je die door naar een extern systeem?

---

### Hard

**H1.** Ontwerp een containerarchitectuur voor een Belgische webshop met frontend, backend en database. Motiveer netwerk, volume en port mapping keuzes.

**H2.** Analyseer een productie-incident: de databasecontainer verliest data na elke deploy. Geef oorzaakanalyse, fix en preventie.

**H3.** Schrijf een technische vergelijking van Docker Compose en Kubernetes voor een team van drie developers bij een KMO in Leuven.

**H4.** Bouw een CI/CD-pipeline waarbij Docker images automatisch gebouwd en gepusht worden naar een registry na een push naar main.

**H5.** Ontwerp een strategie voor secrets management in een Docker-omgeving: hoe worden API keys en databasewachtwoorden veilig meegegeven?

**H6.** Analyseer de aanvalsoppervlakken van een slecht geconfigureerde Docker-omgeving: open sockets, privileged containers en onbeveiligde registries.

**H7.** Schrijf een migration guide voor een team dat overstapt van handmatige installatie naar een volledig Docker Compose-gebaseerde workflow.

**H8.** Onderzoek hoe container orchestration met Kubernetes verschilt van Docker Compose op vlak van schaalbaarheid, self-healing en networking.

---

### At Home

**AT1. Containeriseer een bestaand project** meerdere uren

Kies een project dat je eerder bouwde en schrijf een Dockerfile en `docker-compose.yml` voor de volledige stack. Zorg dat alles start met één commando, data bewaard blijft en de app bereikbaar is. Documenteer wat je moest aanpassen en waarom.

**AT2. Omgevingsvergelijking** meerdere uren over meerdere sessies

Draai dezelfde app op drie manieren: native op je machine, in een VM en in een container. Meet opstartsnelheid, geheugengebruik en debuggemak. Schrijf een analyse van de voor- en nadelen van elke aanpak.

**AT3. Container security audit** één dag

Onderzoek de beveiliging van een zelfgebouwde Docker-omgeving. Gebruik tools zoals `docker scout` of Trivy om kwetsbaarheden in images te scannen. Lever een auditrapport met bevindingen en concrete verbeteringen.
