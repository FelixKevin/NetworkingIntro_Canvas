# Module 3: Waarom kan mijn app de database niet bereiken?

---

## 3.0 Tools en terminal

Je app start, je frontend laadt, maar je query blijft hangen alsof er niets leeft aan de andere kant. Dan helpt gokken niet. Dan heb je zicht nodig.

De basisset voor deze module is klein maar krachtig: terminal, ping, curl, nc, lsof en eventueel ss of netstat. Met die tools test je of een service draait, of een poort luistert en of je verkeer effectief aankomt.

Je hoeft niet elk commando van buiten te kennen. Je moet vooral begrijpen wat je meet, en in welke volgorde je test.

Dit betekent voor jou: bij netwerkfouten begin je met observatie in plaats van aannames. Eerst meten, dan pas aanpassen.

### Test jezelf

**Vraag 1.** Wat is de beste eerste reflex bij een verbindingsfout tussen app en database?

a) Met terminaltools testen wat werkt en wat niet, vóór je code wijzigt
b) Meteen je ORM vervangen
c) Herinstalleren van je volledige ontwikkelomgeving
d) De database resetten zonder diagnose

**Vraag 2.** Waarom is een vaste testvolgorde nuttig bij troubleshooten?

**Vraag 3.** Noem twee terminaltools die je kan gebruiken om te checken of een service bereikbaar is.

---

## 3.1 Wat is een poort?

Je kan een server zien als een gebouw met één straatadres en heel veel deuren. Het IP-adres is het gebouw. De poort is de juiste deur.

Een **port** (poort) is een logisch nummer waarop een proces luistert naar netwerkverkeer. Zonder juist poortnummer kom je wel bij de machine aan, maar praat je tegen de verkeerde service, of tegen niemand.

Poorten lopen van 0 tot 65535. In de praktijk krijg je vaak combinaties zoals localhost:3000, localhost:5432 of api.example.be:443.

Dit betekent voor jou: bij Elke verbinding controleer je altijd IP plus poort. Alleen een correct IP is niet genoeg.

### Test jezelf

**Vraag 1.** Wat doet een poort in netwerkcommunicatie?

a) Ze stuurt verkeer naar de juiste service op een host
b) Ze vervangt het IP-adres volledig
c) Ze bepaalt je wifi-signaalsterkte
d) Ze versleutelt automatisch alle data

**Vraag 2.** Je app bereikt de server wel, maar krijgt connection refused. Welke poort-gerelateerde oorzaken check je eerst?

**Vraag 3.** Waarom volstaat een IP-adres alleen niet om een webapp of database te bereiken?

---

## 3.2 Poorten die elke developer kent

Sommige poorten kom je zó vaak tegen dat je ze best direct herkent. Dat spaart je veel tijd tijdens debuggen.

Klassiekers: 80 voor HTTP, 443 voor HTTPS, 22 voor SSH, 3306 voor MySQL, 5432 voor PostgreSQL, 6379 voor Redis, 27017 voor MongoDB. In development zie je ook vaak 3000, 5173, 8080 en 8000 voor lokale webservers.

Die nummers zijn geen heilige wet, maar conventies. Je kan veel services op een andere poort laten draaien, zolang client en server dezelfde afspraak volgen.

Dit betekent voor jou: leer de veelgebruikte poorten herkennen, maar vertrouw nooit blind op defaults. Controleer altijd de echte runtimeconfiguratie.

### Test jezelf

**Vraag 1.** Welke poort hoort standaard bij HTTPS?

a) 443
b) 80
c) 22
d) 5432

**Vraag 2.** Je PostgreSQL luistert niet op 5432 maar op 15432. Wat moet je aanpassen in je applicatieconfiguratie?

**Vraag 3.** Waarom is het gevaarlijk om alleen op standaardpoorten te vertrouwen tijdens troubleshooting?

---

## 3.3 localhost en 127.0.0.1: je eigen mini-internet

Als je localhost zegt, bedoel je: praat met mezelf. Handig, snel, en meestal veilig genoeg voor lokale development.

**localhost** verwijst naar de loopback-interface. Bij IPv4 is dat vaak 127.0.0.1. Verkeer naar dit adres verlaat je toestel niet, ook niet als je wifi uit staat.

Dat is super voor testen, maar het zorgt ook voor verwarring. Een container, vm of tweede toestel ziet jouw localhost niet. Die kijkt naar zijn eigen loopback.

Dit betekent voor jou: als iets lokaal werkt maar niet van buitenaf, check je eerst of je service alleen op localhost bindt in plaats van op een extern bereikbare interface.

### Test jezelf

**Vraag 1.** Wat betekent localhost in de praktijk?

a) Verkeer naar de eigen machine via de loopback-interface
b) Verkeer naar de router in je thuisnetwerk
c) Verkeer naar een publieke cloudserver
d) Verkeer dat alleen via wifi werkt

