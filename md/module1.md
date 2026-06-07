# Module 1: Waarom kan mijn buur mij niet bereiken?

---

## 1.1 Hoe data fysiek beweegt

Stel: je stuurt een bestand naar een vriend twee straten verder. Je klikt op "verzenden" en een seconde later heeft hij het. Wat is er net gebeurd? Het antwoord is minder magisch dan het lijkt — en het begrijpen ervan legt de basis voor alles wat volgt.

Data beweegt over een netwerk niet als één groot blok, maar als kleine stukjes die afzonderlijk verstuurd worden. Die stukjes noemen we **packets** (pakketjes). Je bestand wordt opgesplitst, elk stukje krijgt een adres mee — zoals een envelop met een bestemming — en elk stukje kan een andere weg nemen om op de bestemming aan te komen. Aan de andere kant worden de stukjes terug samengevoegd tot het originele bestand. Dat hele systeem heet **packet switching**, en het maakt het internet robuust: bij congestie of uitval kan verkeer langs een andere route gestuurd worden.

Fysiek gezien beweegt die data via kabels (koper of glasvezel), draadloze signalen (wifi, 4G/5G), of optische vezels. De technologie verschilt, maar het principe blijft hetzelfde: bits reizen van punt A naar punt B, via soms tientallen tussenliggende apparaten.

Als developer hoef je niet elk detail van die fysieke laag te kennen. Maar je moet weten dat **netwerkcommunicatie nooit gegarandeerd** is. Pakketjes kunnen verloren gaan, vertraagd zijn of in de verkeerde volgorde aankomen. Protocollen zoals TCP vangen veel daarvan op met controles en hertransmissie, maar dat kost tijd. Je code moet daar rekening mee houden.

Dit betekent voor jou: bouw je applicatie alsof het netwerk soms traag, onvolledig of grillig reageert. Time-outs, retries en degelijke foutmeldingen zijn geen luxe, maar basiswerk.

### Test jezelf

**Vraag 1.** Wat is de voornaamste reden waarom het internet gebruikmaakt van packet switching in plaats van één doorlopende verbinding per bericht?

a) Omdat het netwerkcapaciteit efficiënt gedeeld kan worden en verkeer kan uitwijken bij uitval of congestie
b) Omdat het goedkoper is om kleine kabels te gebruiken
c) Omdat pakketjes minder stroom verbruiken dan een doorlopend signaal
d) Omdat grote bestanden te zwaar zijn voor één verbinding

**Vraag 2.** Jouw app verstuurt een afbeelding van 4 MB naar een server. De server meldt dat de afbeelding corrupt is aangekomen. Welke eigenschap van packet switching is hier mogelijk de oorzaak?

**Vraag 3.** Noem twee fysieke media waarover data kan reizen in een computernetwerk.

---

## 1.2 LAN vs WAN: je eigen bubbel vs de grote wereld

Je woont in een kot. Je laptop, je telefoon en de printer van je huisgenoot staan allemaal verbonden met dezelfde wifi-router. Jullie kunnen bestanden delen, naar dezelfde printer sturen, en elkaars scherm streamen — zonder dat daarvoor het internet nodig is. Dat is een **LAN**, een **Local Area Network** (lokaal netwerk).

Zodra je op een website surft, verlaat je die bubbel en stap je het **WAN** in: het **Wide Area Network** (wijdverspreid netwerk). Het internet is het bekendste voorbeeld van een WAN — een reusachtig netwerk van netwerken dat de hele wereld bestrijkt. Je huisnetwerk is één klein eilandje dat via je internetprovider verbinding maakt met dat grotere geheel.

Het onderscheid is praktisch belangrijk. Binnen een LAN is communicatie snel, goedkoop en min of meer privé. Buiten je LAN — zodra data door het WAN reist — gelden andere regels: het is trager, minder betrouwbaar, en je hebt geen controle meer over de infrastructuur. Als developer betekent dit dat een app die "gewoon werkt op mijn computer" heel anders kan reageren zodra ze over het publieke internet communiceert.

Een derde term die je soms tegenkomt is **MAN** (Metropolitan Area Network): een netwerk op stadsschaal, zoals het netwerk van een universiteit of een stadsbestuur. In de praktijk zal je dit zelden tegenkomen als developer, maar de term bestaat.

