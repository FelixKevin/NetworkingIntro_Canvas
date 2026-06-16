# Module 3: Localhost en poorten en problemen enzo

---

## 3.0 Tools en terminal

Net zoals dat een doktor al zijn instrumenten in zijn draagtas moeten steken alvorens hij op huisbezoek gaan moeten wij ook al onze tools in orde hebben alvorens wij beginnen. Bij ons zijn de tools gewoon iets anders dan een stethoscoop of scalpel.

De commando's in deze cursus veronderstellen dat je comfortabel bent met een terminal. Geen paniek als dat nog niet helemaal het geval is, de commando's zijn eenvoudig en je leert ze kennen door ze te gebruiken. In het vak Desktop Computing gaan we ook iets dieper in deze dingen duiken.

**Windows** gebruikers werken bij voorkeur met **Windows Terminal** en **PowerShell**. **macOS** en **Linux** gebruikers hebben alles al aan op voorhand geinstalleerd. Open Terminal en je bent klaar.

De tools die je in deze module gebruikt:

`netstat`: Toont actieve netwerkverbindingen en de poorten waarop je machine luistert. Op nieuwere systemen is `ss` het modernere alternatief met dezelfde functie.

`curl`: Stuurt HTTP-verzoeken vanuit de terminal en toont de response. Onmisbaar voor het testen van API's zonder een browser of Postman te openen.

`telnet`: Maakt een quick-and-dirty TCP-verbinding naar een host en poort. Handig om te testen of een poort open staat. Op Windows moet je het apart installeren via "Windows Features".

`nc` (netcat): Is het Zwitserse zakmes van netwerktesting: poorten testen, data sturen, minimale servers opzetten.

`lsof -i` (Linux/macOS): Toont welk proces op welke poort luistert. Op Windows gebruik je `netstat -ano` in combinatie met Task Manager.

---

## 3.1 Wat is een poort?

Je weet al dat een IP-adres aangeeft waar een machine te bereiken is op het netwerk. Maar een machine draait tientallen processen tegelijk zoals een webserver, database, mailclient of SSH-daemon. Maar hoe weet een binnenkomend pakket voor welk proces het bedoeld is? Dat regelt de **port** (of poort).

Je kan die machine zien als een apparementsgebouw met één adres, maar wel met allemaal verschillende deuren. Het IP-adres is het gebouw. De poort is de juiste deur.

Een netwerkverbinding wordt altijd volledig beschreven door vier elementen: het IP-adres van de afzender, de poort van de afzender, het IP-adres van de ontvanger, en de poort van de ontvanger. Die combinatie noemen we een **socket**.

Poorten worden verdeeld in drie categorieën. De **well-known ports** (0–1023) zijn gereserveerd voor veelgebruikte diensten: HTTP op 80, HTTPS op 443, SSH op 22, ... Op de meeste systemen heb je admin (of root) nodig om een service op deze poorten te starten.

De **registered ports** (1024–49151) worden gebruikt door specifieke applicaties: MySQL op 3306, PostgreSQL op 5432, Redis op 6379, ... 

De **dynamic ports** of **ephemeral ports** (49152–65535) worden tijdelijk toegewezen wanneer jouw machine een verbinding initieert: de poort van jouw browser die een HTTP-verzoek stuurt, is zo'n tijdelijke poort.

Poorten zijn ook protocolspecifiek. Poort 80 op **TCP** en poort 80 op **UDP** zijn technisch gezien verschillende poorten. Het meeste webverkeer gebruikt TCP; realtime toepassingen zoals DNS-queries of videogesprekken gebruiken vaak UDP. Het verschil: TCP garandeert dat data aankomt en in de juiste volgorde (maar is trager), UDP garandeert niets maar is sneller.

### Test jezelf

**Vraag 1.** Wat doet een poort in netwerkcommunicatie?

- Ze stuurt verkeer naar de juiste service op een host
- Ze vervangt het IP-adres volledig
- Ze bepaalt je wifi-signaalsterkte
- Ze versleutelt automatisch alle data