**Vraag 2.** Waarom kan je collega jouw lokale server op localhost niet bereiken?

**Vraag 3.** Welke bind-instelling kan ervoor zorgen dat een service enkel lokaal bereikbaar is?

---

## 3.4 Sockets: hoe praat code met het netwerk?

Je code opent geen magisch kanaal naar de database. Ze opent een **socket** (netwerksocket): een software-eindpunt voor communicatie.

Een socket combineert protocol, IP en poort. Denk aan TCP-sockets voor betrouwbare stroomgebaseerde communicatie, of UDP-sockets voor snellere maar minder strikte datagrammen.

De meeste frameworks verstoppen sockets netjes achter libraries. Dat is fijn tot er iets faalt. Dan moet je toch begrijpen wat er onder de kap gebeurt.

Dit betekent voor jou: als je time-outs, resets of broken pipe-fouten ziet, denk je in sockets en connectiestatus, niet alleen in frameworkfouten.

### Test jezelf

**Vraag 1.** Wat is een socket?

a) Een software-eindpunt waarmee processen over het netwerk communiceren
b) Een fysieke ethernetpoort op je laptop
c) Een DNS-record voor service discovery
d) Een firewallregel met allow of deny

**Vraag 2.** Wanneer kies je meestal TCP boven UDP voor app-databaseverkeer?

**Vraag 3.** Geef één voorbeeld van een foutmelding die op socketproblemen kan wijzen.

---

## 3.5 Firewalls: bewaker aan de poort

Je service draait, je poort klopt, en toch komt er niks door. Dan staat er vaak een bewaker in de weg: de firewall.

Een **firewall** (netwerkfilter) laat verkeer toe of blokkeert het op basis van regels. Die regels kunnen op hostniveau zitten, in je router, in cloud security groups of op meerdere plekken tegelijk.

Dat maakt debugging soms verraderlijk. Jij ziet een open service, maar onderweg zegt een regel gewoon nee.

Dit betekent voor jou: controleer firewallregels altijd op de volledige route, niet alleen op je eigen machine.

### Test jezelf

**Vraag 1.** Wat doet een firewall in essentie?

a) Verkeer toelaten of blokkeren volgens vooraf bepaalde regels
b) Automatisch je database optimaliseren
c) DNS vervangen door directe IP-routing
d) Je applicatiecode compileren

**Vraag 2.** Waarom kan verkeer lokaal wel werken maar van buitenaf toch geblokkeerd worden?

**Vraag 3.** Noem twee plaatsen waar firewallregels kunnen staan in een typische setup.

---

## 3.6 Port forwarding: naar binnen laten wat je wil

Stel: je draait thuis een test-API op je laptop en je wil dat een teammate die kan bereiken. Dan heb je meestal **port forwarding** nodig.

Bij port forwarding maakt je router een mapping van een externe poort naar een intern IP en poort. Bijvoorbeeld extern 8443 naar intern 192.168.0.25:443.

Dat werkt, maar het opent ook een deur naar binnen. Doe dit bewust, zo beperkt mogelijk, en alleen wanneer nodig.

Dit betekent voor jou: voor externe bereikbaarheid denk je in drie lagen tegelijk: routermapping, firewallregels en de service die echt luistert op de doelpoort.

### Test jezelf

**Vraag 1.** Wat doet port forwarding?

a) Extern inkomend verkeer doorsturen naar een specifieke interne host en poort
b) Alle interne poorten automatisch publiceren op internet
c) DNS-records versleutelen
d) DHCP-leases verlengen

**Vraag 2.** Waarom is port forwarding een veiligheidsrisico als je het slordig configureert?

**Vraag 3.** Welke drie controles doe je na het instellen van een forwardingregel?

---

## 3.7 Veelgemaakte fouten en hoe je je ze herkent

De klassiekers blijven dezelfde, ook bij sterke developers. Verkeerde hostnaam. Foute poort. Service draait niet. Firewall blokkeert. Of je app probeert naar localhost te praten vanuit een container waar localhost iets anders betekent.

Een tweede valkuil: je test op één machine en denkt dat de keten ok is. Maar tussen client en database zitten vaak nog meerdere lagen: DNS, NAT, firewall, proxy, tls en routing.

Daarom werkt een korte diagnosechecklist beter dan heldhaftig gokken. Minder drama, meer resultaat.

Dit betekent voor jou: maak je eigen standaard checklist en gebruik die altijd. Professionaliteit is vaak gewoon consequent zijn onder druk.

### Test jezelf

**Vraag 1.** Welke fout komt het vaakst voor bij app-database connectiviteit?

a) Mismatch in host, poort of bind-adres
b) Te weinig RAM op de client
c) Te veel tabs open in je browser
d) Verkeerde toetsenbordlayout

**Vraag 2.** Waarom is localhost in containers vaak een bron van verwarring?

**Vraag 3.** Stel een mini-checklist op van vijf stappen voor de foutmelding connection timed out naar een database.