Dit betekent voor jou: test niet alleen lokaal. Test ook expliciet een scenario waarin client en server op verschillende netwerken zitten, want daar komen de echte verrassingen boven.

### Test jezelf

**Vraag 1.** Een developer test zijn applicatie lokaal: de frontend praat met een backend op dezelfde computer via `localhost` (127.0.0.1). Over welk type verkeer gaat het dan vooral?

a) Loopback-verkeer op dezelfde host; er is geen extern LAN of WAN nodig
b) WAN — omdat de frontend en backend als aparte systemen worden beschouwd
c) MAN — omdat de developer op een universiteitsnetwerk zit
d) Geen netwerk — lokale communicatie tussen processen is geen netwerkcommunicatie

**Vraag 2.** Je bouwt een chatapplicatie. Gebruikers in hetzelfde kantoor klagen over vertraging, maar gebruikers in het buitenland niet. Wat is een mogelijke oorzaak die verband houdt met het onderscheid LAN/WAN?

**Vraag 3.** Wat is het fundamentele verschil tussen een LAN en een WAN?

---

## 1.3 Router, switch, modem: wie doet wat?

In een doorsnee huiskamer staan al minstens twee van deze apparaten, dikwijls samengeperst in één kastje van je provider. Ze doen elk iets anders, en de verwarring ertussen leidt tot zinloze supportgesprekken en slecht geconfigureerde thuisnetwerken.

De **modem** is het apparaat dat jouw netwerk verbindt met het netwerk van je internetprovider. "Modem" staat voor modulator-demodulator: het zet het digitale signaal van jouw apparaten om naar een signaal dat geschikt is voor de kabel of glasvezel van je provider, en omgekeerd. Zonder modem ben je afgesneden van het internet. Meer doet een pure modem niet.

De **router** is het apparaat dat beslissingen neemt over waar data naartoe moet. Het kent alle apparaten in je LAN, weet welk publiek IP-adres jouw verbinding heeft, en zorgt ervoor dat data van het internet bij het juiste apparaat terechtkomt — en andersom. Routeren betekent letterlijk "een route bepalen". De router spreekt twee talen tegelijk: die van je lokale netwerk en die van het internet.

De **switch** is een verdeler binnen je LAN. Als je meerdere apparaten via kabel wil verbinden, sluit je ze aan op een switch. Een switch stuurt data alleen naar het apparaat waarvoor het bedoeld is — niet naar iedereen tegelijk, zoals een oudere **hub** dat deed. Thuis heb je een switch zelden apart nodig; je router heeft er al een ingebouwd. In een bedrijfsnetwerk is een switch een apart apparaat dat tientallen of honderden apparaten bedient.

Tegenwoordig levert je provider je één kastje dat modem, router en switch in één combineert. Handig, maar het maakt het onderscheid vazig. Als developer is het verschil wel degelijk relevant: als je een server wil bereikbaar maken van buitenaf, moet je aan de **router** sleutelen — niet aan de switch of modem.

Dit betekent voor jou: bij storingen of configuratievragen benoem je eerst de rol die faalt (modem, router of switch), en pas daarna het toestel. Zo analyseer je scherper en los je sneller op.

### Test jezelf

**Vraag 1.** Je wil je lokaal draaiende webserver bereikbaar maken vanop het internet. Aan welk apparaat moet je een instelling aanpassen?

a) De router — want die beheert de routing tussen je LAN en het internet
b) De switch — want die verdeelt data binnen je LAN
c) De modem — want die verbindt je met je internetprovider
d) De hub — want die broadcast data naar alle apparaten tegelijk

**Vraag 2.** Een bedrijf heeft 80 computers die allemaal via een kabel verbonden zijn met het netwerk. Welk apparaat is daarvoor onmisbaar naast de router?

**Vraag 3.** Wat is het functionele verschil tussen een switch en een hub?

---

## 1.4 Je thuisnetwerk opzetten en testen

Theorie is mooi, maar een netwerk moet je aanraken. In deze sectie zet je een eenvoudig thuisnetwerk op en verifieer je of het werkt — met tools die je als developer sowieso nodig zult hebben.

Het startpunt is je router. De meeste routers zijn bereikbaar via een webbrowser op het adres `192.168.1.1` of `192.168.0.1` — dit is het **standaard gateway-adres**, de toegang tot je netwerk van binnenuit. Log in met de gegevens die op de onderkant van je router staan (verander die nadien — de standaard wachtwoorden zijn publiek bekend).

