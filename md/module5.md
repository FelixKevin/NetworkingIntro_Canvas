# Module 5: Andere protocollen enzo

---

## 5.1 FTP en SFTP: bestanden verplaatsen

Ooit al eens een bestand naar een webserver moeten uploaden via een tool als FileZilla of WinSCP? Dan is de kans reëel dat je FTP of SFTP gebruikt hebt, willen of niet.

**FTP** staat voor **File Transfer Protocol** en bestaat al sinds 1971. Dat is geen leuk wistjedatje dat je tijdens de DT Zaalquiz kan gebruiken om punten te scoren, maar het is een verklaring waarom het er zo (oudbollig) uitziet. FTP gebruikt twee aparte TCP-verbindingen: een **controleverbinding** op poort 21 voor commando's en een **dataverbinding** voor de eigenlijke bestandsoverdracht. Die tweeledige structuur veroorzaakt het klassieke FTP-probleem: je kunt inloggen en de mappenstructuur zien, maar zodra je een bestand probeert te downloaden, time-out de verbinding. Dat is vrijwel altijd een **active/passive mode**-conflict met een firewall.

Maar het grootste probleem is niet de complexiteit maar de beveiliging. FTP verstuurt alles als onversleutelde tekst, inclusief je gebruikersnaam en wachtwoord. Op een gedeeld netwerk zijn je credentials meteen leesbaar voor iedereen die luistert.

**SFTP** (SSH File Transfer Protocol) is de oplossing. Hoewel je enkel afgaand op de afkorting zou denken dat het gewoon "secure FTP" is heeft SFTP eigenlijk niets te maken met FTP. Het is een volledig ander protocol dat bovenop SSH draait. Eén verbinding, poort 22, alles versleuteld. De praktische conclusie is kort: gebruik altijd SFTP.

Maar waarom dan nog spreken over FTP? Heel simpel, FTP komt gewoon nog veel voor in legacy-systemen en gaat soms de enige manier zijn om te deployen naar de infrastructuur die je als developer voor handen krijgt. Plus, FTP en SFTP zijn soms ook gewoon handige protocollen om snel iets te testen of over te zetten.

### Test jezelf

**Vraag 1.** Wat is het grootste beveiligingsprobleem met FTP?

- Het stuurt data en wachtwoorden in plaintext
- Het ondersteunt geen grote bestanden
- Het werkt alleen op Windows
- Het is te traag voor moderne netwerken

**Vraag 2.** Waarom is SFTP veiliger dan FTP, ook al klinken de namen gelijkaardig?

**Vraag 3.** Noem één moderne situatie als developer waarbij je SFTP nog zou gebruiken.

---

## 5.2 SSH

Stel, je hebt een website gemaakt en gaat deze willen deployen op het internet. Je hebt dus nood aan een server waar deze bestanden kunnen staan op een locatie waar andere mensen toegang hebben tot het resultaat. Je zal dan waarschijnlijk ergens een server moeten huren, maar waar precies die staat maakt niet uit. Het maakt uit dat deze server niet voor u neus staat en dat je er niet op kan †ypen, dus hoe kan je daar dingen op deployen? SSH is hoe je dat doet.

**SSH** staat voor **Secure Shell**. Het zet een versleutelde verbinding op over een onveilig netwerk, standaard op **poort 22**. Via die verbinding open je een shell op de remote machine en voer je commando's uit alsof je er zelf voor zit.

De moderne standaard manier om in te loggen is via een **keypair**: een **private key** die alleen jij hebt en een **public key** die op de server staat. Wanneer je verbindt, bewijst de server dat hij jouw public key kent en bewijst jij dat je de bijbehorende private key bezit, zonder die sleutel ooit over het netwerk te sturen. Veiliger dan een wachtwoord, dat onderschept of geraden kan worden.

Hoe precies die authenticatie juist gebeurd is out of scope van dit vak, maar je kan meer informatie vinden op https://tls12.xargs.org

Een sleutelpaar maak je aan met:

```bash
ssh-keygen -t ed25519 -C "Naam van de key"
```

Dit genereert `~/.ssh/id_ed25519` (private key: **nooit delen, nooit kwijtraken**) en `~/.ssh/id_ed25519.pub` (public key: zet deze op de server in `~/.ssh/authorized_keys`). Verbinden doe je dan met:

```bash
ssh user@serveradres
```

Drie extra SSH-mogelijkheden die je als developer regelmatig nodig hebt. **SCP** (Secure Copy) kopieert bestanden via SSH: `scp bestand.txt user@server:/path/`. **SSH tunneling** stuurt lokaal verkeer via SSH door naar een remote host, de standaardmanier om een database te bereiken die niet publiek toegankelijk is (meer in de oefeningen). En **SSH config** (`~/.ssh/config`) laat je aliassen opslaan zodat `ssh mijnserver` volstaat in plaats van het volledige commando telkens opnieuw te typen.

**E�n waarschuwing die je serieus moet nemen**: de eerste keer dat je verbindt met een server toont SSH een **fingerprint**. Die bevestig je bijna altijd blind, maar als je die fingerprint niet verifieert via een ander kanaal, open je de deur voor een **man-in-the-middle-aanval**. In een professionele context verifieer je de fingerprint via de admin panel van je hostingprovider voor je bevestigt.

### Test jezelf

**Vraag 1.** Hoe werkt SSH-authenticatie via een keypair?

- De private key blijft lokaal, de publieke key staat op de server; alleen bezitters van de private key kunnen verbinden
- Beide sleutels staan op de server en worden per verbinding uitgewisseld
- De public key wordt versleuteld opgeslagen in je browser
- Keypairs vervangen het wachtwoord enkel bij FTP-verbindingen

**Vraag 2.** Wat is SSH tunneling en geef een concreet voorbeeld van wanneer je het als developer gebruikt?

**Vraag 3.** Waarom is authenticatie via sleutelparen veiliger dan authenticatie via wachtwoorden in SSH?

---

## 5.3 Basic Security: wat nooit in Git mag

Je bouwt een applicatie die de Google Maps API gebruikt. Je plakt je API-sleutel in je code, pusht naar GitHub en tien minuten later krijg je een email van Google dat je sleutel misbruikt wordt, of erger nog je krijgt op het einde van de maand een factuur van Google voor alle gemaakte API-calls. Dit is geen scenario dat bijna niet voorkomt, het is schering en inslag en de schade kan oplopen tot honderden euro's aan onverwachte facturen.

Een **API-sleutel** is een geheime string die jou identificeert bij een externe dienst. Het is vergelijkbaar met een wachtwoord: wie de sleutel heeft, kan de dienst gebruiken op jouw kosten en met jouw rechten. Het verschil met een wachtwoord is dat API-sleutels vaak automatisch door bots gescand worden op publieke Git-repositories.

De regel is absoluut: **geheimen horen nooit in je code en nooit in Git.** Dat wilt zeggen API-sleutels, databasewachtwoorden, JWT-secrets, OAuth-tokens, private keys, ... Geen uitzonderingen, *ook niet in privérepositories*.

De correcte aanpak is werken met **environment variables**. Je slaat de waarde op buiten je code, in een `.env`-bestand lokaal, of in de omgevingsinstellingen van je server en je leest hem op in je code (bijvoorbeeld in JavaScript of Python):

```javascript
// Node.js
const apiKey = process.env.MAPS_API_KEY;
```

```python
# Python
import os
api_key = os.environ.get("MAPS_API_KEY")
```

Het `.env`-bestand zelf zet je in `.gitignore` zodat het nooit meegecommit wordt. Wat je wel in Git kan zetten, is een `.env.example` met de namen van alle vereiste variabelen maar zonder de waarden:

```
MAPS_API_KEY=
DATABASE_URL=
JWT_SECRET=
```

Zo weet elke developer in het team welke variabelen nodig zijn, zonder dat de waarden ooit publiek worden.

