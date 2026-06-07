# Module 5: Welke andere protocollen moet ik kennen?

---

## 5.1 FTP en SFTP: bestanden verplaatsen

Lang vóór git en CI/CD zette je een nieuw bestand live via een FTP-client. Drag, drop, klaar. En vervolgens hoopte je dat niemand het verkeer onderschepte.

**FTP** (File Transfer Protocol) is een oud protocol voor het overzetten van bestanden. Het werkt, maar stuurt alles in plaintext, inclusief je wachtwoord. In 2026 gebruik je FTP enkel nog als je absoluut geen alternatief hebt.

**SFTP** (SSH File Transfer Protocol) lost dat op: het verloopt volledig versleuteld via SSH. Ondanks de naam heeft SFTP technisch weinig te maken met FTP — het is een apart protocol dat toevallig dezelfde letters gebruikt.

Dit betekent voor jou: als je bestanden naar een server verplaatst, gebruik je altijd SFTP of een vergelijkbaar veilig alternatief. FTP heeft op productienetwerken niets meer te zoeken.

### Test jezelf

**Vraag 1.** Wat is het grootste beveiligingsprobleem met klassiek FTP?

a) Het stuurt data en wachtwoorden in plaintext
b) Het ondersteunt geen grote bestanden
c) Het werkt alleen op Windows
d) Het is te traag voor moderne netwerken

**Vraag 2.** Waarom is SFTP veiliger dan FTP, ook al klinken de namen gelijkaardig?

**Vraag 3.** Noem één moderne situatie als developer waarbij je SFTP nog zou gebruiken.

---

## 5.2 SSH: veilig op afstand werken

Je server staat in een datacenter in Amsterdam. Toch kan je er een command in tikken alsof je er rechtvoor zit. Dat doet **SSH** (Secure Shell, beveiligde shell).

SSH geeft je een versleutelde verbinding met een externe machine en laat je daar een terminal openen. Je kan bestanden kopiëren met `scp`, poorten doortunnelen en zelfs grafische toepassingen forwarden.

Authenticatie werkt via wachtwoord of via een keypair. Keypairs zijn veiliger: een private sleutel op jouw machine, een publieke sleutel op de server. Wie de private key niet heeft, komt niet binnen.

Dit betekent voor jou: SSH is het standaardgereedschap voor elke interactie met externe servers. Gebruik sleutels in plaats van wachtwoorden en bescherm je private key als een wachtwoord.

### Test jezelf

**Vraag 1.** Hoe werkt SSH-authenticatie via een keypair?

a) De private key blijft lokaal, de publieke key staat op de server; alleen bezitters van de private key kunnen verbinden
b) Beide sleutels staan op de server en worden per verbinding uitgewisseld
c) De public key wordt versleuteld opgeslagen in je browser
d) Keypairs vervangen het wachtwoord enkel bij FTP-verbindingen

**Vraag 2.** Waarom zijn SSH-keypairs veiliger dan wachtwoordauthenticatie?

**Vraag 3.** Wat doet SSH-tunneling en wanneer is dat nuttig als developer?

---

## 5.3 SMTP en e-mail: hoe werkt mail onder de motorkap?

Je klikt op verzenden en je mail komt aan. Makkelijk. Maar jij gaat ooit een app bouwen die e-mail verstuurt vanuit code. Dan wil je weten wat er achter dat verzenden zit.

**SMTP** (Simple Mail Transfer Protocol) is het protocol waarmee mailservers e-mail versturen en doorsturen. Als jouw app een mail verstuurt via een externe dienst zoals AWS SES of Mailgun, gebruikt die dienst SMTP achter de schermen.

Ontvangst werkt via andere protocollen: **IMAP** (Internet Message Access Protocol) en **POP3** (Post Office Protocol). IMAP synchroniseert mail op de server, POP3 downloadt en verwijdert. In de praktijk gebruik je als developer bijna altijd IMAP.

Dit betekent voor jou: als je transactionele mails bouwt, weet je welke SMTP-host, poort en authenticatiegegevens je app nodig heeft. Fout geconfigureerde mail belandt in spam of wordt geweigerd.

### Test jezelf

**Vraag 1.** Welk protocol gebruikt een app typisch om e-mail te versturen?

