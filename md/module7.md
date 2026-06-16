# Module 7: Hoe, het gaat niet over Tupperware?

---

## 7.1 Het probleem: afhankelijkheden en omgevingen

In de vorige module hadden we het over het "works on my machine"-probleem. De hoofdoorzaak zit dieper dan een vergeten omgevingsvariabele of een hoofdletterverschil in een bestandsnaam. Het echte probleem is dat software van zoveel andere factoren afhankelijk is.

Een applicatie heeft **dependencies** (afhankelijkheden) op meerdere niveaus. Op het meest zichtbare niveau zijn er de libraries, de packages die je installeert via bijvoorbeeld npm of pip. Daaronder zit de runtime, de versie van Node.js, Python, Java, ... die die code uitvoert. Daaronder zit het besturingssysteem, de Linux-distributie, de versie, de system libraries. En nog daaronder zit de hardware, de CPU-architectuur, het geheugen, de schijfsnelheid.

Elke laag kan een bron van problemen zijn. Een native npm-package gecompileerd op macOS met een Apple Silicon-chip werkt niet op een Linux-server met een Intel-processor. Een Python-bibliotheek die afhankelijk is van een specifieke versie van `libssl` werkt niet als de server een andere versie heeft. Een applicatie die op Ubuntu 22.04 geschreven is, gedraagt zich anders op Ubuntu 18.04. En laten we dan nog maar zwijgen over alle... specifieke... issues die Windows met zich meebrengt.

Het handmatig beheren van al die lagen is tijdrovend, foutgevoelig en slecht schaalbaar. Als je twee developers hebt heeft elk een eigen laptop met subtiele verschillen. Als je drie omgevingen hebt (development, staging en productie) hebt je drie configuraties die synchroon gehouden moeten worden. Als je een nieuwe developer onboard, kost het dagenlang om zijn machine identiek te krijgen aan de rest en gaan er weken later nog altijd ineens kleine issues opduiken.

Wat als we nu eens omgekeerd zouden werken, in plaats van de omgeving aan te passen aan de applicatie gewoon de omgeving meegeven aan de gebruiker?

---

## 7.2 Servers? VMs? Containers?

De oplossing voor ons probleem is niet iets dat ineens gisteren naar boven is gekomen, dat is iets waar al enkele tientallen jaren over nagedacht is door heel de sector. En elke paar jaar komt er een nieuwe oplossing die een hele generatie meegaat. Elke generatie lost het probleem beter op dan de vorige, maar brengt ook nieuwe trade-offs mee.