Eenmaal ingelogd zie je het **dashboard** van je router: welke apparaten verbonden zijn, welke IP-adressen ze hebben, welk publiek IP-adres jouw verbinding heeft. Verken dit. Je ziet ook instellingen voor wifi-netwerken (SSID en wachtwoord), DHCP (meer daarover in module 2) en firewall-regels.

Om te testen of je netwerk werkt, gebruik je de terminal. Het commando `ping` stuurt een klein pakketje naar een adres en wacht op antwoord:

```bash
ping 192.168.1.1
```

Als je router reageert, werkt je lokale verbinding. Daarna test je of het internet bereikbaar is:

```bash
ping 8.8.8.8
```

`8.8.8.8` is een publieke DNS-server van Google. Als die reageert, heb je verbinding met het internet. Reageert hij niet, maar je router wel? Dan is er een probleem tussen je router en je provider.

Een tweede handig commando is `ipconfig` (Windows), `ip a` (Linux) of `ifconfig` (macOS). Dat toont je eigen IP-adres, je subnetmasker en je standaard gateway. Die drie waarden heb je straks nodig in module 2.

Dit betekent voor jou: als iets niet werkt, kijk je eerst naar je eigen configuratie voordat je de server of je code verdenkt.

### Test jezelf

**Vraag 1.** Je voert `ping 192.168.1.1` uit en krijgt een reactie, maar `ping 8.8.8.8` time-out. Wat kun je hieruit afleiden?

a) Je lokale netwerk werkt, maar er is een probleem tussen je router en het internet
b) Je router is kapot
c) Je computer heeft geen IP-adres
d) DNS werkt niet

**Vraag 2.** Wat is de standaard manier om toegang te krijgen tot de beheeromgeving van je router?

**Vraag 3.** Waarom is het aangeraden om het standaard wachtwoord van je router te veranderen zodra je het instelt?

---

## 1.5 Bekabeld vs draadloos: wanneer kies je wat?

Wifi is handig. Ethernet is beter. Dat klinkt bot, maar voor een developer heeft die keuze concrete gevolgen.

Een **bekabelde verbinding** (Ethernet, via een RJ-45-kabel) biedt hogere en stabielere snelheid, lagere **latency** (vertraging) en geen interferentie van andere apparaten of muren. De kabel verbindt je direct met de switch in je router. Wat je bestelt, krijg je.

**Wifi** werkt draadloos via radiogolven. Het is flexibel en makkelijk, maar het heeft nadelen: het signaal verzwakt door muren en afstand, meerdere apparaten delen dezelfde frequentieband, en de verbinding kan tijdelijk wegvallen. Voor streams, browsen en videogesprekken merk je dat nauwelijks. Voor het debuggen van een flakky netwerkomgeving of het draaien van een lokale server die snel moet reageren, is wifi een bron van valse alarmen.

Twee veel gebruikte wifi-standaarden zijn **2,4 GHz** en **5 GHz**. De 2,4 GHz-band draagt verder maar is trager en drukker (veel apparaten gebruiken die band). De 5 GHz-band is sneller maar heeft minder bereik. Moderne routers ondersteunen beide; sommige bieden ook **6 GHz** (WiFi 6E).

Als developer is de praktische regel eenvoudig: sluit je ontwikkelomgeving aan via kabel als je dat kunt. Test je applicatie daarna ook op wifi — want je gebruikers doen dat wel.

Dit betekent voor jou: kies kabel om stabiel te ontwikkelen en te troubleshooten, en gebruik wifi bewust als realistische gebruikerstest.

### Test jezelf

**Vraag 1.** Je bouwt een applicatie die realtime data verstuurt (bv. sensordata elke 100 milliseconden). Je test op wifi en ziet onregelmatige vertragingen. Wat is de meest logische eerste stap?

a) Test opnieuw via een bekabelde verbinding om wifi als variabele uit te sluiten
b) Verhoog de frequentie van de datastroom zodat verliezen minder opvallen
c) Schakel over naar 2,4 GHz want dat is stabieler dan 5 GHz
d) Herstart de applicatieserver

