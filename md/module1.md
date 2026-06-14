# Module 1: Hoe komt het dat niet iedereen aan mijn netwerk kan?

---

## 1.1 Hoe data beweegt

Stel: je stuurt een bestand naar een vriend aan de andere kant van de wereld. Je klikt op "verzenden" en een seconde later heeft hij het. Wat is er net gebeurd? Het antwoord is minder magisch dan het lijkt en het begrijpen ervan legt de basis voor alles wat volgt.

Data beweegt over een netwerk niet als één groot blok, maar als kleine stukjes die afzonderlijk verstuurd worden. Die stukjes noemen we **packets**. Je bestand wordt opgesplitst, elk stukje krijgt een adres mee (een beetje zoals een envelop met een bestemming) en elk stukje kan een andere weg nemen om op de bestemming aan te komen. Aan de andere kant worden de stukjes terug samengevoegd tot het originele bestand. Dat hele systeem heet **packet switching** en dat maakt het internet robuust: bij congestie of uitval kan verkeer langs een andere route gestuurd worden.

Fysiek gezien beweegt die data via kabels (koper of glasvezel), draadloze signalen (WiFi, 4G/5G), of optische fiber. De technologie verschilt, maar het principe blijft hetzelfde: alle eentjes en nulletjes reizen van punt A naar punt B, via soms tientallen tussenliggende apparaten.

Als developer hoef je niet elk detail van die fysieke laag te kennen. Maar je moet weten dat **netwerkcommunicatie nooit gegarandeerd** is. Packets kunnen verloren gaan, vertraagd zijn of in de verkeerde volgorde aankomen. Protocollen zoals TCP vangen veel daarvan op met controles en hertransmissie, maar dat kost tijd. Je code moet daar rekening mee houden.

Dit betekent voor jou: bouw je applicatie alsof het netwerk soms traag, onvolledig of grillig reageert. Time-outs, retries en degelijke foutmeldingen zijn geen uitzonderingen maar de regel.

### Test jezelf

**Vraag 1.** Wat is de voornaamste reden waarom het internet gebruikmaakt van packet switching in plaats van één doorlopende verbinding per bericht?

- **Omdat het netwerkcapaciteit efficiënt gedeeld kan worden en verkeer kan uitwijken bij uitval of congestie**
- Omdat het goedkoper is om kleine kabels te gebruiken
- Omdat pakketjes minder stroom verbruiken dan een doorlopend signaal
- Omdat grote bestanden te zwaar zijn voor één verbinding

**Vraag 3.** Noem twee fysieke media waarover data kan reizen in een computernetwerk.

---

## 1.2 LAN vs WAN

Je zit momenteel op kot. Je laptop, je telefoon en de printer van je huisgenoot staan allemaal verbonden met dezelfde WiFi-router. Jullie kunnen bestanden delen, naar dezelfde printer sturen en elkaars scherm streamen zonder dat daarvoor het internet nodig is. Dat is een **LAN**, een **Local Area Network**.

Zodra je op een publiek toegankelijke website surft, verlaat je die bubbel en stap je het **WAN** in: het **Wide Area Network**. Het internet is het bekendste voorbeeld van een WAN, een reusachtig netwerk van netwerken dat de hele wereld bestrijkt. Je huisnetwerk is één klein eilandje dat via je internetprovider verbinding maakt met dat grotere geheel.

Het onderscheid is praktisch belangrijk. Binnen een LAN is communicatie snel, goedkoop en min of meer privé. Buiten je LAN, zodra data door het WAN reist, gelden andere regels: het is trager, minder betrouwbaar en je hebt geen controle meer over de infrastructuur. Als developer betekent dit dat een app die "gewoon werkt op mijn computer" heel anders kan reageren zodra ze over het publieke internet communiceert.

Een derde term die je soms tegenkomt is **MAN** (Metropolitan Area Network): een netwerk op stadsschaal, een voorbeeld hiervan is het EhB-netwerk, waarin alle campussen van Brussel verbonden zijn. In de praktijk zal je dit zelden tegenkomen als developer, maar de term bestaat.

Dit betekent voor jou: test niet alleen lokaal. Test ook expliciet een scenario waarin client en server op verschillende netwerken zitten, want daar komen de echte verrassingen boven.

### Test jezelf

**Vraag 1.** Een EhB-developer test zijn applicatie lokaal: de frontend praat met een backend die op een server in dezelfde bureau staat. Over welk type verkeer gaat het dan vooral?