---

## Oefeningen Module 3

### Easy

**E1.** Controleer op je eigen machine welke processen luisteren op netwerkpoorten. Noteer drie processen met poortnummer en vermoedelijke rol.

**E2.** Test met nc of telnet of poort 80 en 443 bereikbaar zijn voor een publieke website. Schrijf op wat het verschil in resultaat betekent.

**E3.** Draai lokaal een simpele webserver en test die via localhost en via je lokale IP-adres. Vergelijk de resultaten.

**E4.** Maak een tabel met tien veelgebruikte developerpoorten en bijhorende services.

**E5.** Schrijf in je eigen woorden het verschil tussen connection refused en connection timed out.

**E6.** Zoek uit welke firewall actief is op je machine. Noteer waar je regels kan bekijken.

**E7.** Simuleer een fout door bewust een verkeerde poort in je appconfig te zetten. Documenteer symptoom, diagnose en fix.

**E8.** Beschrijf in maximaal acht zinnen hoe localhost, IP-adres en poort samen een endpoint vormen.

---

### Medium

**M1.** Schrijf een diagnoseflow voor app naar database problemen in maximaal 12 stappen, van processtatus tot firewall.

**M2.** Zet een lokale database op en verbind ermee vanuit een aparte testapp. Toon dat verbinding op localhost werkt en leg uit wat je moet veranderen voor verbinding vanaf een tweede toestel.

**M3.** Analyseer een case: backend werkt lokaal, maar frontend op een andere machine krijgt geen data. Geef drie hypotheses met tests.

**M4.** Vergelijk TCP en UDP op het vlak van betrouwbaarheid, latency en typische use cases. Sluit af met keuzeadvies voor databaseverkeer.

**M5.** Onderzoek de impact van een hostfirewallregel die inkomend verkeer op één poort blokkeert. Documenteer hoe je de blokkering herkent.

**M6.** Maak een overzicht van poorten die jouw project gebruikt, inclusief service, protocol en risico bij blootstelling.

**M7.** Voer een gecontroleerde port forwarding test uit in een veilige thuislabopstelling. Beschrijf setup, resultaten en beveiligingsmaatregelen.

**M8.** Los een containercase op waar app en database elkaar niet vinden door fout endpoint. Beschrijf het verschil tussen localhost in host en container.

**M9.** Schrijf een runbook voor een junior developer met titel database not reachable waarin je minimaal twee commando’s per diagnoselaag geeft.

**M10.** Bouw een beslisboom met minimaal tien knooppunten voor connection refused versus timed out versus name not resolved.

---

### Hard

**H1.** Ontwerp een veilige netwerkopstelling voor een webapp met database in een kleine Belgische kmo. Motiveer poortkeuzes, firewallregels en toegangsbeleid.

**H2.** Werk een incidentanalyse uit: Sinds 07/06/2026 14:30 kan de app in staging de database niet bereiken. Lever hypotheses, meetplan, root cause en preventie.

**H3.** Schrijf een technische nota over bind-adressen zoals 127.0.0.1, 0.0.0.0 en specifieke interface-IP’s. Geef risico’s en best practices.

**H4.** Onderzoek hoe reverse proxies en load balancers het zicht op originele clientpoort en bronadres beïnvloeden. Leg impact op logging en debugging uit.

**H5.** Ontwerp een minimale zero trust benadering voor interne services met focus op poorten, segmentatie en least privilege.

**H6.** Vergelijk drie strategieën om een lokale service extern bereikbaar te maken: port forwarding, vpn en tunnelservice. Evalueer veiligheid, beheer en complexiteit.

**H7.** Analyseer een scenario met intermitterende time-outs naar de database. Maak onderscheid tussen netwerkproblemen, poolproblemen en queryproblemen.

**H8.** Schrijf een korte gids voor developers over hoe je incidentcommunicatie doet tijdens een netwerkstoring: wat meld je, wanneer, en met welke technische bewijsstukken.

---

### At Home

**AT1. Eigen diagnosekit bouwen** meerdere uren

Stel je persoonlijke terminalkit samen voor netwerkdebugging. Maak een document met je standaardcommando’s, interpretatie van resultaten en een vaste diagnosevolgorde. Test de kit op minstens twee realistische foutscenario’s.

**AT2. Thuislab met gecontroleerde fouten** meerdere uren over meerdere sessies

Bouw een kleine labopstelling met minstens twee services die over het netwerk praten. Introduceer bewust drie fouten zoals foute poort, firewallblok en verkeerde hostnaam. Documenteer per fout hoe je die detecteert en oplost.

**AT3. Bereikbaarheid en beveiliging evalueren** één dag

Kies één service in je testomgeving en evalueer of die van buitenaf bereikbaar moet zijn. Werk een concreet voorstel uit met poortbeleid, firewallregels, logging en herstelplan bij misbruik.