**Vraag 2.** Waarom volstaat een IP-adres alleen niet om een webapp of database te bereiken?

**Vraag 3.** Je start een Express.js-server op poort 3000. Een gebruiker verbindt vanuit de browser. De verbinding gebruikt tijdelijk poort 54231 aan de kant van de browser. Wat beschrijft die combinatie van vier elementen (IP + poort aan beide kanten)?

- Een socket: de volledige beschrijving van één netwerkverbinding tussen twee eindpunten
- Een firewall-regel: de browser vraagt toestemming aan de server
- Een MAC-adres: de hardware-identificatie van de verbinding
- Een DNS-record: het koppelt de browsernaam aan het serveradres

---

## 3.2 Bekende poorten

Het is een beetje nutteloos om alle 65535 poorten en hun nut van buiten te kennen. Maar er zijn er wel een stuk of twintig die je altijd gaat zien terugkomen dat je ze herkent voordat je erover nadenkt. Daar is het wel nuttig om die even vanbuiten te leren.

**Web traffic:** HTTP draait op **poort 80**, HTTPS op **poort 443**. Als je een website bezoekt zonder poortnummer in de URL, gebruikt je browser automatisch 80 of 443 afhankelijk van het protocol. Een development-server draait vaak op **3000**, **8000** of **8080**. Dat is geen vaste standaard, maar die getallen zie je het vaakst in tutorials en frameworks (bvb standaard 3000 voor Node.js en 8000 voor Laravel).

**Databases:** MySQL/MariaDB luisteren op **poort 3306**, PostgreSQL op **5432**, MongoDB op **27017**, Redis op **6379**, Microsoft SQL Server op **1433**. Weet je niet meer op welke poort je database draait? Dit zijn de *defaults*. Je kunt ze aanpassen in de configuratie, maar de meeste developers laten ze staan tenzij er een goede reden is om te wijzigen.

**Remote access en file transfers:** SSH draait op **poort 22**. FTP gebruikt **poort 21** voor de controleverbinding en **poort 20** voor de dataoverdracht. **SFTP** (SSH File Transfer Protocol) loopt via SSH en gebruikt dus ook poort 22.

**Mail:** SMTP (verzenden) op **poort 25** (of 587 voor authenticatie), IMAP (ontvangen) op **143** (of 993 voor IMAP over TLS).

**Andere belangrijke:** DNS op **poort 53** (UDP én TCP), RDP (Remote Desktop) op **3389**.

Wanneer een verbinding mislukt en je foutmelding zegt "*connection refused*" of "*connection timed out*", is de eerste vraag altijd: luistert de service op de verwachte poort en staat die poort open in de firewall?

### Test jezelf

**Vraag 1.** Welke poort hoort standaard bij HTTPS?

- 443
- 80
- 22
- 5432

**Vraag 2.** Waarom zou het een goed idee kunnen zijn om standaaardpoorten aan te passen, bijvoorbeeld voor SSH?

---

## 3.3 There's no place like 127.0.0.1

Elke machine heeft een netwerk met zichzelf. We kunnen die gaan linken aan diep filosofische overtuigingen over eenzaamheid enzo, of we kunnen het praktisch bekijken: wanneer je een server start op je eigen device en er verbinding mee maakt vanop dat device gebruik je het **loopback-netwerk**.

Het adres `127.0.0.1` is het **loopback-adres** voor IPv4, verkeer dat hiernaar gestuurd wordt verlaat de machine nooit en komt rechtstreeks terug. De naam `localhost` is de standaard hostnaam die naar `127.0.0.1` verwijst (of naar `::1` in IPv6).

Je kunt ze door elkaar gebruiken, al is er één subtiel verschil: `localhost` is een DNS-naam die opgezocht wordt, `127.0.0.1` is een direct adres. Op de meeste systemen maakt dat geen praktisch verschil, maar in omgevingen waar DNS traag of kapot is, werkt `127.0.0.1` altijd.

