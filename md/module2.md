# Module 2: Hoe weet het internet waar naartoe?

---

## 2.1 Wat is een IP-adres?

Je typt een URL in je browser, drukt op Enter, en hop: pagina geladen. Jij ziet een naam zoals `www.vrt.be`, maar onder de motorkap praat je toestel met een nummer. Dat nummer heet een **IP address** (IP-adres).

Een IP-adres is het adres van een toestel op een netwerk. Zonder adres weet geen enkel pakketje waar het naartoe moet, net zoals de postbode zonder huisnummer niet ver geraakt. Op elk netwerk, van je kot tot een cloudomgeving in Frankfurt, is adressering de basis van communicatie.

Een IP-adres vertelt twee dingen: bij welk netwerk je hoort en welk toestel je bent binnen dat netwerk. Later in deze module zie je hoe dat precies opgesplitst wordt met subnetten.

Dit betekent voor jou: als een app "de server niet vindt", kijk je altijd eerst naar adressen en bereikbaarheid. Zonder correct adres is alle hogere logica zinloos.

### Test jezelf

**Vraag 1.** Wat doet een IP-adres in essentie?

a) Het identificeert een toestel op een netwerk zodat verkeer correct gerouteerd kan worden
b) Het versleutelt alle data tussen client en server
c) Het vervangt DNS volledig
d) Het verhoogt automatisch je internetsnelheid

**Vraag 2.** Waarom volstaat een domeinnaam alleen niet voor netwerkverkeer?

**Vraag 3.** Je app kan lokaal starten, maar bereikt de database niet. Welke twee adresgerelateerde checks doe je eerst?

---

## 2.2 IPv4: structuur en limieten

Als je ooit `192.168.1.24` zag en dacht "ok, cijfers en puntjes", dan is dit je moment. **IPv4** (Internet Protocol version 4) gebruikt adressen van 32 bits, meestal geschreven als vier getallen van 0 tot 255, gescheiden door punten.

Een voorbeeld: `10.20.30.40`. Dat ziet er simpel uit, maar er zit structuur in: een deel identificeert het netwerk, een deel identificeert het toestel (host) binnen dat netwerk. Welk deel wat is, hangt af van het subnetmasker of CIDR-notatie.

De grote beperking van IPv4 is schaal. Met ongeveer 4,3 miljard mogelijke adressen lijkt dat veel, maar voor een wereld vol smartphones, servers, IoT en cloudomgevingen is dat krap. Daarom bestaan technieken zoals NAT en de overstap naar IPv6.

Dit betekent voor jou: als developer kom je IPv4 overal tegen, maar je moet weten dat het systeem op limieten botst. Je ontwerp moet rekening houden met private adressen, NAT en soms vreemde netwerkpaden.

### Test jezelf

**Vraag 1.** Wat is correct over IPv4?

a) IPv4 gebruikt 32-bit adressen, meestal genoteerd als vier getallen tussen 0 en 255
b) IPv4 gebruikt 64-bit adressen in hexadecimale notatie
c) IPv4 bevat alleen publieke adressen
d) IPv4 en MAC-adressen zijn hetzelfde

**Vraag 2.** Waarom is IPv4-adresruimte in de praktijk beperkt?

**Vraag 3.** Wat is het verschil tussen een IP-adres en een MAC-adres in één of twee zinnen?

---

## 2.3 Publiek vs privaat: wat mag je zien?

Je laptop thuis heeft vaak een adres zoals `192.168.x.x`, maar websites zien dat adres niet rechtstreeks. Ze zien meestal het publieke adres van je router. Welkom bij het verschil tussen **public IP** (publiek IP-adres) en **private IP** (privaat IP-adres).

Private IPv4-ranges zijn gereserveerd voor lokale netwerken:
- `10.0.0.0/8`
- `172.16.0.0/12`
- `192.168.0.0/16`

Die adressen worden niet rechtstreeks gerouteerd op het publieke internet. Je router vertaalt ze via **NAT** (Network Address Translation, netwerkadresvertaling) naar een publiek adres.