- **LAN: omdat de backend op een andere machine in hetzelfde netwerk staat** 
- WAN: omdat de frontend en backend als aparte systemen worden beschouwd
- MAN: omdat de developer binnen EhB blijft
- Geen netwerk: lokale communicatie tussen processen is geen netwerkcommunicatie

**Vraag 2.** Wat is het fundamentele verschil tussen een LAN en een WAN?

---

## 1.3 Router, switch en modem

In een doorsnee Belgische woning staan al minstens twee van deze apparaten, dikwijls samengeperst in één kastje van je provider. Ze doen elk iets anders en de verwarring ertussen leidt tot zinloze supportgesprekken en slecht geconfigureerde thuisnetwerken.

De **modem** is het apparaat dat jouw netwerk verbindt met het netwerk van je internetprovider. "Modem" staat voor *modulator-demodulator*: het zet het digitale signaal van jouw apparaten om naar een signaal dat geschikt is voor de kabel of glasvezel van je provider en omgekeerd. Zonder modem ben je afgesneden van het internet. Meer doet een pure modem niet.

De **router** is het apparaat dat beslissingen neemt over waar data naartoe moet. Het kent alle apparaten in je LAN, weet welk publiek IP-adres jouw verbinding heeft en zorgt ervoor dat data van het internet bij het juiste apparaat terechtkomt en andersom. Routen betekent letterlijk "een route bepalen". De router spreekt twee talen tegelijk: die van je lokale netwerk en die van het internet.

De **switch** is een verdeler binnen je LAN. Als je meerdere apparaten via kabel wil verbinden, sluit je ze aan op een switch. Een switch stuurt data alleen naar het apparaat waarvoor het bedoeld is. Thuis heb je een switch zelden apart nodig; je router heeft er al een ingebouwd. In een bedrijfsnetwerk is een switch een apart apparaat dat tientallen of honderden apparaten bedient.

Tegenwoordig levert je provider je één kastje dat modem, router en switch in één combineert. Handig, maar het maakt het onderscheid wazig. Als developer is het verschil wel degelijk relevant: als je een server wil bereikbaar maken van buitenaf, moet je aan de **router** sleutelen, niet aan de switch of modem.

Dit betekent voor jou: bij storingen of configuratievragen benoem je eerst de rol die faalt (modem, router of switch) en pas daarna het toestel. Zo analyseer je scherper en los je sneller op.

### Test jezelf

**Vraag 1.** Je wil je lokaal draaiende webserver bereikbaar maken vanop het internet. Aan welk apparaat moet je een instelling aanpassen?

- **De router, want die beheert de routing tussen je LAN en het internet**
- De switch, want die verdeelt data binnen je LAN
- De modem, want die verbindt je met je internetprovider
- De hub, want die broadcast data naar alle apparaten tegelijk

**Vraag 2.** Een bedrijf heeft 80 computers die allemaal via een kabel verbonden zijn met het netwerk. Welk apparaat is daarvoor onmisbaar naast de router?

---

## 1.4 Je thuisnetwerk

Theorie is mooi, maar een netwerk moet je aanraken. In deze sectie zet je een eenvoudig thuisnetwerk op en verifieer je of het werkt, met tools die je als developer sowieso nodig zult hebben.

Het startpunt is je router. De meeste routers zijn bereikbaar via een webbrowser op het adres `192.168.1.1` of `192.168.0.1`, dit is het **standaard gateway-adres**, de toegang tot je netwerk van binnenuit (afhankelijk van je provider kan het wel zijn dat je via hun website je device moet beheren, bvb zoals bij Telenet). Log in met de gegevens die op de onderkant van je router staan (verander die nadien, de standaard wachtwoorden zijn publiek gekend).

Eenmaal ingelogd zie je het **dashboard** van je router: welke apparaten verbonden zijn, welke IP-adressen ze hebben, welk publiek IP-adres jouw verbinding heeft. Verken dit. Je ziet ook instellingen voor WiFi-netwerken (SSID en wachtwoord), DHCP (meer daarover in module 2) en firewall-regels.

Om te testen of je netwerk werkt, gebruik je de terminal. Het commando `ping` stuurt een klein pakketje naar een adres en wacht op antwoord:

```bash
ping 192.168.1.1
```

Als je router reageert, werkt je lokale verbinding. Daarna test je of het internet bereikbaar is:

```bash
ping 8.8.8.8
```

(`8.8.8.8` is een publieke DNS-server van Google. Als die reageert, heb je verbinding met het internet. Reageert hij niet, maar je router wel? Dan is er een probleem tussen je router en je provider.)

Een tweede handig commando is `ipconfig` (Windows), `ip a` (Linux) of `ifconfig` (macOS). Dat toont je eigen IP-adres, je subnetmasker en je standaard gateway.

