# Module 6: Waarom werkt het op mijn laptop maar niet op de server?

---

## 6.1 Lokaal vs server: wat is het verschil?

Je app draait perfect lokaal. Je test nog eens, alles groen. Je deployt. En dan: niets. Of erger — sommige dingen werken, andere niet. Welkom bij het meest tijdrovende type bug in de professionele praktijk.

Het fundamentele verschil tussen je laptop en een server is omgeving. Jij hebt een specifieke versie van Node, Python of PHP. Jij hebt bepaalde omgevingsvariabelen, specifieke permissies op bestanden, een lokale database met testdata. De server heeft dat allemaal anders, of helemaal niet.

Geen van die verschillen is per se een bug in je code. Maar allemaal samen zorgen ze ervoor dat dezelfde code zich anders gedraagt.

Dit betekent voor jou: behandel "werkt lokaal" niet als bewijs dat iets goed is. Het is bewijs dat het werkt in jóuw omgeving.

### Test jezelf

**Vraag 1.** Wat is de meest waarschijnlijke oorzaak als code lokaal werkt maar op de server niet?

a) Een verschil in omgevingsvariabelen, versies of configuratie tussen de twee omgevingen
b) De server heeft een tragere processor
c) De code bevat een syntax-fout die lokaal anders gelezen wordt
d) Het netwerk is te traag om de app te starten

**Vraag 2.** Noem twee concrete omgevingsverschillen die kunnen leiden tot een deploys-maar-werkt-niet situatie.

**Vraag 3.** Hoe documenteer je je lokale omgeving zodat anderen die kunnen reproduceren?

---

## 6.2 Client en server: een verhouding uitgelegd

Je werkt elke dag met clients en servers zonder er bij stil te staan. De browser is de client. De webserver is de server. De frontend is de client. De database is de server van de backend.

Een **client** (cliënt) vraagt iets. Een **server** (server) geeft antwoord. Die rolverdeling is consistent, maar de rollen zijn relatief. Jouw backend is de server voor de frontend, maar tegelijk de client van de database.

Dat onderscheid bepaalt wie verantwoordelijk is voor wat: de client stuurt correcte requests, de server valideert en verwerkt. Nooit vertrouwen wat van de client komt — dat is een basisprincipe van beveiligde software.

Dit betekent voor jou: ken de positie van je component in de keten. Als client schrijf je correcte requests. Als server valideer je alles wat binnenkomt.

### Test jezelf

**Vraag 1.** In een typische webapplicatie, wat is de relatie tussen frontend, backend en database?

a) Frontend is client van de backend; backend is tegelijk server voor de frontend en client van de database
b) Frontend en backend zijn beide servers, database is de client
c) Database is de centrale server voor zowel frontend als backend direct
d) De rollen zijn altijd vast en kunnen niet wisselen afhankelijk van context

**Vraag 2.** Waarom mag je als server nooit vertrouwen op data die van de client komt zonder validatie?

**Vraag 3.** Geef een concreet voorbeeld van een situatie waarbij dezelfde component zowel client als server is.

---

## 6.3 Wat gebeurt er als je iets deployt?

Deployen is meer dan een bestand kopiëren. Het is de overgang van jouw gecontroleerde omgeving naar een productieomgeving met echte gebruikers, andere hardware en soms andere software.

Bij een typische **deployment** (uitrol) worden bronbestanden gecompileerd of gebundeld, afhankelijkheden geïnstalleerd, configuratie geladen vanuit omgevingsvariabelen, databasemigraties uitgevoerd en de service geherstart. Elke stap kan mislukken.

Goede deployments zijn reproduceerbaar en traceerbaar. Je weet welke versie er draait, wanneer die deployed is en wie dat gedaan heeft.

Dit betekent voor jou: weet wat jouw deployment doet. Blinde deployments naar productie zijn niet dapper, ze zijn riskant.

### Test jezelf

**Vraag 1.** Welke stap mag tijdens een deployment nooit overgeslagen worden?

a) Databasemigraties uitvoeren vóór de nieuwe code actief wordt
b) De repository publiek zetten
c) Alle logs wissen vóór de start
d) De server handmatig herstarten zonder checklist

**Vraag 2.** Wat is het risico van een deployment waarbij je niet bijhoudt welke versie er actief is?

**Vraag 3.** Beschrijf in vier stappen een minimale maar veilige deployment workflow.