a) SMTP
b) IMAP
c) FTP
d) DNS

**Vraag 2.** Wat is het verschil in gebruik tussen IMAP en POP3?

**Vraag 3.** Je transactionele mail belandt in de spamfolder. Noem twee technische oorzaken die daartoe kunnen leiden.

---

## 5.4 WebSockets: wanneer HTTP niet volstaat

HTTP is geweldig voor vraag-antwoord verkeer. Maar stel: je bouwt een chatapplicatie of een livekoersen-dashboard. Dan wil je niet elke seconde een nieuwe request sturen. Je wil dat de server jou pusht als er iets nieuw is.

**WebSockets** lossen dat op. Na een initiële HTTP-handshake wordt de verbinding omgezet naar een persistent, bidirectioneel kanaal. Client en server kunnen nu op elk moment data sturen, zonder nieuwe requests.

Dat is fundamenteel anders dan polling, waarbij je app de server steeds opnieuw ondervraagt. WebSockets zijn efficiënter voor realtime toepassingen, maar complexer te beheren.

Dit betekent voor jou: kies WebSockets bewust, voor toepassingen die lage latency en live updates nodig hebben. Voor eenvoudigere use cases zijn Server-Sent Events of polling vaak voldoende.

### Test jezelf

**Vraag 1.** Wat is het grootste voordeel van WebSockets tegenover klassieke HTTP-polling?

a) De server kan zelf data naar de client pushen zonder nieuwe request van de client
b) WebSockets comprimeren data automatisch
c) WebSockets werken ook zonder internet
d) WebSockets vervangen DNS voor snellere naamresolutie

**Vraag 2.** In welke twee concrete situaties kies je WebSockets boven gewoon HTTP?

**Vraag 3.** Wat is het nadeel van WebSockets in termen van infrastructuurbeheer?

---

## 5.5 Een request van A tot Z: de grote lijn

Je typt `www.de-standaard.be` in je browser en drukt Enter. Wat er dan precies gebeurt is een samenvatting van alles wat je de afgelopen modules geleerd hebt.

Eerst lost DNS de naam op naar een IP-adres. Dan opent je browser een TCP-verbinding naar dat IP op poort 443. TLS-handshake bevestigt de identiteit van de server. HTTP-request vertrekt: GET `/` met headers. De server verwerkt de request, stuurt een 200-response met HTML terug. De browser verwerkt die HTML, ontdekt extra resources, en stuurt tientallen nieuwe requests voor CSS, scripts en afbeeldingen.

Elk van die stappen kan falen. DNS kan traag zijn. De TCP-verbinding kan niet tot stand komen. TLS kan falen door een verlopen certificaat. De server kan 500 terugsturen. En jij bent degene die dat allemaal moet kunnen lezen en uitleggen.

Dit betekent voor jou: dit samengestelde beeld is precies waarom de vorige modules bestaan. Elk apart concept heeft pas zin als je de volledige keten ziet.

### Test jezelf

**Vraag 1.** Wat is de correcte volgorde bij het openen van een HTTPS-webpagina?

a) DNS-resolutie → TCP-verbinding → TLS-handshake → HTTP-request → HTTP-response
b) HTTP-request → DNS-resolutie → TLS-handshake → TCP-verbinding → response
c) TLS-handshake → DNS-resolutie → TCP → HTTP-request → response
d) TCP → HTTP-request → DNS → TLS → response

**Vraag 2.** Bij welke stap in de keten zou een verlopen TLS-certificaat voor een fout zorgen?

**Vraag 3.** Beschrijf in je eigen woorden waarom een pagina traag kan laden, ook als de HTML-response snel terugkomt.

---

## Oefeningen Module 5

### Easy

**E1.** Verbind met SSH naar een server of Raspberry Pi en voer drie basiscommando's uit. Documenteer commando, resultaat en wat je ermee deed.

**E2.** Leg in drie zinnen het verschil uit tussen FTP en SFTP. Geef één concreet voorbeeld van wanneer je welke kiest.

**E3.** Zoek op welke poorten SMTP, IMAP en POP3 standaard gebruiken. Maak een overzichtstabel.

**E4.** Beschrijf in je eigen woorden wat een WebSocket-verbinding anders doet dan een gewone HTTP-request.