Het volledige loopback-blok is `127.0.0.0/8`. Dat betekent dat alle adressen van `127.0.0.1` tot `127.255.255.254` naar jezelf verwijzen. In de praktijk gebruik je alleen `127.0.0.1`, maar in sommige configuraties (meerdere lokale services die elk een eigen adres nodig hebben) zie je ook `127.0.0.2` of `127.0.0.3` opduiken.

Wanneer je een server start op `localhost:3000`, is die server **alleen bereikbaar vanaf je eigen machine**. Wil je dat andere machines in je netwerk er ook mee kunnen verbinden, dan moet je de server laten luisteren op `0.0.0.0:3000`, dat betekent "alle beschikbare netwerkinterfaces". Als er ooit al eens een moment was waarop je lastig werd tijdens het debuggen omdat bij u alles werkt, maar andere mensen er niet aankunnen heeft dit er wel misschien iets mee te maken.

### Test jezelf

**Vraag 1.** Wat betekent localhost in de praktijk?

- Verkeer naar de eigen machine via de loopback-interface
- Verkeer naar de router in je thuisnetwerk
- Verkeer naar een publieke cloudserver
- Verkeer dat alleen via wifi werkt

**Vraag 2.** Waarom kan je collega jouw lokale server op localhost niet bereiken?

**Vraag 3.** Wat is het verschil tussen een server starten op `127.0.0.1:8080` en op `0.0.0.0:8080`?

---

## 3.4 Sockets

Tot nu toe heb je netwerken bekeken vanuit het perspectief van adressen en poorten. Maar hoe maakt code eigenlijk gebruik van dat netwerk? Het antwoord is met een **socket**.

Een socket is een eindpunt van een netwerkverbinding: een object in je code dat je kunt openen, naar schrijven, van lezen en sluiten, net zoals een bestand. Gelukkig is het wel iets waar het besturingssysteem (meestal) het beheer van zal doen.

Jij werkt met de socket als abstractie. Wanneer je een HTTP-verzoek doet in Python, JavaScript of Java, wordt ergens onderliggend een socket aangemaakt, de verbinding opgezet, data verstuurd en ontvangen en de socket gesloten.

Er zijn twee types sockets waar je het verschil tussen moet weten. Een **TCP-socket** (stream socket) zorgt voor een betrouwbare verbinding: data komt aan in de juiste volgorde en zonder verlies. Een **UDP-socket** (datagram socket) verstuurt afzonderlijke packets zonder garantie op volgorde of aankomst, maar met minder overhead.

In de meeste programmeertalen werk je niet rechtstreeks met sockets, voor webverkeer zal je bvb gebruik maken van HTTP dat het zware werk voor je doet. Maar zodra je met WebSockets, raw TCP-verbindingen, of protocollen lager dan HTTP werkt, kom je direct in aanraking met socket-programmering. In Node.js zit de `net`-module ingebouwd voor raw TCP-sockets; Python heeft de `socket`-module.

Een minimaal voorbeeld om te voelen hoe het werkt, een TCP-server in Python:

```python
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 9000))
server.listen(1)

conn, addr = server.accept()
print(f"Verbinding van {addr}")
conn.sendall(b"Hallo van de server!\n")
conn.close()
```

Dit is enkel een voorbeeld om te laten zien wat we eigenlijk doen. We gaan letterlijk zeggen dat de server moet luisteren op *IP adres* `0.0.0.0` en *poort* `9000`. Oftewel: we krijgen een socket door een adres en poort aan elkaar te vinden (`bind`), het wacht op verbindingen (`listen`) en zal content terugsturen (`send`).

### Test jezelf

**Vraag 1.** Wat is een socket?

- Een software-eindpunt waarmee processen over het netwerk communiceren
- Een fysieke ethernetpoort op je laptop
- Een DNS-record voor service discovery
- Een firewallregel met allow of deny