---

## 6.4 Omgevingsverschillen: het "works on my machine"-probleem

"Bij mij werkt het" is misschien de meest gevreesde zin in de softwareontwikkeling. En zelden is het leugen — het werkt écht lokaal. Het probleem zit in de aanname dat lokaal en productie hetzelfde zijn.

Veelvoorkomende valkuilen: hardgecodeerde paden of localhost-URLs in code, missing environment variables, anders geconfigureerde databases, library-versies die net iets anders gedragen, of een bestandssysteem met andere hoofdlettergevoeligheid.

De structurele oplossing is het zo klein mogelijk maken van het verschil tussen omgevingen. Containers helpen daarbij, maar zijn geen magische oplossing als de rest van de configuratie niet klopt.

Dit betekent voor jou: vermijd aannames over de omgeving in je code. Gebruik configuratie via omgevingsvariabelen, `.env`-bestanden en expliciete versies in je dependencies.

### Test jezelf

**Vraag 1.** Wat is de beste manier om omgevingsspecifieke configuratie te beheren?

a) Via omgevingsvariabelen of .env-bestanden, niet hardcoded in de broncode
b) Via commentaar in de code dat je voor productie aanpast
c) Via een aparte branch voor elk omgeving
d) Via een README die collega's handmatig volgen

**Vraag 2.** Waarom is hoofdlettergevoeligheid van het bestandssysteem een veelgemaakte deployment-valkuil?

**Vraag 3.** Geef twee concrete voorbeelden van hardcoded aannames die problemen geven op een productieserver.

---

## 6.5 ping: leeft de server nog?

De snelste vraag die je kan stellen aan een server is: ben je er nog? En het snelste antwoord krijg je via `ping`.

`ping` stuurt een ICMP-pakketje naar een IP-adres of hostnaam en meet of er een antwoord terugkomt en hoe lang dat duurt. Een reactie betekent: de machine leeft en het netwerk is bereikbaar. Geen reactie betekent niet automatisch dat de server down is — ICMP kan ook geblokkeerd zijn door een firewall.

Na ping volgt eventueel `curl` of een HTTP-check om te zien of de service zelf ook antwoordt.

Dit betekent voor jou: ping is de eerste check bij een incident, maar nooit de enige. Een stille server kan zowel dood zijn als gewoon afgeschermd.

### Test jezelf

**Vraag 1.** Wat toont een succesvolle ping-respons aan?

a) De machine is bereikbaar via het netwerk en ICMP is niet geblokkeerd
b) De webserver is actief en antwoordt HTTP-requests
c) De database is bereikbaar en queries werken
d) De TLS-certificaten zijn geldig

**Vraag 2.** Waarom is een mislukte ping geen bewijs dat een server volledig offline is?

**Vraag 3.** Welke tool gebruik je naast ping om te controleren of een webservice echt antwoordt?

---

## 6.6 Veelgemaakte deployment-fouten en hun oplossing

Na honderden deployments blijven dezelfde fouten opduiken. Niet omdat developers dom zijn, maar omdat het proces complex is en details gemakkelijk gemist worden.

Klassiekers: vergeten migrations draaien, verkeerde environment variables meegeven, een poort die al bezet is, een service die niet herstart na de update, een stale build die de oude code serveert, of certificaten die vlak na deployment verlopen. Ook: code die afhankelijk is van een lokaal bestand dat niet op de server staat.

De remedie is consequentie: een vaste deploymentchecklist, geautomatiseerde tests vóór deployment en een rollback-strategie als het fout loopt.

Dit betekent voor jou: deploy nooit op vrijdagmiddag zonder plan B, en houd je altijd aan je checklist — ook als het "een kleine aanpassing" lijkt.

### Test jezelf

**Vraag 1.** Wat is de meest risicovolle deployment die je kan doen?

a) Een deployment zonder rollback-plan, vlak voor een weekend of piekperiode
b) Een deployment van een nieuw kleurenschema
c) Een deployment met extra logging
d) Een deployment waarbij alleen CSS aangepast is

**Vraag 2.** Wat is een rollback en wanneer voer je die uit?

**Vraag 3.** Noem drie punten op een deployment checklist die elke developer zou moeten hanteren.

---

## Oefeningen Module 6

### Easy

**E1.** Voer `ping` uit naar een bekende server en naar een onbestaand adres. Beschrijf het verschil in output.