- **De fysieke server** was de eerste aanpak: één applicatie per machine. Geen omgevingsconflicten, want er is maar één applicatie. Het nadeel is even duidelijk: het is niet echt efficiënt te noemen. Een server die voor 90% van de tijd niets doet kost evenveel als een server die continu op 98% usage zit. En het opzetten van een nieuwe server kost tijd (en veel geld), hardware bestellen, installeren, configureren.
- **Virtuele machines** (VM's) losten het efficiëntieprobleem op. Een **hypervisor**, software zoals VMware of VirtualBox laat meerdere volledige besturingssystemen tegelijk draaien op één fysieke machine. Elke VM heeft zijn eigen kernel, geheugen, schijfruimte, ... en is volledig geïsoleerd van de andere VM's. Je kunt op één server tien VM's draaien met elk een ander besturingssysteem en configuratie.

Het nadeel van VM's is hun gewicht. Elke VM bevat een volledig besturingssysteem, meerdere gigabytes aan schijfruimte en honderden megabytes (en tegenwoordig zelfs eerder GB) RAM alleen al voor het OS zelf. Het opstarten duurt minuten. En het kopiëren of distribueren van een VM-image is omslachtig.

- **Containers** zijn de derde generatie. Ze bieden isolatie vergelijkbaar met VM's, maar zonder het gewicht van een volledig besturingssysteem. Containers delen de kernel van de hostmachine en isoleren alleen de processen, het bestandssysteem en de netwerkconfiguratie. Een container start in seconden, weegt megabytes in plaats van gigabytes en kan in milliseconden gekopieerd worden van de ene machine naar de andere.

Het verschil in gewicht is niet cosmétisch, het verandert hoe je werkt. Tien VM's opstarten voor een complexe testomgeving kost tien minuten en gigabytes geheugen. Tien containers opstarten kost seconden en tientallen megabytes.

### Test jezelf

**Vraag 1.** Wat is het grootste verschil tussen een VM en een container?

- Een container deelt het host-OS en is lichter; een VM draait een volledig eigen besturingssysteem
- Een container is altijd trager dan een VM
- Een VM kan geen netwerk gebruiken, een container wel
- VMs zijn alleen voor Windows, containers voor Linux

**Vraag 2.** Waarom startte een container sneller op dan een VM?

**Vraag 3.** Wanneer kies je toch voor een VM in plaats van een container?

---

## 7.3 Maar wat is die container dan juist?

We gaan hier even enkele dingen simpeler voorstellen dan wat ze effectief zijn, we kunnen meerdere OLODs vullen over containers en orchestratie (en dat doen we ook in het graduaat Systeem- en Netwerkbeheer en de bachelor Toegepaste Informatica), maar we focussen on hier op de informatie die relevant is voor een developer. Een container is een gewoon Linux-proces (of een groep processen) dat door het besturingssysteem geïsoleerd wordt zodat het denkt dat het alleen op de machine draait.

Die isolatie verloopt via twee belangrijke technieken in de Linux-kernel. **Namespaces** zorgt ervoor dat een container zijn eigen weergave heeft van het systeem: zijn eigen processen (hij ziet de processen van andere containers niet), zijn eigen netwerk (eigen IP-adres, eigen routeringstabel), zijn eigen file systeem, zijn eigen hostnaam. **Cgroups** (control groups) bepalen (en bewaken) hoeveel resources (CPU, geheugen, schijf-I/O) een container mag gebruiken. Die twee mechanismen samen creëren de illusie van een geïsoleerde machine, zonder dat er een volledig besturingssysteem nodig is.

Een container draait altijd vanuit een **image**, een onveranderlijk snapshot van het bestandssysteem dat de applicatie en al zijn dependencies bevat.

Het is belangrijk te begrijpen wat een container **niet** is. Een container is geen VM, hij heeft geen eigen kernel. Als de hostmachine een Linux-kernel draait, draaien alle containers op die kernel. Op macOS en Windows draait Docker daarom achter de schermen een kleine Linux-VMs en draaien de containers daarin. De gebruiker ziet dat nier, maar het is relevant dat je begrijpt waarom Docker op Windows soms trager is.

Een container is ook niet permanent. Standaard is een container **ephemeral** of wegwerpbaar. Stop je een container, dan verdwijnt alles wat erin veranderd is. De volgende keer dat je de container start, begint hij opnieuw van de image. Dat is een feature, geen bug: het garandeert dat elke keer dat je de container start, hij precies hetzelfde is. Data die je wil bewaren, bewaar je buiten de container via een **volume**.

### Test jezelf

**Vraag 1.** Welke twee Linux-mechanismen vormen de basis van containerisatie?

- Namespaces voor isolatie en cgroups voor resource limiting
- Firewalls en DNS-filters
- SSH-tunnels en port forwarding
- Virtuele interfaces en NAT-tabellen

**Vraag 2.** Waarom gedraagt een container zich overal hetzelfde?

**Vraag 3.** Wat is het verschil tussen een container die draait en een image?

---

## 7.4 De basics van Docker

De basics van Docker zijn eigenlijk drie begrippen. Ze klinken wel een beetje vaag totdat je het effectief eens hebt gebruikt.

Een **image** is een soort template dat niet veranderd. Het bevat het file systeem van de container: het besturingssysteem (bv. een minimale Linux-installatie), de runtime (Node.js, Python, Java), de code van de applicatie en alle dependencies. Een image wordt één keer gebouwd en kan daarna overal gebruikt worden. Je bouwt een image met een **Dockerfile**, een tekstbestand dat stap voor stap beschrijft hoe de image samengesteld wordt:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Elke instructie in een Dockerfile voegt een "**laag**" toe aan de image. Docker cached die lagen: als je een image opnieuw build en alleen de applicatiecode veranderd is, zal Docker alle vorige lagen hergebruiken en enkel de code-laag rebuilden. Dat maakt het buildproces snel.

Een **container** is een draaiende instance van een image. De verhouding is dezelfde als tussen een klasse en een object in het programmeren: de image is de blueprint, de container is de uitvoering. Uit één image kun je tientallen containers starten, elk met hun eigen geïsoleerd bestandssysteem en netwerk die afzonderlijk van elkaar werken.

Een **volume** is de oplossing voor de vluchtige aard van containers. Een volume is een map op de hostmachine (dus je eigen computer of de server) die gemount wordt in de container. Data die in de gemounte map geschreven wordt, bestaat buiten de container en blijft bestaan wanneer de container gestopt of verwijderd wordt. Eigenlijk is dat een soort van "netwerkmap" dat je gaat sharen met de container. Je gebruikt volumes voor onder andere: databasedata (dus de eigenlijke data zelf, niet zomaar de applicatie code van de database), bijhouden van geuploaden files en logbestanden.

De meest gebruikte Docker-commando's die je moet kennen:

```bash
docker build -t mijn-app .          # Bouw een image vanuit de huidige map
docker run -p 3000:3000 mijn-app    # Start een container, map poort 3000
docker ps                           # Toon draaiende containers
docker ps -a                        # Toon alle containers, ook gestopte
docker logs mijn-container          # Bekijk de logs van een container
docker exec -it mijn-container sh   # Open een shell in een draaiende container
docker stop mijn-container          # Stop een container proper
docker rm mijn-container            # Verwijder een gestopte container
docker images                       # Toon alle lokale images
```


### Test jezelf

**Vraag 1.** Waarom verlies je data als je een container stopt zonder volume?

**Vraag 2.** Noem twee situaties waarin je zeker een volume nodig hebt.

---

## 7.5 Hello container

Containers zijn per definitie geïsoleerd, dat heeft heel veel voordelen. Maar een webapplicatie die niemand kan accessen is ook maar een beetje dom. Docker biedt een netwerksysteem dat containers onderling en met de buitenwereld laat communiceren, met volledige controle over wat er wel en niet doorgelaten wordt.

**Port mapping** is de meest directe manier om een container bereikbaar te maken van buitenaf. Wanneer je een container start met `-p 80:3000`, zegt dat: "Verkeer dat op **poort 80 van de hostmachine** binnenkomt, stuur je door naar **poort 3000 in de container**." Of met andere woorden, door gewoon naar de container te surfen ga je intern (waarschijnlijk) een Node.js server aanspreken. De container weet niet dat hij bereikbaar is op poort 80, hij denkt dat hij gewoon op 3000 luistert. De host/Docker handelt de mapping af.

```bash
docker run -p 80:3000 mijn-webserver
```

Voor communicatie **tussen containers** kan je met Docker netwerken opzetten. Standaard draait elke container in het `bridge`-netwerk: containers kunnen via hun IP-adres met elkaar communiceren, maar die IP-adressen zijn dynamisch en veranderen bij elke reboot. De betere aanpak is een **custom network** aanmaken en containers daarin plaatsen, dan kunnen containers elkaar bereiken via hun **naam** als hostnaam:

```bash
docker network create mijn-netwerk
docker run --name database --network mijn-netwerk postgres
docker run --name api --network mijn-netwerk mijn-api
```

In de API-container kun je nu verbinding maken met de database via de hostnaam `database` — Docker gaat zelf "DNS spelen" en die naam naar het IP-adres van de databasecontainer vertalen. Dat is betrouwbaarder dan IP-adressen gebruiken die kunnen veranderen.

In de praktijk gebruik je zelden losse `docker run`-commando's voor applicaties met meerdere containers. Daarvoor gebruik je **Docker Compose**, een tool die met één YAML-bestand meerdere containers definieert, hun netwerken configureert en ze samen opstart.

### Test jezelf

**Vraag 1.** Wat doet port mapping bij containers?

- Het koppelt een poort op de host aan een poort in de container zodat extern verkeer de service bereikt
- Het versleutelt automatisch alle netwerkcommunicatie
- Het vervangt DNS voor containerresolutie
- Het beperkt het netwerk tot alleen inkomend verkeer

**Vraag 2.** Je app in een container luistert op poort 5000 maar je krijgt connection refused via localhost. Wat check je eerst?

---

## 7.6 Docker is precies wel cool

Containers als concept bestonden al voor Docker. Maar Docker (dat is 2013 is gereleased, dus ook niet echt meer nieuw is) maakte containers toegankelijk. Het gaf developers een eenvoudige CLI, een duidelijk formaat voor images (de Dockerfile) en een publieke lijst (Docker Hub) waar kant-en-klare images gedeeld worden. In het OLOD Desktop Computing gaan we nog dieper in op containers, maar in deze module heb je dan toch al minstens een basis aan informatie gekregen.

**Docker Hub** (`hub.docker.com`) bevat officiële images voor vrijwel elke gangbare technologie, OS, stack, ...: `node`, `python`, `postgres`, `mysql`, `redis`, `nginx`, `mongo`. Een werkende PostgreSQL-database starten vereist één commando en geen installatie:

```bash
docker run -e POSTGRES_PASSWORD=geheim -p 5432:5432 postgres
```

**Docker Compose** is de tool waarmee je een volledige applicatiestack definieert in één `docker-compose.yml`-bestand. Eén commando om alles op te starten, één commando om alles te stoppen (ook hier weer, de details komen in Desktop Computing aan bod):

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=pass
      - POSTGRES_USER=user
      - POSTGRES_DB=mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Met `docker compose up` start je de volledige stack. Met `docker compose down` stop je alles. Een nieuwe developer cloned de repository, voert `docker compose up` uit en heeft een volledig werkende ontwikkelomgeving zonder handmatige installaties of conflicten met versies.

### Test jezelf

**Vraag 1.** Wat is het voornaamste voordeel van Docker Compose voor een developer?

- Een volledige multi-container omgeving beschrijven en opstarten met één commando
- Automatisch CI/CD-pipelines genereren
- Docker vervangen door een lichtere runtime
- Kubernetes overbodig maken voor alle omgevingen

**Vraag 2.** Wat is Docker Hub?

---

## Oefeningen Module 7

### Easy

**E1.** Installeer Docker op je machine en voer `docker run hello-world` uit. Beschrijf wat er gebeurt.

**E2.** Maak een container van een bestaande image van Docker Hub, start die container en stop die. Noteer de commando's die je gebruikt hebt.

**E3.** Leg uit waarom data verloren gaat als je een container stopt en hoe je dat oplost.

---

### Medium

**M1.** Maak een container aan voor een MySQL database, zorg ervoor dat de data in de database bewaard blijft, zelfs al reboot je de container.

**M2.** Zoek op wat Docker Desktop juist doet en bekijk wat de verschillen zijn tussen de desktop-versie en de CLI.

**M3.** Schrijf een handleiding voor het opstarten, debuggen en stoppen van een container stack in een Dockerfile voor een junior developer.

**M4.** Onderzoek hoe Docker-logging werkt. Hoe bekijk je logs van een draaiende container?

**M5.** Maak zelf een container met een nginx of Apache webserver en laat er een voorbeeldoefening vanuit Static Web in draaien zodat deze toegankelijk is door naar https://localhost te surfen.

---

### Hard

*Zijn hard en @Home oefeningen nodig hier, aaangezien in Desktop Computing docker uitgebreider aan bod komt?*

**H1.** Een collega heeft een `docker-compose.yml` geschreven waarbij de databasecontainer zijn poort (5432) publiek beschikbaar stelt via port mapping. De API communiceert ook via `localhost:5432` in plaats van via de containernaam. Identificeer alle problemen in deze configuratie, leg uit waarom elk een probleem is en schrijf een verbeterde versie.

**H2.** Schrijf een production "waardige" `docker-compose.yml` voor een webapplicatie met de volgende vereisten: automatische herstart bij crash, geheugen en CPU-limieten per service, een gezondheidscontrole voor elke service, logging naar een centraal systeem en geen enkele databasepoort publiek beschikbaar.

---

### At Home

**AT1.** Bouw een volledige pipeline van lokale ontwikkeling tot productiedeployment met containers. Startpunt: een applicatie die lokaal draait via `docker compose up`. Eindpunt: dezelfde applicatie die automatisch gedeployed wordt op een VPS via GitHub Actions bij elke push naar `main`. 

Tussenstappen: 
- schrijf een productie-Dockerfile met multi-stage build
- configureer de GitHub Actions-pipeline
- stel Docker Hub in als imageregister
- configureer de VPS om de nieuwe image te downloaden en te starten bij elke deployment.
Documenteer elk onderdeel van de pipeline en schrijf een README file om alle stappen voor een volgende developer heel duidelijk uit te leggen.