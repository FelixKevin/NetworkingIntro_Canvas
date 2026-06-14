# Module 2: Adressen op internet

---

## 2.1 IP-adres

Als je een brief verstuurt zonder adres op de envelop, gaat die nergens naartoe. Hetzelfde geldt voor data op een netwerk. Elk apparaat dat communiceert heeft een **IP adres** (Internet Protocol-adres) nodig, een uniek nummer dat zegt wie je bent en waar je te bereiken bent. Je kan dus in je browser naar `www.vrt.be` surfen, maar intern zal dit toch omgezet worden naar een IP adres.

Een IP-adres is geen naam maar een locatie. Het identificeert niet het apparaat zelf, maar de verbinding van dat apparaat met een netwerk. Sluit je je laptop aan op een ander netwerk, dan krijg je een ander IP-adres. Dat is een belangrijk onderscheid: IP-adressen zijn (meestal) dynamisch en contextafhankelijk, niet vastgekoppeld aan hardware. (Het MAC-adres doet dat wel, maar dat speelt op een andere laag.)

Er zijn twee versies van IP-adressen in gebruik: **IPv4** en **IPv6**. IPv4 is wat je het vaakst tegenkomt en ziet er zo uit: `192.168.1.1`. IPv6 is de opvolger en ziet er zo uit: `2001:0db8:85a3::8a2e:0370:7334`. Waarom er twee versies zijn en wat het verschil betekent voor jou als developer, komen we straks op terug.

Als developer werk je bijna dagelijks met IP-adressen — ook al merk je het niet altijd. Elke keer dat je code een verbinding maakt met een database, een API aanroept, of een server deployed, zit er een IP-adres achter. Begrijpen hoe die adressen werken, maakt het verschil tussen raden en weten.

### Test jezelf

**Vraag 1.** Je laptop heeft thuis IP-adres `192.168.0.105`. Je brengt hem mee naar de school en verbindt met het schoolnetwerk. Wat is nu je IP-adres?

- **Een ander adres, uitgedeeld door het netwerk van de school — IP-adressen zijn gekoppeld aan de netwerkverbinding, niet aan het apparaat**
- Nog steeds `192.168.0.105` — dat adres is permanent aan je laptop gekoppeld tot je je besturingssysteem opnieuw installed
- Het MAC-adres van je laptop, omgezet naar IP-formaat
- Geen adres — je laptop heeft al een adres en kan er maar één hebben

**Vraag 2.** Noem twee situaties uit je dagelijks werk als developer waarbij een IP-adres een rol speelt, ook als je dat normaal niet bewust merkt.

---

## 2.2 IPv4

Een IPv4-adres bestaat uit vier getallen tussen 0 en 255, gescheiden door punten: `192.168.1.105`. Vier maal 8 bits geeft 32 bits in totaal en dat betekent dat er maximaal 2³², of dus ongeveer **4,3 miljard** unieke IPv4-adressen bestaan.

Klinkt als veel. En in de jaren 80 toen IPv4 bedacht werd was dat ook zo. Ondertussen zijn er meer apparaten met internetverbinding dan mensen op aarde en is het duidelijk dat 4,3 miljard adressen absoluut niet meer volstaan. Dat probleem heeft geleid tot twee oplossingen: **NAT** (Network Address Translation) als een soort tussenoplossing en **IPv6** als structurele oplossing.

Een IPv4-adres bestaat uit twee delen: het **netwerkgedeelte** en het **hostgedeelte**. Het netwerkgedeelte zegt in welk netwerk je zit; het hostgedeelte zegt welk specifiek apparaat je bent binnen dat netwerk. Hoeveel bits voor het netwerk zijn en hoeveel voor de host, bepaalt het **subnetmasker**.

Enkele bijzondere adressen die je als developer moet kennen: `127.0.0.1` is het **loopback-adres**, ook wel `localhost` genoemd. Dit is het adres van je eigen machine, gebruikt om lokaal te testen. `0.0.0.0` betekent "alle beschikbare interfaces" en gebruik je wanneer je een server wil laten luisteren op alle netwerkadressen van je machine. `255.255.255.255` is het **broadcast-adres**: een pakket dat hiernaar verstuurd wordt, gaat naar alle apparaten in het netwerk.

### Test jezelf