**Vraag 2.** Wanneer kies je meestal TCP voor databaseverkeer?

---

## 3.5 The big firewall filter

Simpel samengevat: de firewall beslist of netwerkverkeer wel en niet mag passeren. Dat klinkt eenvoudig, maar de details bepalen of je applicatie (of server) bereikbaar is of niet én vooral of je server *veilig* is of niet.

Iets minder samengevat: een **firewall** analyseert inkomend en uitgaand verkeer op basis van regels. Die regels kijken typisch naar het IP-adres van de zender, het IP-adres waar het naartoe moet, de poort, en het protocol (TCP of UDP). Een regel kan zijn: 
- "sta verkeer toe van overal naar poort 443" => want je wilt een website via HTTPS beschikbaar maken voor 'het internet'
- "blokkeer al het inkomend verkeer op poort 22 behalve van IP-adres 195.130.3.12" => want iemand moet via SSH op je server kunnen verbinden behalve verbindingen via 195.130.3.12 (het IP-adres van je kantoor of campus)
- "hou al het inkomend verkeer tegen van IP-adres 30.2.x.x" => want er is een brute-force login aanval aan de gang vanuit die range

Er zijn twee plaatsen waar een firewall relevant is voor jou als developer. De **host-based firewall** draait op de server zelf. Op Linux is dat (meestal) `ufw` (Uncomplicated Firewall) of `iptables`. Op Windows is dat de ingebouwde Windows Firewall. Wanneer je een nieuwe poort opent op een server, moet je die ook openen in de host-based firewall, anders bereikt het verkeer de poort nooit.

De **netwerkfirewall** zit tussen het internet en je server, typisch beheerd door je hostingprovider, IT-dienst of op je router thuis. Bij clouddiensten zoals AWS of Azure heet dit een **security group** of **network security group**. Hier gelden dezelfde principes: je definieert welk verkeer mag binnen- en buitenkomen.

Een veelgemaakte fout: je start een service op poort 8080, de service luistert correct, maar de verbinding mislukt. Je controleert je code, geen fout. Je controleert de poort, aan het luisteren. Wat vergeet je? *De firewall*. Controleer altijd beide lagen: de host-based firewall én de netwerkfirewall. Op een nieuwe VPS staan standaard alleen poort 22 (SSH) en soms 80/443 open. Al het andere moet je expliciet toestaan.

Het principe achter goede firewallconfiguratie: **whitelist, niet blacklist**. Blokkeer alles standaard en laat alleen toe wat nodig is. Niet andersom.

### Test jezelf

**Vraag 1.** Wat doet een firewall eigenlijk?

**Vraag 2.** Waarom kan verkeer lokaal wel werken maar van buitenaf toch geblokkeerd worden?

**Vraag 3.** Waarom maakt **whitelist, niet blacklist** een server veiliger?

---

## 3.6 Port forwarding

Stel: je wilt zelf een MineCraft server hosten om samen met wat vrienden te bouwen aan een mega constructie. Je hebt de server geconfigged, kan zelf lokaal verbinden, hebt poort 25565 toegevoegd aan de firewall, maar nog altijd kunnen je vrienden niet verbinden op je server. Wat is het probleem?

Je thuisrouter heeft één publiek IP-adres. Achter die router zitten verschillende apparaten waaronder de machine met je server, elk met een intern IP. Wanneer iemand van buitenaf verbinding wil maken met jouw lokale server, weet de router niet naar welk apparaat hij het verkeer moet sturen. Tenzij je **port forwarding** configureert.

Port forwarding is een instelling in je router waarbij je zegt: "Verkeer dat binnenkomt op poort X, stuur je door naar IP-adres Y op poort Z." Concreet voor je MineCraft server: "Alles wat binnenkomt op poort 25565, stuur door naar `192.168.1.105:25565`": het IP-adres van je computer waarop de MineCraft server draait.