Dit betekent voor jou: als iets niet werkt, kijk je eerst naar je eigen configuratie voordat je de server of je code verdenkt.

### Test jezelf

**Vraag 1.** Je voert `ping 192.168.1.1` uit en krijgt een reactie, maar `ping 8.8.8.8` time-out. Wat kun je hieruit afleiden?

- **Je lokale netwerk werkt, maar er is een probleem tussen je router en het internet**
- Je router is kapot
- Je computer heeft geen IP-adres
- DNS werkt niet

**Vraag 2.** Waarom is het aangeraden om het standaard wachtwoord van je router (en eigenlijk de meeste devices) te veranderen zodra je het instelt?

---

## 1.5 Met ofzonder kabel

WiFi is handig. Ethernet is beter. Dat klinkt bot, maar voor een developer heeft die keuze concrete gevolgen.

Een **bekabelde verbinding** biedt hogere en stabielere snelheid, lagere **latency** (vertraging) en geen interferentie van andere apparaten of muren. De kabel verbindt je direct met de switch in je router.

**WiFi** werkt draadloos via radiogolven. Het is flexibel en makkelijk, maar het heeft nadelen: het signaal verzwakt door muren en afstand, meerdere apparaten delen dezelfde frequentieband en de verbinding kan tijdelijk wegvallen. Voor streams, browsen en videogesprekken merk je dat nauwelijks. Voor het debuggen van een brakke netwerkomgeving of het draaien van een lokale server die snel moet reageren, is WiFi een bron van frustraties.

Twee veel gebruikte WiFi-standaarden zijn **2,4 GHz** en **5 GHz**. De 2,4 GHz-band draagt verder maar is trager en drukker (veel apparaten gebruiken die band). De 5 GHz-band is sneller maar heeft minder bereik. Moderne routers ondersteunen beide.

Als developer is de praktische regel eenvoudig: sluit je ontwikkelomgeving aan via kabel als je dat kunt. Test je applicatie daarna ook op WiFi, want je gebruikers doen dat wel.

Dit betekent voor jou: kies kabel om stabiel te ontwikkelen en te troubleshooten en gebruik WiFi bewust als realistische gebruikerstest.

### Test jezelf

**Vraag 1.** Je bouwt een applicatie die realtime data verstuurt (bv. sensordata elke 100 milliseconden). Je test op WiFi en ziet onregelmatige vertragingen. Wat is de meest logische eerste stap?

- **Test opnieuw via een bekabelde verbinding om WiFi als variabele uit te sluiten**
- Verhoog de frequentie van de datastroom zodat verliezen minder opvallen
- Schakel over naar 2,4 GHz want dat is stabieler dan 5 GHz
- Herstart de applicatieserver

**Vraag 2.** Waarom is het zinvol om een applicatie zowel op een bekabelde verbinding als op WiFi te testen?

---

## 1.6 Wat bij problemen?

Netwerken werken niet altijd. Dat is geen bug in het systeem, dat *is* het systeem. Als developer word je vroeg of laat geconfronteerd met een verbinding die het niet doet en dan is "*Hello, IT. Have you tried turning it off and on again?*" geen professioneel antwoord.

Troubleshooten doe je systematisch, van binnenuit naar buiten.

**Stap 1: Werkt je eigen machine?** Controleer of je een IP-adres hebt (`ipconfig` op Windows, `ip a` op Linux, `ifconfig` op macOS). Geen IP? Dan is er een probleem met je netwerkconfiguratie of DHCP.

**Stap 2: Werkt je lokale netwerk?** Ping je router (`ping 192.168.1.1`). Reageert die niet, dan is er een probleem tussen jouw machine en de router — kabelprobleem, WiFi-probleem, of routerprobleem.

**Stap 3: Werkt het internet?** Ping een publiek IP (`ping 8.8.8.8`). Als stap 2 lukt maar stap 3 niet, zit het probleem meestal tussen je router en je provider.

**Stap 4: Werkt DNS?** Ping een domeinnaam (`ping google.com`). Als `8.8.8.8` werkt maar `google.com` niet reageert, dan is je DNS kapot. Je hebt internet, maar je computer kan domeinnamen niet omzetten naar IP-adressen.

**Stap 5: Werkt de specifieke dienst?** Gebruik `traceroute` (Linux/macOS) of `tracert` (Windows) om te zien waar packets vastlopen op hun weg naar de bestemming.

Dit stappenplan redt je van veel frustratie. De fout zit altijd ergens in die keten. Als je meteen begint te zoeken bij de server van je app, terwijl het probleem in je eigen DNS-instellingen zit, ben je uren kwijt.