**Vraag 2.** Wat is het verschil in gebruik tussen de 2,4 GHz en de 5 GHz wifi-band?

**Vraag 3.** Waarom is het zinvol om een applicatie zowel op een bekabelde verbinding als op wifi te testen?

---

## 1.6 Troubleshooten: wanneer het niet werkt

Netwerken werken niet altijd. Dat is geen bug in het systeem — dat is het systeem. Als developer word je vroeg of laat geconfronteerd met een verbinding die het niet doet, en dan is "heb je al herstarten geprobeerd" geen professioneel antwoord.

Troubleshooten doe je systematisch, van binnenuit naar buiten.

**Stap 1: Werkt je eigen machine?** Controleer of je een IP-adres hebt (`ipconfig` op Windows, `ip a` op Linux, `ifconfig` op macOS). Geen IP? Dan is er een probleem met je netwerkconfiguratie of DHCP.

**Stap 2: Werkt je lokale netwerk?** Ping je router (`ping 192.168.1.1`). Reageert die niet, dan is er een probleem tussen jouw machine en de router — kabelprobleem, wifi-probleem, of routerprobleem.

**Stap 3: Werkt het internet?** Ping een publiek IP (`ping 8.8.8.8`). Als stap 2 lukt maar stap 3 niet, zit het probleem meestal tussen je router en je provider.

**Stap 4: Werkt DNS?** Ping een domeinnaam (`ping google.com`). Als `8.8.8.8` werkt maar `google.com` niet reageert, dan is je DNS kapot. Je hebt internet, maar je computer kan domeinnamen niet omzetten naar IP-adressen.

**Stap 5: Werkt de specifieke dienst?** Gebruik `traceroute` (Linux/macOS) of `tracert` (Windows) om te zien waar packets vastlopen op hun weg naar de bestemming.

Die hiërarchie redt je van veel frustratie. De fout zit altijd ergens in die keten. Als je meteen begint te zoeken bij de server van je app, terwijl het probleem in je eigen DNS-instellingen zit, ben je uren kwijt.

Netwerkproblemen kunnen ook in je code zitten. Een verkeerde poort, een foute URL, een certificaat dat verlopen is — dat zijn geen netwerkproblemen in de infrastructuurzin, maar ze voelen hetzelfde aan. Leer het onderscheid maken. Je bent degene die de diagnose moet stellen.

Dit betekent voor jou: werk altijd laag per laag en noteer je observaties. Dan maak je van "het werkt niet" een diagnose die je team echt vooruithelpt.

### Test jezelf

**Vraag 1.** `ping 8.8.8.8` werkt, maar `ping google.com` geeft "could not resolve host". Wat is er aan de hand?

a) DNS werkt niet: de computer kan de domeinnaam niet omzetten naar een IP-adres
b) Google's server is offline
c) Je router blokkeert verbindingen met Google
d) Je hebt geen internetverbinding

**Vraag 2.** Je collega zegt dat "de server niet bereikbaar is". Beschrijf de vier stappen die je doorloopt om te bepalen waar het probleem zit, van de eigen machine tot de server.

**Vraag 3.** Wat toont het commando `traceroute` (of `tracert` op Windows) en waarom is het nuttig bij het oplossen van netwerkproblemen?

---

## Oefeningen Module 1

### Easy

**E1.** Noteer de uitvoer van `ipconfig` (Windows), `ip a` (Linux) of `ifconfig` (macOS) op je eigen machine. Identificeer je IP-adres, subnetmasker en standaard gateway. Schrijf in één zin op wat elk van die drie waarden betekent.

**E2.** Voer `ping 8.8.8.8` uit en `ping google.com`. Zijn de resultaten hetzelfde? Noteer de gemiddelde responstijd (in ms) van beide en schrijf op wat je kunt concluderen.

**E3.** Open de beheerpagina van je router (typisch `192.168.1.1` of `192.168.0.1`). Maak een screenshot van het overzicht van verbonden apparaten. Hoeveel apparaten zijn er verbonden? Kun je ze allemaal identificeren?

**E4.** Zoek op wat de termen "latency" en "bandbreedte" betekenen. Schrijf een eigen definitie van elk — niet van Wikipedia, maar in je eigen woorden. Geef daarna een voorbeeld van een situatie waarin lage latency belangrijker is dan hoge bandbreedte.