**E2.** Maak een lijst van drie omgevingsvariabelen die jouw meest recente project gebruikt. Leg per variabele uit waarom die niet in de code hardcoded hoort.

**E3.** Beschrijf het verschil tussen een ontwikkelomgeving, een testomgeving en een productieomgeving in vijf zinnen.

**E4.** Zoek in een bestaand project alle plaatsen waar localhost of een hardcoded IP-adres gebruikt wordt. Noteer ze.

**E5.** Schrijf een minimale deployment checklist van acht stappen voor een eenvoudige webapplicatie.

**E6.** Leg het verschil uit tussen `curl http://example.com` en `ping example.com` als diagnosetools.

**E7.** Wat is een rollback? Beschrijf wanneer je die uitvoert en hoe je dat doet in een eenvoudige setup.

**E8.** Zoek op wat ICMP is en waarom ping er gebruik van maakt. Leg uit in drie zinnen.

---

### Medium

**M1.** Migreer een lokale app naar een cloud VM of VPS. Documenteer elke stap, elke fout en hoe je die oploste.

**M2.** Schrijf een deployment script voor een eenvoudige Node.js of Python app dat automatisch afhankelijkheden installeert, migreert en herstart.

**M3.** Analyseer een case: app crasht pas de tweede dag na deployment. Geef drie hypotheses en bijhorende diagnosetools.

**M4.** Vergelijk handmatige deployment met een CI/CD-pipeline op vlak van reproduceerbaarheid, snelheid en foutgevoeligheid.

**M5.** Maak een overzicht van omgevingsverschillen tussen jouw lokale machine en een typische Linux-productieserver.

**M6.** Zet een eenvoudige health check endpoint in voor je app. Beschrijf wat die check doet en hoe je die monitort.

**M7.** Simuleer een deployment die mislukt door een ontbrekende omgevingsvariabele. Documenteer symptoom, diagnose en fix.

**M8.** Onderzoek hoe je de actieve versie van een draaiende app herkent zonder je broncode te openen.

**M9.** Schrijf een kort post-mortem voor een fictieve deployment-outage van 47 minuten op 07/06/2026. Structuur: tijdlijn, oorzaak, impact, fix, preventie.

**M10.** Maak een vergelijking van twee deployment-strategieën: blue-green en rolling update. Geef use cases voor elk.

---

### Hard

**H1.** Ontwerp een volledige deployment workflow voor een Belgische webshop met zero-downtime vereiste. Beschrijf elke fase inclusief rollback.

**H2.** Bouw een minimale CI/CD-pipeline die automatisch test en deployt bij een push naar main. Documenteer keuzes en configuratie.

**H3.** Analyseer een productie-incident waarbij een deployment een databasemigratie ongedaan kon maken. Wat is de technische strategie?

**H4.** Schrijf een beveiligingsaudit voor een deployment-pipeline: wat kan er lekken, wie heeft toegang en hoe minimaliseer je risico?

**H5.** Ontwerp een monitoringstrategie voor een productieapp: metrics, alerting en logging van deployment-events.

**H6.** Analyseer hoe omgevingsverschillen in een team van vijf developers leiden tot "works on my machine" bugs. Geef een concrete aanpak om die te elimineren.

**H7.** Schrijf een technische nota over secrets management: hoe sla je gevoelige omgevingsvariabelen op en hoe zorg je dat ze niet in versiecontrole terechtkomen?

**H8.** Ontwerp een noodplan voor een productie-outage die door een foute deployment is veroorzaakt. Beschrijf communicatie, technische stappen en evaluatie.

---

### At Home

**AT1. Deployment van nul tot productie** meerdere uren

Bouw een eenvoudige webapplicatie lokaal en zet die live op een VPS of cloudplatform. Documenteer elke stap inclusief problemen, omgevingsconfiguratie en hoe je valideert dat alles werkt.

**AT2. Incident simulatie** meerdere uren over meerdere sessies

Introduceer bewust drie deployment-problemen in een testomgeving: missing env var, mislukte migratie en foute port binding. Documenteer per probleem hoe je het detecteert, diagnosticeert en oplost.

**AT3. Pipeline bouwen** één dag

Stel een automatische test-en-deployment pipeline in met een gratis CI-tool naar keuze. Zorg dat een push naar main automatisch getest en gedeployed wordt. Documenteer je configuratie en wat je geleerd hebt.