Dit betekent voor jou: als je lokaal iets draait op `192.168.1.50`, is dat niet automatisch bereikbaar van buitenaf. Voor externe toegang heb je routing, firewallregels en vaak port forwarding nodig.

### Test jezelf

**Vraag 1.** Welke range is een private IPv4-range?

a) `192.168.0.0/16`
b) `8.8.8.0/24`
c) `1.1.1.0/24`
d) `91.198.174.0/24`

**Vraag 2.** Waarom kan je collega thuis jouw lokale server op `192.168.1.50` niet direct bereiken?

**Vraag 3.** Leg in je eigen woorden uit wat NAT doet.

---

## 2.4 Subnetting: wat je écht moet kennen als developer

Subnetting klinkt voor veel mensen als pure netwerkmagie, maar voor jou als developer hoeft het niet ingewikkeld te zijn. Je moet geen examen "binaire acrobatie" afleggen. Je moet vooral begrijpen hoe je snel inschat of twee hosts in hetzelfde subnet zitten.

De notatie `192.168.10.0/24` betekent: de eerste 24 bits zijn netwerkdeel, de rest is hostdeel. Bij `/24` heb je typisch hosts van `192.168.10.1` tot `192.168.10.254` (met `.0` als netwerkadres en `.255` als broadcast in klassieke context).

Praktisch volstaan een paar patronen:
- `/24` is klein en overzichtelijk (vaak thuis of kleine teams).
- `/16` is groter en flexibeler.
- `/32` is exact één host.

Je hoeft niet elke berekening manueel te doen. Tools bestaan. Maar je moet de output begrijpen, anders debug je blind.

Dit betekent voor jou: als services elkaar "niet zien", check je altijd of IP en subnetmasker logisch matchen. Dat ene detail kan uren frustratie besparen.

### Test jezelf

**Vraag 1.** Wat betekent `/32` bij een IP-adres?

a) Het beschrijft exact één host-adres
b) Het beschrijft een netwerk met 32.000 hosts
c) Het is een alias voor DHCP
d) Het is alleen geldig bij IPv6

**Vraag 2.** Je hebt host A `192.168.1.10/24` en host B `192.168.2.20/24`. Zitten die in hetzelfde subnet?

**Vraag 3.** Waarom is subnetkennis nuttig voor een developer die met containers of cloudomgevingen werkt?

---

## 2.5 DHCP: adressen uitdelen zonder nadenken

Stel je voor dat je in een kantoor in Gent 60 laptops handmatig een IP-adres moet geven. Je bent daar morgen nog mee bezig, en tegen dan is de helft fout geconfigureerd. Daarom heb je **DHCP** (Dynamic Host Configuration Protocol).

DHCP deelt automatisch netwerkinstellingen uit: IP-adres, subnetmasker, default gateway en vaak ook DNS-server. Een toestel vraagt een lease, krijgt tijdelijk een adres, en vernieuwt dat later.

Zonder DHCP kan alles nog werken met statische adressen, maar beheer wordt traag en foutgevoelig. Met DHCP schaal je vlot, zolang je pool correct is ingesteld.

Dit betekent voor jou: bij "werkt gisteren wel, vandaag niet" check je DHCP-leases en conflicten. Verlopen leases of dubbele adressen geven vaak rare, intermitterende bugs.

### Test jezelf

**Vraag 1.** Wat deelt DHCP normaal gezien uit aan een client?

a) IP-adres, subnetmasker, gateway en vaak DNS-informatie
b) Alleen een MAC-adres
c) Alleen een poortnummer
d) Alleen een SSL-certificaat

**Vraag 2.** Wat is een DHCP-lease en waarom heeft die een vervaltijd?

**Vraag 3.** Noem één situatie waarin je bewust een statisch IP zou kiezen in plaats van DHCP.

---

## 2.6 DNS: het telefoonboek van het internet