**Vraag 1.** Wat is correct over IPv4?

- **IPv4 gebruikt 32-bit adressen, meestal genoteerd als vier getallen tussen 0 en 255**
- IPv4 gebruikt 64-bit adressen in hexadecimale notatie
- IPv4 bevat alleen publieke adressen
- IPv4 en MAC-adressen zijn hetzelfde

**Vraag 2.** Ongeveer hoeveel IPv4-adressen bestaan er?

---

## 2.3 Public vs private

Stel dat elk device in elk huis wereldwijd een uniek IP-adres nodig had. Dat zijn miljarden adressen en zoals je weet zijn er daar niet meer genoeg van. De oplossing was een slimme opdeling: **publieke** en **private** IP-adressen.

**Private IP-adressen** zijn gereserveerd voor gebruik binnen een lokaal netwerk. Ze zijn niet bereikbaar van buitenaf en worden ook niet doorgestuurd over het internet. Drie reeksen zijn hiervoor vastgelegd:

- `10.0.0.0` -> `10.255.255.255`
- `172.16.0.0` -> `172.31.255.255`
- `192.168.0.0` -> `192.168.255.255`

Herken je die laatste reeks? Dat is het adres van je thuisrouter. Miljoenen routers wereldwijd gebruiken `192.168.1.1` als gateway en dat is geen probleem, want die adressen zijn alleen geldig binnen hun eigen lokale netwerk.

**Publieke IP-adressen** zijn uniek over het hele internet. Je internetprovider kent jouw thuisnetwerk één publiek IP-adres toe, dat is het adres dat de buitenwereld ziet. Alle apparaten in je thuisnetwerk delen dat ene publieke adres, dankzij **NAT**. NAT is de techniek waarbij je router bijhoudt welk apparaat welke verbinding heeft opgestart, zodat het antwoord van een server bij het juiste toestel terechtkomt.

Als developer is dit onderscheid cruciaal. Wanneer je een server lokaal draait op `192.168.1.105`, is die server niet bereikbaar van buitenaf tenzij je aan de router instelt dat extern verkeer doorgestuurd wordt naar dat adres. Wil je weten welk publiek IP-adres jouw verbinding heeft? Surf naar bijvoorbeeld `ifconfig.me` of `whatismyip.com`.

### Test jezelf

**Vraag 1.** Welke IPv4 adres is een private adres?