De stappen zijn altijd hetzelfde. 
1. Geef je machine een statisch IP-adres of DHCP-reservatie, anders verandert het IP na een reboot en werkt je port forwarding-regel niet meer.
2. Log in op je router en zoek de port forwarding-instellingen (soms onder "NAT", "Virtual Server" of "Port Mapping"). 
3. Stel de regel in met het externe poortnummer, het interne IP-adres en het interne poortnummer. 
4. Test vanuit een extern netwerk, bvb via GSM als je niet met je WiFi verbonden bent.

Er zijn twee varianten. **Port forwarding** werkt voor één specifieke poort. **DMZ** (Demilitarized Zone) stuurt al het verkeer door naar één intern apparaat, handig voor een homelab, maar gevaarlijk. Een apparaat in de DMZ staat volledig bloot aan het internet en heeft geen routerbeveiliging meer.

Weet wat je doet wanneer je port forwarding instelt. Je opent letterlijk een deur in je netwerk. Zorg dat de service achter die deur up-to-date is, een sterk wachtwoord heeft en niet meer blootstelt dan nodig.

### Test jezelf

**Vraag 1.** Wat doet port forwarding?

- Extern inkomend verkeer doorsturen naar een specifieke interne host en poort
- Alle interne poorten automatisch publiceren op internet
- DNS-records versleutelen
- Een server op je laptop automatisch blootstellen op het internet

**Vraag 2.** Waarom is port forwarding een veiligheidsrisico als je het slecht configureert?

---

## 3.7 EHBOS: Eerste Hulp Bij Onbereikbare Servers

"Waarom kan mijn app de database niet bereiken?" is een vraag die elke developer vroeg of laat stelt. Het antwoord zit bijna altijd in één van dezelfde vijf categorieën. Leer ze herkennen en je lost dit soort problemen in minuten op in plaats van uren.

**1. De service luistert niet:** Je database is gestart, maar luistert op `127.0.0.1` in plaats van `0.0.0.0`. Of de service is helemaal niet gestart. Controleer met `netstat -tlnp | grep 5432` (voor PostgreSQL) of de poort actief is en op welk adres.

**2. De firewall blokkeert de verbinding:** De service luistert correct, maar de firewall laat het verkeer niet door. Onderscheid "*connection refused*" (de poort is bereikbaar maar weigert) van "*connection timed out*" (de poort is niet bereikbaar, waarschijnlijk geblokkeerd door firewall). `connection refused` = service probleem. `timed out` = firewallprobleem.

**3. Verkeerd IP-adres of hostnaam:** Je connectiestring verwijst naar `localhost` maar de database draait in een Docker-container met een eigen netwerk. Of je hebt een typfout in het IP-adres. Controleer de exacte connectiestring en vergelijk met het werkelijke adres van de service.

**4. Verkeerde poort:** Je hebt de standaardpoort aangenomen maar de service is geconfigureerd op een andere poort. Of je verwart MySQL (3306) met PostgreSQL (5432). Controleer de configuratie van de service zelf.

**5. Authenticatiefout die eruitziet als verbindingsfout:** De verbinding lukt, maar de database weigert de gebruiker. Sommige foutmeldingen zijn hier niet duidelijk over. Test de verbinding eerst met een database-client (bv. `psql` of `mysql` in de Terminal) om authenticatie los te koppelen van de netwerkverbinding.

Het debuggingproces volgt altijd dezelfde logica: bevestig eerst dat de service draait en op de juiste poort luistert. Test daarna de verbinding lokaal (vanaf de server zelf). Test pas daarna van buitenaf. Zo sluit je laag voor laag mogelijke oorzaken uit.

### Test jezelf

**Vraag 1.** Stel een mini-checklist op van vijf stappen voor de foutmelding connection timed out naar een database.

**Vraag 2.** Wat is het verschil tussen "connection refused" en "connection timed out" als foutmelding, en wat zegt elk over de locatie van het probleem?

---

## Oefeningen Module 3

### Easy