Je brein onthoudt namen, geen IP-lijsten. Je typt `www.standaard.be`, niet `23.219.160.12`. **DNS** (Domain Name System, domeinnaamsysteem) vertaalt domeinnamen naar IP-adressen.

DNS werkt hiërarchisch en met caching. Je toestel vraagt meestal eerst aan een recursieve resolver (bijvoorbeeld die van je provider of een publieke resolver). Als het antwoord al gecachet is, gaat het snel. Zo niet, volgt een keten van queries tot het juiste antwoord gevonden is.

Een klassieke fout: IP-ping lukt wel (`8.8.8.8`), domeinnaam niet. Dan is je internet niet volledig "kapot", maar je naamresolutie faalt.

Dit betekent voor jou: als je app externe APIs niet vindt, test zowel op IP-niveau als op DNS-niveau. Anders ga je bugs zoeken in code die eigenlijk niet schuldig is.

### Test jezelf

**Vraag 1.** Wat is de kerntaak van DNS?

a) Domeinnamen vertalen naar IP-adressen
b) Data comprimeren voor snellere downloads
c) TLS-certificaten uitgeven
d) NAT-tabellen beheren

**Vraag 2.** Waarom maakt DNS-caching het web sneller?

**Vraag 3.** Je kunt `ping 8.8.8.8`, maar `ping www.vlaanderen.be` faalt. Welke diagnose stel je eerst?

---

## 2.7 IPv6: waarom het bestaat en wanneer je het tegenkomt

IPv6 is geen hippe gadget voor netwerknerds. Het is het antwoord op de adreslimieten van IPv4. **IPv6** gebruikt 128-bit adressen, geschreven in hexadecimale blokken, zoals `2001:db8::1`.

Met IPv6 is de adresruimte gigantisch. Daardoor heb je minder nood aan trucs zoals NAT voor pure adresuitputting. In de praktijk leven IPv4 en IPv6 naast elkaar: dat heet dual stack.

Als developer hoef je niet elk IPv6-detail te memoriseren. Je moet wel weten dat hardcoded IPv4-aannames fout kunnen gaan. Regexes, logging, firewallregels en allowlists moeten IPv6 aankunnen.

Dit betekent voor jou: schrijf netwerkcode en configuratie toekomstvast. Test minstens één keer op een omgeving waar IPv6 actief is, anders mis je bugs die later duur worden.

### Test jezelf

**Vraag 1.** Waarom bestaat IPv6 vooral?

a) Omdat IPv4-adresruimte beperkt is en internet verder blijft groeien
b) Omdat IPv6 automatisch alle cyberaanvallen stopt
c) Omdat IPv6 geen routers nodig heeft
d) Omdat IPv6 alleen voor mobiele netwerken bedoeld is

**Vraag 2.** Wat betekent dual stack in de praktijk?

**Vraag 3.** Geef één concreet voorbeeld van code of configuratie die stuk kan gaan als je alleen aan IPv4 dacht.

---

## Oefeningen Module 2

### Easy

**E1.** Zoek op je eigen toestel je IP-adres, subnetmasker en default gateway. Noteer in drie zinnen wat elk veld doet.

**E2.** Bepaal van deze adressen of ze private of publieke IPv4-adressen zijn: `192.168.10.8`, `10.4.3.2`, `8.8.8.8`, `172.20.14.9`.

**E3.** Zet `255.255.255.0` om naar CIDR-notatie en leg in één zin uit wat dat betekent voor het subnet.

**E4.** Beschrijf in je eigen woorden het verschil tussen een statisch IP en een DHCP-lease.

**E5.** Doe twee tests: `ping 8.8.8.8` en `ping www.kuleuven.be`. Schrijf op wat het resultaat zegt over DNS.

**E6.** Leg in maximaal vijf zinnen uit waarom NAT nodig werd in veel IPv4-netwerken.

**E7.** Geef een voorbeeld van een situatie waarin subnetting direct impact heeft op een developerworkflow.