Netwerkproblemen kunnen ook in je code zitten. Een verkeerde poort, een foute URL, een certificaat dat verlopen is, ... Dat zijn geen netwerkproblemen in de infrastructuurzin, maar ze voelen hetzelfde aan. Leer het onderscheid maken. Je bent degene die de diagnose moet stellen.

Dit betekent voor jou: werk altijd laag per laag en noteer je observaties. Dan maak je van "het werkt niet" een diagnose die je team echt vooruithelpt.

### Test jezelf

**Vraag 1.** `ping 8.8.8.8` werkt, maar `ping google.com` geeft "could not resolve host". Wat is er aan de hand?

- **DNS werkt niet: de computer kan de domeinnaam niet omzetten naar een IP-adres**
- Google's server is offline
- Je router blokkeert verbindingen met Google
- Je hebt geen internetverbinding

**Vraag 2.** Je collega zegt dat "de server niet bereikbaar is". Beschrijf de vier stappen die je doorloopt om te bepalen waar het probleem zit, van de eigen machine tot de server.

---

## Oefeningen Module 1

### Easy

**E1.** Noteer de uitvoer van `ipconfig` (Windows), `ip a` (Linux) of `ifconfig` (macOS) op je eigen machine. Identificeer je IP-adres, subnetmasker en standaard gateway.

**E2.** Voer `ping 8.8.8.8` uit en `ping google.com`. Zijn de resultaten hetzelfde? Noteer de gemiddelde responstijd (in ms) van beide en schrijf op wat je kunt afleiden hieruit.

**E3.** Open thuis de beheerpagina van je router (typisch `192.168.1.1` of `192.168.0.1`). Maak een screenshot van het overzicht van verbonden apparaten. Hoeveel apparaten zijn er verbonden? Kun je ze allemaal identificeren?

**E4.** Zoek op wat de termen "latency" en "bandbreedte" betekenen.

**E5.** Verklaar met eigen woorden het verschil tussen een modem, een router en een switch.

---

### Medium

**M1.** Teken een schematisch overzicht van je thuisnetwerk: welke apparaten zijn er, hoe zijn ze verbonden (kabel of WiFi), en via welk apparaat gaat het verkeer naar het internet?

**M2.** Vergelijk de pingresponstijd naar `192.168.1.1` (je router), `8.8.8.8` (Google DNS) en `ehb.be`. Noteer de resultaten en verklaar waarom de responstijden van elkaar verschillen.

**M3.** Je werkt in een team van vier developers. Iedereen werkt thuis. Jullie willen een lokale server opzetten die iedereen in het team kan bereiken. Leg uit waarom dit niet werkt via een eenvoudige LAN-verbinding. Wat is een mogelijke oplossing hiervoor?

---

### Hard

**H1.** Je bent aangesteld als junior developer bij een klein bedrijf. Er is geen IT-afdeling. De zaakvoerder vraagt je om het kantoornetwerk te "optimaliseren". Momenteel werkt iedereen op WiFi, er zijn regelmatig klachten over traagheid en verbindingsproblemen. Schrijf een analyse van de situatie en een concreet voorstel voor verbetering.

**H2.** Ontwerp een eenvoudig thuisnetwerkschema voor een gezin met de volgende vereisten: twee volwassenen die thuiswerken, drie kinderen die gaming en streaming doen, een NAS (netwerkopslag) die altijd bereikbaar moet zijn, en een apart gastnetwerk voor bezoekers. Welke apparaten heb je nodig, hoe verbind je ze, en welke beveiligingskeuzes maak je?

**H3.** Onderzoek hoe een **captive portal** werkt, het systeem dat je tegenkomt op openbare WiFi-netwerken waarbij je eerst moet inloggen of akkoord gaan met gebruiksvoorwaarden voor je internet krijgt. Beschrijf de technische stappen van het moment dat je verbindt tot het moment dat je vrij kunt browsen.

---

### At Home

**AT2. Sniffen en analyseren met Wireshark**

Installeer Wireshark op je laptop. Maak een capture van minstens vijf minuten terwijl je normaal je computer gebruikt: browsen, een video bekijken, eventueel een videogesprek voeren. Analyseer je capture: welke protocollen zie je, hoeveel data wordt verstuurd vs. ontvangen, kun je onderscheid maken tussen LAN-verkeer en WAN-verkeer? Schrijf een verslag van minstens één pagina met je bevindingen. Je hoeft niet alles te begrijpen — maar je moet beschrijven wat je ziet en wat je eruit kunt afleiden.