- **`192.168.3.29**
- `8.8.4.4`
- `1.10.10.232`
- `91.198.174.23`

**Vraag 2.** Waarom kan je collega thuis jouw lokale server op `192.168.1.50` niet direct bereiken?

---

## 2.4 Subnetting, wat je moet kennen als developer

Subnetting klinkt als iets voor netwerkbeheerders. Dat is voor negentig procent ook zo. Maar er zijn situaties waar jij als developer niet omheen kunt: Docker-netwerken, cloudconfiguraties, firewallregels, VPN-instellingen, ... Wie subnetting niet begrijpt, kopieert netwerkconfiguraties zonder te weten wat ze doen. Dat eindigt meestal vroeg of laat slecht.

Een **subnetmasker** bepaalt welk deel van een IP-adres het netwerk aanduidt en welk deel de host. Het masker `255.255.255.0` betekent dat de eerste drie octetten het netwerk identificeren en het laatste octet de host. In het netwerk `192.168.1.0/24` kunnen dus 254 hosts bestaan (van `192.168.1.1` tot `192.168.1.254` — `.0` is het networkadres, `.255` is broadcast).

Die `/24` notatie heet **CIDR** (Classless Inter-Domain Routing). Het getal na de slash zegt hoeveel bits gereserveerd zijn voor het netwerkgedeelte. `/24` betekent 24 bits voor het netwerk, 8 bits voor hosts. `/16` geeft je meer hosts (65.534), `/30` geeft je er maar 2 — handig voor een point-to-point verbinding.

Wat je concreet moet kunnen als developer:

Een `/24`-netwerk herkennen als "256 adressen, waarvan 254 bruikbaar". Begrijpen dat twee machines in hetzelfde subnet rechtstreeks met elkaar kunnen praten, maar dat machines in verschillende subnetten via een router moeten. En weten dat `192.168.1.50/24` en `192.168.2.50/24` in **verschillende** netwerken zitten, ook al lijken ze op elkaar.

Moet je subnetberekeningen uit je hoofd doen? Nee. Gebruik een tool zoals `ipcalc` of een online subnetcalculator. Maar je moet de output kunnen lezen en interpreteren. Een configuratie blind kopiëren zonder te begrijpen wat het subnetmasker doet, is een fout die je vroeg of laat duur betaalt.

### Test jezelf

**Vraag 1.** Wat betekent `/32` bij een IP-adres?

- **Het beschrijft exact één host-adres**
- Het beschrijft een netwerk met 32.000 hosts
- Het is een alias voor DHCP
- Het is alleen geldig bij IPv6

**Vraag 2.** Je hebt twee servers: `10.0.1.5/24` en `10.0.2.5/24`. Kunnen ze rechtstreeks met elkaar communiceren zonder router?

- **Nee, ze zitten in verschillende subnetten (`10.0.1.0/24` en `10.0.2.0/24`) en hebben een router nodig om te communiceren**
- Ja, ze beginnen allebei met `10.0` dus zitten ze in hetzelfde netwerk
- Ja, het subnetmasker `/24` betekent dat alle `10.x.x.x`-adressen in hetzelfde netwerk zitten
- Nee, `10.x.x.x`-adressen zijn gereserveerde private adressen en kunnen nooit rechtstreeks communiceren

---

## 2.5 DHCP, zo gemakkelijk maar ook zo lastig soms

Elke keer dat je verbindt met een WiFi-netwerk, krijg je automatisch een IP-adres. Je hebt daar niets voor ingesteld. Dat is **DHCP** aan het werk: het **Dynamic Host Configuration Protocol**.

DHCP is een service die draait op je router (of op een aparte server in grotere netwerken). Wanneer een nieuw apparaat verbindt, stuurt dat apparaat een broadcast-bericht met de vraag: "Ne goeiendag, ik zou graag willen verbinden maar ik heb een config nodig?" De DHCP-server antwoordt met een aanbod: een IP-adres, een subnetmasker, het adres van de gateway en (meestal) de DNS-server die het apparaat moet gebruiken. Die vier waarden vormen samen de volledige netwerkconfiguratie van je toestel.

Een DHCP-adres is niet permanent. Het wordt uitgedeeld voor een bepaalde periode, de **lease time**. Na afloop vraagt het apparaat het adres opnieuw aan, meestal krijgt het hetzelfde adres terug, maar dat is niet gegarandeerd. Dat is precies waarom servers en apparaten die altijd op hetzelfde adres bereikbaar moeten zijn (zoals een printer, een NAS, of een ontwikkelomgeving) een **statisch IP-adres** krijgen. Dat stel je ofwel in op het apparaat zelf, ofwel via een **DHCP-reservatie** in je router, waarbij het MAC-adres van het apparaat gekoppeld wordt aan een vast IP.

Als developer betekent dit: je lokale machine krijgt waarschijnlijk een dynamisch adres. Als je wil dat iets op een vast adres bereikbaar is in je ontwikkelomgeving (een lokale database, een testserver, een Raspberry Pi, ...) configureer dan een statisch adres of een reservatie. Zo voorkom je dat je configuratie elke week breekt omdat het IP-adres veranderd is.

### Test jezelf

**Vraag 1.** Wat deelt DHCP niet uit aan een client?

- **SSL-certificaat**
- Default gateway
- IP-adres
- Subnetmask

**Vraag 2.** Je hebt een lokale MySQL-database draaien op `192.168.1.45`. Na een herstart van je router verbindt je applicatie niet meer. Wat is de meest waarschijnlijke oorzaak?

- **De database heeft via DHCP een nieuw IP-adres gekregen, maar je applicatieconfiguratie verwijst nog naar het oude adres**
- MySQL ondersteunt geen dynamische IP-adressen
- De router heeft de databaseverbinding geblokkeerd na de herstart
- DHCP deelt alleen adressen uit aan bekende apparaten

**Vraag 3.** Noem een situatie waarin je bewust een statisch IP zou kiezen in plaats van DHCP.

---

## 2.6 It's always a DNS-issue

Niemand typt `142.250.184.78` in in de browser om naar Google te gaan. Je typt gewoon `google.com`. Die vertaling, van een leesbare domeinnaam naar een IP-adres zal door **DNS** gebeuren: het **Domain Name System**.

DNS werkt als een databank van domeinnamen en hun bijhorende IP-adressen, dat op verschillende plaatsen gedupliceerd. Wanneer je `google.com` intypt, stuurt je computer een vraag naar een **DNS-resolver** (meestal je router of de DNS-server van je provider). Als die het antwoord niet weet, vraagt hij het door aan een hoger liggende server, tot er een **authoritative nameserver** wordt bereikt die het definitieve antwoord heeft.

Dat systeem is hiërarchisch opgebouwd. Bovenaan staan de **root nameservers** (er zijn er 13 logische, verspreid over honderden fysieke servers wereldwijd). Daaronder de **TLD-servers** (Top Level Domain), één per domeinextensie zoals `.com`, `.be`, `.org`. Daaronder de nameservers van de domeinen zelf.

Als developer kom je DNS in meerdere contexten tegen. Je configureert een domein voor een klant en moet weten wat een **A-record** is (koppelt een naam aan een IPv4-adres), een **AAAA-record** (IPv6), een **CNAME** (alias naar een andere naam) of een **MX-record** (voor e-mailverkeer). Je debugt een deployment en vraagt je af waarom je nieuwe server nog niet bereikbaar is, dat is de **TTL** (Time To Live) die bepaalt hoe lang DNS-antwoorden gecached worden. Aanpassingen aan DNS-records kunnen tot 24 uur nodig hebben om wereldwijd door te pushen.

Wil je snel DNS-informatie opvragen? Gebruik `nslookup google.com` of `dig google.com` in je terminal. Die tools tonen je welk IP-adres aan een domeinnaam gekoppeld is en via welke server dat antwoord gekomen is.

### Test jezelf

**Vraag 1.** Wat is de kerntaak van DNS?

- **Domeinnamen vertalen naar IP-adressen**
- Data comprimeren voor snellere downloads
- TLS-certificaten uitgeven
- NAT-tabellen beheren

**Vraag 2.** Je kunt `ping 8.8.8.8`, maar `ping www.vlaanderen.be` faalt. Welke diagnose stel je eerst?

---

## 2.7 IPv6

IPv4 zit vol. Dat is geen toekomstprobleem, maar dat is nu al het geval. De officiële pool van vrije IPv4-adressen is in 2011 uitgeput. Sindsdien worden adressen herverdeeld, verhuurd en gerecycleerd, maar de structurele, langdurige, oplossing is **IPv6**.

Een IPv6-adres bestaat uit 128 bits in plaats van 32 en ziet er zo uit: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`. Dat zijn acht groepen van vier hexadecimale cijfers, gescheiden door dubbele punten. Opeenvolgende groepen van nullen mogen afgekort worden met `::`, waardoor het adres hierboven ook als `2001:db8:85a3::8a2e:370:7334` geschreven kan worden. Met 128 bits zijn er 2¹²⁸ mogelijke adressen, een getal zo groot dat elk zandkorrel op aarde er miljoenen zou kunnen krijgen.