**E5.** Verklaar met eigen woorden het verschil tussen een modem, een router en een switch. Maximaal drie zinnen per apparaat.

**E6.** Je krijgt dit bericht te zien in je terminal: `Request timeout for icmp_seq 0`. Wat betekent dit en wat zijn twee mogelijke oorzaken?

**E7.** Wat is het verschil tussen een LAN en een WAN? Geef voor elk een concreet voorbeeld uit je dagelijks leven als student of developer.

**E8.** Voer `traceroute google.com` (Linux/macOS) of `tracert google.com` (Windows) uit. Hoeveel "hops" (tussenstops) telt je verbinding naar Google? Noteer het eerste en het laatste IP-adres in de lijst.

---

### Medium

**M1.** Teken een schematisch overzicht van je thuisnetwerk: welke apparaten zijn er, hoe zijn ze verbonden (kabel of wifi), en via welk apparaat gaat het verkeer naar het internet? Je mag dit met de hand tekenen, uitwerken in een tool zoals draw.io, of beschrijven in tekst — als het maar volledig en correct is.

**M2.** Vergelijk de pingresponstijd naar `192.168.1.1` (je router), `8.8.8.8` (Google DNS) en `www.kuleuven.be`. Noteer de resultaten en verklaar waarom de responstijden van elkaar verschillen.

**M3.** Stel je voor: een gebruiker belt je op en zegt dat "het internet niet werkt". Schrijf een troubleshootingscript van vijf stappen dat je aan een niet-technische persoon kunt doorgeven via WhatsApp. Elke stap legt uit wat te doen én wat de uitkomst betekent.

**M4.** Zoek op wat de wifi-standaarden 802.11n, 802.11ac en 802.11ax (WiFi 6) van elkaar onderscheiden op het vlak van maximale snelheid en frequentiebanden. Presenteer dit als een vergelijkingstabel en schrijf daarna een aanbeveling: welk toestel zou je kiezen voor een kantooromgeving met 50 gebruikers, en waarom?

**M5.** Installeer Wireshark (gratis, wireshark.org) en laat het gedurende 30 seconden verkeer opnemen terwijl je een website bezoekt. Noteer drie verschillende protocollen die je ziet verschijnen in de capture. Je hoeft de inhoud nog niet te begrijpen — het gaat erom dat je ziet hoe druk het eigenlijk is.

**M6.** Je werkt in een team van vier developers. Iedereen werkt thuis. Jullie willen een lokale server opzetten die iedereen in het team kan bereiken. Leg uit waarom dit niet werkt via een eenvoudige LAN-verbinding en wat de opties zijn om het toch te realiseren.

**M7.** Verken de beheerpagina van je router. Zoek de instelling voor het wifi-wachtwoord en de SSID (netwerknaam). Pas de SSID aan naar een naam naar keuze (zet hem daarna gerust terug). Documenteer welke stappen je gevolgd hebt en wat je onderweg gezien hebt.

**M8.** Een bekende fout bij startende developers: ze testen hun app lokaal, alles werkt, maar zodra een collega probeert te verbinden, lukt het niet. Noem twee netwerkgerelateerde redenen waarom dit kan gebeuren en beschrijf voor elk hoe je het oplost.

**M9.** Wat is het verschil tussen een hub en een switch? Zoek op hoe een hub werkt op het vlak van dataoverdracht en vergelijk dit met een switch. Waarom worden hubs tegenwoordig niet meer gebruikt?

**M10.** Onderzoek wat "half-duplex" en "full-duplex" communicatie betekent in een netwerkomgeving. Welk van de twee gebruiken moderne switches? Wat is het praktische voordeel?

---

### Hard

**H1.** Je bent aangesteld als junior developer bij een klein bedrijf. Er is geen IT-afdeling. De zaakvoerder vraagt je om het kantoornetwerk te "optimaliseren" — momenteel werkt iedereen op wifi, er zijn regelmatig klachten over traagheid en verbindingsproblemen. Schrijf een analyse van de situatie en een concreet voorstel voor verbetering. Onderbouw je keuzes.

**H2.** Ontwerp een eenvoudig thuisnetwerkschema voor een gezin met de volgende vereisten: twee volwassenen die thuiswerken, drie kinderen die gaming en streaming doen, een NAS (netwerkopslag) die altijd bereikbaar moet zijn, en een apart gastnetwerk voor bezoekers. Welke apparaten heb je nodig, hoe verbind je ze, en welke beveiligingskeuzes maak je?