**E8.** Zoek één IPv6-adres op in documentatie en leg uit hoe je herkent dat het geen IPv4-adres is.

---

### Medium

**M1.** Maak een overzichtstabel met vijf toestellen uit je omgeving: hostname, IP, private/publiek, DHCP of statisch. Voeg per rij één korte opmerking toe.

**M2.** Je krijgt twee hosts: `10.10.1.20/24` en `10.10.2.30/24`. Leg uit of ze rechtstreeks in hetzelfde subnet communiceren en wat er nodig is als dat niet zo is.

**M3.** Simuleer een DNS-probleem door tijdelijk een foutieve DNS-server in te stellen op een testtoestel. Documenteer symptomen, diagnose en herstel.

**M4.** Vergelijk `/24`, `/16` en `/32` in een korte tabel met: typische use case, aantal hosts en risico bij fout gebruik.

**M5.** Schrijf een mini-runbook (max. 12 stappen) voor "app bereikt externe API niet" waarin je IP-, DNS- en routechecks opneemt.

**M6.** Analyseer een case: "In een coworking in Antwerpen werkt de webapp via IP, maar niet via domeinnaam." Geef drie hypotheses en een testplan.

**M7.** Toon met een concreet voorbeeld waarom hardcoded IP-adressen in code onderhoudsproblemen geven.

**M8.** Maak een schema van DHCP-flow op hoog niveau: discover, offer, request, ack. Leg per stap uit wat er gebeurt.

**M9.** Onderzoek hoe je in een cloudomgeving een service publiek bereikbaar maakt zonder de interne private adressen bloot te geven.

**M10.** Schrijf een korte vergelijking van IPv4 en IPv6 voor een teamgenoot die vooral backend doet en weinig netwerkkennis heeft.

---

### Hard

**H1.** Ontwerp een adresplan voor een fictieve KMO in Leuven met drie afdelingen en 90 toestellen. Lever subnetindeling, DHCP-scope en reserveringen op.

**H2.** Werk een incidentanalyse uit: "Sinds 07/06/2026 10:15 krijgt een deel van de clients een APIPA-adres (`169.254.x.x`)." Beschrijf vermoedelijke oorzaken, tests en fix.

**H3.** Maak een beslisboom voor connectivity-problemen met minstens 12 knooppunten, van IP-config tot DNS en routing.

**H4.** Onderbouw wanneer je voor een server best een statisch IP gebruikt en wanneer DHCP met reservatie beter is.

**H5.** Analyseer een migratiescenario van een legacy IPv4-only applicatie naar dual stack. Benoem risico's in code, monitoring en security.

**H6.** Schrijf een kritische evaluatie van NAT: welke problemen lost het op, welke complexiteit voegt het toe voor debugging en inbound verkeer?

**H7.** Ontwerp een testprotocol om DNS-latency te meten op twee locaties (bijvoorbeeld thuis en campus) en vergelijk je resultaten.

**H8.** Maak een technisch maar leesbaar document voor juniors: "Subnetting zonder paniek" met drie uitgewerkte voorbeelden.

---

### At Home

**AT1. IP-audit van je eigen omgeving** *(meerdere uren)*

Maak een inventaris van minstens 12 toestellen of services in je omgeving. Per item noteer je IP, rol, DHCP/statisch, private/publiek en eventuele risico's. Sluit af met drie concrete verbeteracties.

**AT2. DNS-dagboek** *(over meerdere dagen)*

Kies vijf websites die je vaak gebruikt. Meet op drie verschillende tijdstippen per dag hoe snel DNS-resolutie lijkt te gaan (met tools of observaties), en noteer afwijkingen. Schrijf een korte analyse van patronen.

**AT3. Dual-stack verkenning** *(één dag)*

Zoek uit of je thuisnetwerk of een testomgeving IPv6 actief heeft. Documenteer hoe je dat vaststelt, welke adressen je ziet, en welke tools of code in je huidige projecten aangepast moeten worden om IPv6 correct te ondersteunen.