IPv6 brengt ook enkele conceptuele verschillen mee. Er is geen NAT: elk apparaat kan een uniek publiek adres krijgen. Broadcast bestaat niet meer; in de plaats is er **multicast** en **anycast**. En een apparaat kan meerdere IPv6-adressen tegelijk hebben, een link-local adres (begint altijd met `fe80::`) voor communicatie binnen het lokale netwerk en een globaal adres voor het internet.

Als developer ga je IPv6 steeds vaker tegenkomen. Cloudproviders als AWS, Azure en Google Cloud ondersteunen het volledig. Mobiele netwerken gebruiken het al uitgebreid. Je hoeft geen IPv6-expert te zijn, maar je moet het adresformaat herkennen, weten dat `::1` het IPv6-equivalent is van `127.0.0.1` (localhost) en begrijpen dat een applicatie die alleen naar IPv4 luistert, IPv6-verbindingen weigert. Dat laatste is een niet altijd voor de hand liggend probleem dat voor verwarrende fouten zorgt.

### Test jezelf

**Vraag 1.** Waarom bestaat IPv6 vooral?

- **Omdat IPv4-adresruimte beperkt is en internet verder blijft groeien**
- Omdat IPv6 geen NAT nodig heeft
- Omdat IPv6 geen routers nodig heeft
- Omdat IPv6 alleen voor mobiele netwerken bedoeld is