**E5.** Genereer een SSH-keypair op je eigen machine. Documenteer elke stap inclusief wat de twee bestanden zijn en waarvoor ze dienen.

**E6.** Teken of beschrijf de stappen van een volledig webverzoek van DNS tot HTTP-response.

**E7.** Zoek in DevTools een WebSocket-verbinding op een bekende website die live data toont. Wat zie je in het Messages-tabblad?

**E8.** Leg in vijf zinnen uit waarom FTP niet meer thuishoort in een moderne developer workflow.

---

### Medium

**M1.** Configureer een SFTP-verbinding naar een testserver. Kopieer een bestand heen en terug. Documenteer de stappen en eventuele fouten.

**M2.** Stuur een testmail vanuit code via een SMTP-relay zoals Mailpit of Mailtrap. Documenteer configuratie, code en wat je ziet in de mailinterface.

**M3.** Bouw een eenvoudige WebSocket-demo waarbij client en server berichten uitwisselen. Documenteer setup, code en gedrag bij verbroken verbinding.

**M4.** Vergelijk WebSockets met Server-Sent Events op vlak van implementatiecomplexiteit, richting van dataverkeer en typische use case.

**M5.** Analyseer een case: een chatapp heeft soms berichten die niet aankomen. Geef drie hypotheses over de rol van WebSocket-verbindingen.

**M6.** Maak een SSH-config bestand met minstens drie hostaliassen voor servers die je regelmatig gebruikt. Documenteer wat elk veld doet.

**M7.** Schrijf een script dat via SSH een logbestand van een server haalt en lokaal opslaat.

**M8.** Onderzoek hoe je SMTP-authenticatie beveiligt. Beschrijf SPF, DKIM en DMARC in maximaal drie zinnen per concept.

**M9.** Volg een volledig webverzoek via Wireshark voor een HTTP-site. Identificeer DNS-query, TCP-handshake en HTTP-request in de capture.

**M10.** Schrijf een vergelijkingstabel van alle protocollen uit deze module op vlak van versleuteling, transportprotocol en typisch gebruik.

---

### Hard

**H1.** Ontwerp een mailinfrastructuur voor een kleine Belgische webshop: welke dienst, welke configuratie en welke GDPR-overwegingen gelden?

**H2.** Analyseer een incident: mails van je app belanden structureel in spam bij Hotmail-gebruikers maar niet bij Gmail. Werk een diagnose en oplossing uit.

**H3.** Schrijf een technisch document over SSH hardening voor een productieserver: poortwijziging, key-only auth, fail2ban en loginbeperkingen.

**H4.** Bouw een realtime notificatiesysteem op basis van WebSockets met reconnect-logica bij verbindingsverlies. Documenteer code en designkeuzes.

**H5.** Vergelijk WebSockets, SSE en long polling op vlak van schaalbaarheid, infrastructuurkosten en foutgevoeligheid.

**H6.** Maak een gedetailleerde tijdlijn van een volledig HTTPS-verzoek met alle substappen van DNS tot rendered page. Gebruik Wireshark of DevTools.

**H7.** Schrijf een beveiligingsaudit voor SMTP-configuratie van een productie-app: welke risico's zijn er en hoe los je ze op?

**H8.** Analyseer hoe een man-in-the-middle-aanval eruit ziet op een onversleuteld FTP-verkeer. Leg uit wat TLS hieraan verandert.

---

### At Home

**AT1. Protocol-lab** meerdere uren over meerdere sessies

Kies drie protocollen uit deze module en zet een werkende testopstelling op voor elk. Documenteer configuratie, tests, fouten en wat je geleerd hebt.

**AT2. E-mailinfrastructuur verkenning** meerdere uren

Stuur transactionele mails vanuit een zelfgebouwde of bestaande app via een externe SMTP-relay. Analyseer deliverability, spamscoring en headers. Lever een rapport met bevindingen en verbeteringen.

**AT3. Van A tot Z in Wireshark** één dag

Maak een volledige capture van een HTTPS-sessie op een site die ook WebSockets gebruikt. Identificeer alle protocollen die je ziet en schrijf een gelaagde analyse van het netwerkverkeer.