**E1.** Controleer op je eigen machine (voer `netstat -tlnp` (Linux/macOS) of `netstat -ano` (Windows) uit) welke processen luisteren op netwerkpoorten. Noteer drie processen met poortnummer en vermoedelijke rol.

**E2.** Draai lokaal een simpele webserver (bvb met XAMPP) en test die via localhost en via je lokale IP-adres. Vergelijk de resultaten.

**E3.** Zoek uit welke firewall actief is op je machine. Noteer waar je regels kan bekijken.

**E4.** Zoek op welke poorten de volgende services standaard gebruiken: MySQL, Redis, MongoDB, RabbitMQ, Elasticsearch. Noteer de poort en het protocol (TCP/UDP) voor elk.

**E5.** Voer `curl -v http://google.be` uit. Lees de output. Identificeer het IP-adres waarmee verbinding gemaakt wordt, de poort, en de HTTP-statuscode die teruggegeven wordt.

---

### Medium

**M1.** Zet een lokale database op en verbind ermee vanuit een aparte testapp. Toon dat verbinding op localhost werkt en leg uit wat je moet veranderen voor verbinding vanaf een tweede toestel.

**M2.** Onderzoek de impact van een hostfirewallregel die inkomend verkeer op één poort blokkeert.

**M3.** Maak een overzicht van poorten die een web project gebruikt, inclusief service, protocol en risico bij blootstelling.

**M4.** Start een eenvoudige TCP-server met `nc -l 9000` (netcat). Maak vanuit een tweede terminal verbinding met `nc localhost 9000`. Stuur een tekst van de ene terminal naar de andere. Beschrijf wat er op netwerkniveau gebeurt bij elke stap.

**M5.** Gebruik `ufw` (Linux) of de ingebouwde Windows Firewall om een specifieke poort te blokkeren op je machine. Test of de blokkering werkt met `nc` of `telnet`. Verwijder de regel daarna.

**M6.** Onderzoek het concept **reverse proxy**. Wat doet een reverse proxy, en welke rol spelen poorten daarin? Geef een concreet voorbeeld van hoe nginx als reverse proxy ingezet wordt voor een Node.js-applicatie op een server.

---

### Hard

**H1.** Ontwerp een veilige netwerkopstelling voor een webapp met database in een kleine Belgische kmo. Motiveer poortkeuzes, firewallregels en toegangsbeleid.

**H2.** Vergelijk drie strategieën om een lokale service extern bereikbaar te maken: port forwarding, vpn en tunnelservice. Evalueer veiligheid, beheer en complexiteit.

**H3.** Schrijf een korte gids voor developers over hoe je incidentcommunicatie doet tijdens een netwerkstoring: wat meld je, wanneer, en met welke technische bewijsstukken.

**H4.** Een collega stelt voor om de SSH-poort te verplaatsen van 22 naar een willekeurig hoog poortnummer als beveiligingsmaatregel ("security through obscurity"). Schrijf een onderbouwde reactie: wat zijn de voor- en nadelen van deze aanpak?

**H5.** Analyseer de beveiligingsrisico's van de volgende configuratie: een developer heeft zijn hele thuisnetwerk in een DMZ gezet zodat hij makkelijk van buitenaf aan zijn projecten kan werken. Welke risico's introduceert dit? Welke alternatieven bestaan er die hetzelfde doel bereiken zonder de beveiliging volledig te omzeilen?

---

### At Home

**AT1.** Maak een volledig overzicht van alle poorten die op jouw machine actief in gebruik zijn. Identificeer voor elke poort: het poortnummer, het protocol (TCP/UDP), het adres waarop geluisterd wordt (localhost of 0.0.0.0), het proces dat de poort in gebruik heeft, en of die poort intern of extern bereikbaar is. Beoordeel daarna je firewallconfiguratie: welke poorten zijn onnodig blootgesteld? Welke services hadden beter alleen op `127.0.0.1` mogen luisteren? Schrijf een rapport met bevindingen en aanbevelingen.