Als je per ongeluk een sleutel gepusht hebt: delete hem onmiddellijk in het dashboard van de dienst en maak een nieuwe key aan. De sleutel in Git verwijderen via een nieuwe commit is niet voldoende, de geschiedenis blijft beschikbaar en wordt ook actief gescand.

### Test jezelf

**Vraag 1.** Je ziet in een Pull Request van een collega dat hij een API-sleutel hardcoded in een configuratiebestand heeft gezet, maar het bestand staat in `.gitignore`. Hij zegt: "Het staat toch niet in Git, dus het is veilig." Wat klopt er niet aan die redenering?

- `.gitignore` voorkomt dat het bestand gecommit wordt, maar als het bestand al eerder gecommit was of gedeeld wordt via een andere weg, is de sleutel alsnog zichtbaar — bovendien is hardcoding de gewoonte die verkeerde patronen instelt; omgevingsvariabelen zijn de correcte aanpak ongeacht `.gitignore`
- `.gitignore` werkt niet voor configuratiebestanden
- API-sleutels in configuratiebestanden zijn altijd versleuteld
- De redenering klopt — als het bestand niet in Git staat, is er geen risico

**Vraag 2.** Wat is het verschil tussen een `.env`-bestand en een `.env.example`-bestand, en welke van de twee zet je in Git?

---

## 5.4 WebSockets: HTTP maar eigenlijk niet helemaal?

HTTP werkt volgens een vast patroon: de client vraagt, de server antwoordt, done. Dat werkt perfect voor het laden van pagina's en het ophalen van data. Maar wat als de server iets wil sturen zonder dat de client het moet vragen? Denk aan een chatbericht of een notification, de server weet dat die notification er is en moet dat op één of andere manier aan de client laten weten.

De klassieke noodoplossing was **polling**: de client vraagt elke paar seconden "hebt ge al iets voor mij?" Dat werkt, maar het is niet echt efficiënt aangezien de meeste antwoorden "nee" gaat zijn. Een volgende stap was **long polling**: de client stuurt een request en de server houdt die verbinding open tot er iets te melden is. Beter, maar nog altijd omslachtig.

**WebSockets** lossen dit op door een volwaardige verbinding in beide richtingen op te zetten die open blijft. De verbinding start als een gewone HTTP-request met een `Upgrade`-header:

```
GET /chat HTTP/1.1
Upgrade: websocket
Connection: Upgrade
```

De server antwoordt met `101 Switching Protocols` en vanaf dat moment kunnen zowel client als server op elk moment berichten sturen zonder telkens een nieuwe request. De verbinding blijft open tot één van beide kanten ze sluit.

In JavaScript kan je gebruik maken van de ingebouwde `WebSocket`-API:

```javascript
const ws = new WebSocket('wss://server.voorbeeld.be/chat');

ws.onopen = () => ws.send('Hallo server!');
ws.onmessage = (event) => console.log('Ontvangen:', event.data);
ws.onclose = () => console.log('Verbinding gesloten');
```

`wss://` is WebSocket over TLS — gebruik altijd `wss://` in productie, net zoals je altijd `https://` gebruikt.

Er zijn nog andere alternatieven voor eenrichtingsverkeer van de server naar de client zoals **Server-Sent Events** (SSE), maar dit valt out of scope van dit OLOD en gaat later in de opleiding nog aan bod komen.

### Test jezelf

**Vraag 1.** Je bouwt een live aandelenkoersen-dashboard dat prijzen toont die meerdere keren per seconde kunnen veranderen. Welke oplossing kies je en waarom?

- WebSockets: de server pusht actief updates naar alle verbonden clients zonder dat elke client telkens een nieuwe request moet sturen, wat efficiënter is dan polling bij frequente updates
- Polling elke seconde: eenvoudig te implementeren en genoeg om gewoon de nieuwe koers van de aandelen te kennen
- Een gewone HTTP GET-request bij elke pagerefresh
- Server-Sent Events: want de koersen worden alleen door de server verstuurd, niet door de client