**Vraag 2.** Je start een server op `127.0.0.1:3000` en probeert er verbinding mee te maken via `::1:3000`. Lukt dat?

- **Misschien wel, misschien niet. `127.0.0.1` is een IPv4 loopback-adres en `::1` is het IPv6-equivalent; het hangt af van de configuratie van je server**
- Ja, want `127.0.0.1` en `::1` zijn identiek en volledig uitwisselbaar
- Nee, want IPv6-adressen werken niet op localhost
- Ja, maar enkel op Linux want op Windows werkt dit niet

---

## Oefeningen Module 2

### Easy

**E1.** Voer `ipconfig /all` (Windows) of `ip a` (Linux/macOS) uit. Noteer je IP-adres, subnetmasker, standaard gateway en DNS-server(s). Welke van deze waarden zijn privaat en welke publiek?

**E2.** Surf naar `ifconfig.me` of `whatismyip.com`. Noteer je publieke IP-adres. Vergelijk het met je lokale IP-adres uit de vorige oefening. Wat valt je op?

**E3.** Voer `nslookup vrt.be` en `nslookup ehb.be` uit. Noteer de IP-adressen die teruggegeven worden. Voer daarna `ping vrt.be` uit. Klopt het IP-adres dat ping gebruikt overeen met wat nslookup gaf?

**E4.** Wat is het IPv6-equivalent van `127.0.0.1`? Wat is het IPv6-equivalent van "alle interfaces" (`0.0.0.0` in IPv4)? Zoek het op en noteer beide adressen.

**E5.** Wat is het verschil tussen een A-record en een AAAA-record in DNS? Zoek met `dig vrt.be A` en `dig vrt.be AAAA` of VRT zowel IPv4 als IPv6 ondersteunt.

---

### Medium

**M1.** Gebruik `dig` of `nslookup` om de DNS-records van `vub.be` op te vragen. Zoek het A-record, eventuele CNAME-records en het MX-record. Schrijf in één alinea op wat je kunt afleiden over de infrastructuur van VUB op basis van deze informatie.

**M2.** Simuleer een DNS-probleem door tijdelijk een foutieve DNS-server in te stellen op een je device. Documenteer symptomen, diagnose en herstel.

**M3.** Toon met een concreet voorbeeld waarom hardcoded IP-adressen in code onderhoudsproblemen geven.

**M4.** Onderzoek hoe je in een cloudomgeving een service publiek bereikbaar maakt zonder de interne private adressen bloot te geven.

---

### Hard

**H1.** Ontwerp een IP-adresseringsplan voor een klein kantoor met de volgende vereisten: 30 werkstations, 5 servers (waaronder een database en een webserver), 10 IP-telefoons, en een gastnetwerk voor bezoekers. Gebruik het `192.168.0.0/16`-adresblok en verdeel het in logische subnetten. Onderbouw je keuzes voor de subnetgrootte.

**H2.** Onderzoek wat **DNSSEC** is en welk probleem het oplost. Wat is een DNS cache poisoning-aanval? Hoe beschermt DNSSEC ertegen? Is DNSSEC actief op `belgium.be`? Gebruik `dig +dnssec belgium.be` om dat te controleren.

**H3.** Je deployt een Node.js-applicatie op een VPS bij bijvoorbeeld Combell of OVH. De applicatie luistert op `127.0.0.1:3000`. Een collega zegt dat de applicatie "niet bereikbaar" is van buitenaf. Leg uit waarom, en beschrijf wat je moet aanpassen, zowel in de applicatiecode als eventueel in de serverinstellingen, om de applicatie publiek bereikbaar te maken.

---

### At Home

**AT1.** Kies een Belgische website naar keuze. Voer een volledig DNS-onderzoek uit: verzamel alle publiek beschikbare DNS-records (A, AAAA, CNAME, MX, TXT, NS), analyseer wat je kunt afleiden over de infrastructuur (hostingprovider, e-mailprovider, gebruik van CDN) en controleer of DNSSEC actief is. Gebruik `dig`, `nslookup` en eventueel online tools zoals `dnschecker.org`.