**H3.** Packet loss is een fenomeen waarbij een deel van de verstuurde pakketjes nooit aankomt. Onderzoek wat de gevolgen zijn van packet loss voor: (a) een videogesprek via Teams, (b) een bestandsoverdracht via FTP, (c) een real-time multiplayer game. Verklaar waarom de impact verschilt en welk mechanisme bij elk type communicatie packet loss opvangt — of niet.

**H4.** Een collega beweert: "Wifi is tegenwoordig even snel als kabel, dus het maakt niet uit wat je gebruikt." Bouw een tegenargument op basis van technische feiten. Geef ook aan in welke situaties je het met hem eens zou zijn.

**H5.** Je bent net begonnen aan een project waarbij een Raspberry Pi als lokale server fungeert voor een IoT-applicatie. De Pi is verbonden via wifi. Na een paar dagen merk je dat de verbinding af en toe wegvalt. Beschrijf systematisch hoe je dit probleem zou diagnosticeren en oplossen. Welke tools gebruik je, welke hypothesen test je?

**H6.** Onderzoek hoe een **captive portal** werkt — het systeem dat je tegenkomt op openbare wifi-netwerken waarbij je eerst moet inloggen of akkoord gaan met gebruiksvoorwaarden voor je internet krijgt. Beschrijf de technische stappen van het moment dat je verbindt tot het moment dat je vrij kunt browsen. Welke netwerkconcepten uit deze module spelen een rol?

**H7.** Schrijf een kort document (max. één A4) voor een niet-technische klant dat uitlegt wat een netwerk is, hoe data van zijn computer naar een webserver reist, en wat er kan mislopen. Gebruik geen jargon zonder uitleg, maar vereenvoudig ook niet zo sterk dat het fout wordt.

**H8.** Vergelijk twee scenario's: (a) een developer die thuis werkt via een standaard consumentenrouter, en (b) een developer die werkt in een bedrijfsomgeving met beheerde switches, een enterprise-router en een apart VLAN voor ontwikkelomgevingen. Welke praktische verschillen heeft dit voor de developer? Wanneer merkt hij het verschil, en wanneer niet?

---

### At Home

**AT1. Netwerktopologie van een bestaande omgeving** *(meerdere uren)*

Kies een bestaande netwerkinstallatie die je kunt onderzoeken: je thuis, een studentenkot, het netwerk van een familielid met een klein bedrijf. Maak een volledige netwerkkaart: alle apparaten, hun verbindingen (bekabeld of draadloos), IP-adressen (waar je ze kunt achterhalen), en het type apparaat (router, switch, modem, eindapparaat). Documenteer ook wat je niet kunt achterhalen en waarom. Voeg een korte analyse toe: wat werkt goed, wat zou je verbeteren?

**AT2. Sniffen en analyseren met Wireshark** *(meerdere uren, over twee sessies)*

Installeer Wireshark op je laptop. Maak een capture van minstens vijf minuten terwijl je normaal je computer gebruikt: browsen, een video bekijken, eventueel een videogesprek voeren. Analyseer je capture: welke protocollen zie je, hoeveel data wordt verstuurd vs. ontvangen, kun je onderscheid maken tussen LAN-verkeer en WAN-verkeer? Schrijf een verslag van minstens één pagina met je bevindingen. Je hoeft niet alles te begrijpen — maar je moet beschrijven wat je ziet en wat je eruit kunt afleiden.

**AT3. Bouw een eenvoudig thuisnetwerk van nul** *(één dag, optioneel met extra hardware)*

Als je toegang hebt tot een extra router of een Raspberry Pi: stel een tweede netwerk in naast je bestaande thuisnetwerk. Verbind een apparaat met dat nieuwe netwerk en test of het internet bereikbaar is. Configureer een apart gastnetwerk (SSID) als je router dat ondersteunt. Documenteer elke stap, inclusief de fouten die je maakte en hoe je ze oploste. Geen extra hardware? Doe dan een gedocumenteerde deep-dive in de beheerpagina van je huidige router: verken elke instelling, zoek op wat je niet begrijpt, en schrijf een begrippenlijst van minstens tien termen die je bent tegengekomen.