**Vraag 2.** Hoe start een WebSocket-verbinding, en welke HTTP-statuscode geeft de server terug als hij akkoord gaat met de upgrade?

---

## 5.5 Requests. Wie zijn ze? Wat doen ze? Hoe werken ze?

Het klinkt eigenlijk wel simpel, je typt `https://www.vrt.be` in je browser en drukt op Enter en enkele momenten later komt er een website tevoorschijn (die u mogelijk iets over de Planckaerts, voetbal, of andere domme dingen wilt vertellen). Maar wat er in die momenten tussen de Enter en het verschijnen van de pagina gebeurd is een samenspel van alles wat we tot nutoe al hebben gezien in deze cursus. Een overzicht in grote lijnen:

1. **DNS-resolution:** De browser weet niet waar `www.vrt.be` is. Hij vraagt het aan de DNS-resolver van het systeem, die het IP-adres teruggeeft. Als het antwoord al gecached is (in de browser, het OS, of de resolver) wordt deze stap overgeslagen.
2. **TCP-verbinding:** De browser opent een TCP-verbinding met het IP-adres op poort 443 via een three-way handshake: `SYN` -> `SYN-ACK` -> `ACK`.
3. **TLS-handshake:** Omdat het HTTPS is, volgt de TLS-handshake. De server toont zijn certificaat. De browser verifieert het. Beide kanten spreken een sessiesleutel af. Alle verdere communicatie is versleuteld.
4. **HTTP-request:** De browser stuurt het versleutelde HTTP-verzoek: 
```
GET / HTTP/2
Host: www.vrt.be
Accept: text/html
```
5. **Server magie:** De server ontvangt de request en stuurt HTML terug. (Stiekem zit er wel meer achter de schermen. Typisch staat er een reverse proxy voor de applicatie die TLS afhandelt en het verzoek doorstuurt. De backend haalt data op, rendert een template, doet andere dingen, levert de HTML af)
6. **HTTP-response:** De server stuurt de response terug: statuscode `200 OK`, headers en de HTML-body.
7. **Verdere requests:** De browser parsed de HTML en ontdekt dat er extra resources nodig zijn: CSS, JavaScript, afbeeldingen. Voor elke extra resource wordt een nieuwe request gestart, stappen 4 tot 6 herhalen zich, parallel voor meerdere resources tegelijk.
8. **Rendering:** Zodra genoeg resources geladen zijn, begint de browser met renderen. JavaScript kan zelf extra API-requests starten, opnieuw via hetzelfde patroon.

That's it. Eén URL, één Enter-toets, tientallen requests, tientallen stappen. Elk van die stappen kan mislopen, vertraagd zijn of gecached zijn. Dit zijn alle dingen waar je rekening mee moet houden als iets "niet laadt".


### Test jezelf

**Vraag 1.** Waarom stuurt de browser meerdere requests na het ontvangen van de eerste HTML-response, en hoe maakt HTTP/2 dit efficiënter dan HTTP/1.1?

**Vraag 2.** In stap 5 staat er typisch een reverse proxy voor de applicatieserver. Noem een reden waarom grote websites dat doen in plaats van de applicatieserver direct bloot te stellen aan het internet.

---

## Oefeningen Module 5

### Easy

**E1.** Leg in drie zinnen het verschil uit tussen FTP en SFTP. Geef één concreet voorbeeld van wanneer je welke kiest.

**E2.** Beschrijf in je eigen woorden wat een WebSocket-verbinding anders doet dan een gewone HTTP-request.

**E3.** Genereer een SSH-keypair op je eigen machine. Documenteer elke stap inclusief wat de twee bestanden zijn en waarvoor ze dienen.

**E4.** Verbind via SFTP met een server (gebruik een gratis testserver zoals `demo.wftpserver.com` of een eigen VPS). Navigeer naar een map, upload een tekstbestand en download het terug. Op welke poort liep de verbinding? Welk protocol draait eronder?

**E5.** Gebruik `curl -v https://httpbin.org/get` en bekijk de output. Identificeer: de TLS-versie die gebruikt wordt, de statuscode, en de `Content-Type` van de response. Hoe lang duurde de TLS-handshake? (Hint: kijk naar de timing in de output.)

**E6.** Je collega verstuurt een API-sleutel als query-parameter: `GET /data?api_key=abc123`. Jij verstuurt die via een `Authorization`-header. Noem twee concrete redenen waarom jouw aanpak veiliger is.

---

### Medium

**M1.** Stel een SSH-sleutelpaar in op een remote server (VPS of Raspberry Pi). Schakel daarna wachtwoordauthenticatie uit in `/etc/ssh/sshd_config` zodat alleen sleutelauthenticatie mogelijk is. Documenteer elke stap en verifieer dat wachtwoordinloggen inderdaad geweigerd wordt.

**M2.** Bouw een minimale WebSocket-server in Node.js (gebruik de `ws`-bibliotheek) en een HTML-pagina met een WebSocket-client. De server stuurt elke seconde de huidige servertijd naar alle verbonden clients. De client toont de tijd live op de pagina. Documenteer de code met uitleg van de netwerkconcepten.

**M3.** Stel een `~/.ssh/config`-bestand in met aliassen voor minstens twee servers. Gebruik opties zoals `User`, `IdentityFile`, `Port` en `ServerAliveInterval`. Documenteer wat elke optie doet en demonstreer dat je met de alias kunt verbinden.

**M4.** Analyseer een volledige paginaslading van `https://www.standaard.be` via DevTools. Identificeer: het aantal requests, de totale paginagrootte, de drie traagste requests, welke requests gecached zijn (304 of from cache), en of de pagina HTTP/2 gebruikt.

**M5.** Onderzoek wat **MIME-types** zijn en welke rol ze spelen in HTTP. Welk MIME-type gebruik je voor een JSON-response, een PDF-bijlage, een PNG-afbeelding en een CSV-bestand? Waar in de HTTP-headers verschijnt het MIME-type, en wat gebeurt er als het verkeerd is?

---

### Hard

**H1.** Schrijf een technisch document over SSH hardening voor een productieserver: poortwijziging, key-only auth, fail2ban en loginbeperkingen.

**H2.** Analyseer hoe een man-in-the-middle-aanval eruit ziet op een onversleuteld FTP-verkeer. Leg uit wat TLS hieraan verandert.

**H3.** Onderzoek het concept **secret scanning**: geautomatiseerde tools die Git-repositories scannen op gelekte credentials. Wat zijn bekende tools (zowel van GitHub zelf als van derden)? Hoe configureer je GitHub secret scanning op een repository? Schrijf een pre-commit hook die lokaal controleert of er credentials in de staged bestanden staan voor je commit.

**H4.** SSH-tunneling kan gebruikt worden als een eenvoudige VPN-vervanging. Onderzoek het verschil tussen een SSH-tunnel (`-L`, `-R`, `-D`) en een echte VPN-verbinding op het vlak van werking, beveiliging en gebruikssituaties. Wanneer is een SSH-tunnel voldoende en wanneer heb je een echte VPN nodig? Implementeer een SOCKS5-proxy via SSH (`-D`-vlag) en test hem met een browser.

---

### At Home

**AT1. Volledige SSH-hardening van een server** *(4 à 6 uur)*

Neem een Ubuntu VPS (via een lokale virutele machine) en pas een volledige SSH-hardeningconfiguratie toe: schakel wachtwoordauthenticatie uit, verander de standaard SSH-poort, configureer `fail2ban` om brute-force pogingen te blokkeren, stel `AllowUsers` in zodat alleen specifieke gebruikers kunnen inloggen en schakel root-login via SSH uit. Documenteer elke stap inclusief hoe je verifieert dat de configuratie correct werkt zonder jezelf buitente sluiten. Schrijf een postmortem als je jezelf toch buitensluit — dat leert meer dan wanneer alles meteen lukt.