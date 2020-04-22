# Päeva Pikkuse Arvutaja (CGI ülesanne 2020)
#### Autor: Alex Viil

## Rakendusest
Antud veebirakendus on lihtne HTML+CSS+Javascript lahendus, mis kaasab mitmeid erinevaid
teeke (JQuery, Leafletjs, Chartjs, Bootstrap 4, SunCalc, tz-lookup).  
Rakendus võimaldab:
* Kaardilt asukoht valida kas käsitsi või koordinaate sisestades.
* Valitud asukoha puhul kuupäeva alusel välja arvutada **päikesetõus, -loojang ja päeva
pikkus.** Kuvatakse nii kohalikus ajavõõndis kui ka UTC-s.
* Valitud asukoha ja kuupäevade vahemiku puhul graaf luua päeva pikkuse kohta.  

Graafi juures kuupäevade valikul piiranguid ei ole, s.t. saate valida kuitahes suure
vahemiku. Ajaline kulu oleneb brauserist ja seadme võimekusest.

## Käivitus
Kuna tegu on eraldi Javascripti käituskeskonnata veebirakendusega, siis käivitamiseks 
piisab ***index.html*** faili avamisest brauseris. Ei pruugi vanemates brauserites 
(Internet Explorer 8 ja vanem, jms) täielikult töötada.  
Võimalik on ka interneti kaudu otse proovida, ilma et peaks projekti kaustas sorama.  
[Proovige rakendust otse veebis, vajutades siia!](http://kodu.ut.ee/~alexviil/)


## Tööks kulunud aeg, raskused

### Etapp 1
***Ajakulu: 3 tundi***  
  
Väga lihtne oli nullist luua toores ja lihtne HTML+CSS+Javascript rakendus, mis
võtaks kasutajalt sisendi ja sellega midagi teeks (Kahjuks pole nii palju aega 
vaheeksamite ja kodutööde kõrvalt, et node.js meelde tuletada, õnneks väike rakendus
ka).  

Keeruliseks osutus aga päikesetõusu ja -loojangu arvutamine koordinaatide alusel. 
Selleks leidus valemeid mitmest allikast, kuid need olid pikad ja veatuses oli raske
veenduda (ja lisaks ka suur ajaline kulu, et need suured valemid kirja panna). Oli ka
lihtsamaid valemeid, aga need töötasid oletusel, et maa on perfektne kera (tegelikult
ei ole perfektne, kuid on keralaadne küll), ning nendega oli oht kindlates 
oludes, et annab väga vale vastuse.  
Internetis oli aga mitu vägagi vabade litsentsidega valmis tehtud Javascripti lahendust 
olemas. Valisin kõige kergekaalulisema neist ning veendusin, et annab väga lähedasi
tulemusi võrreldes täpsete allikatega.  

Kellaaegadega toimetamine (UTC versus kohalik) ei olnud liialt keeruline aga samas ka
mitte lihtne. Leidsin ka selleks kergekaalulise Javascripti lahenduse vaba litsentsiga, 
mis koordinaatide alusel annab ajatsooni kätte kujul, mis sisseehitatud Date'ile korda 
läheb. Otsustasin mõlemad korraga kasutajale näidata, sest usun, et mõlemad on huvitavad.

### Etapp 2
***Ajakulu: 2 tundi***

Teine etapp tundus esialgu raske, kuid osutus üllatusväärselt kergeks. Algselt pidin 
otsustama, millist teeki kasutada. Lisalugemise alt paistis OpenLayers kohe silma, kuna
olin sellest varem kuulnud, kuid igaks juhuks vaatasin ka Leafletjs-i üle. Leafletjs 
tundus palju lihtsama ja kergekaalulisem olevat, seega otsustasin tema kasuks. 

Leafletjs-i teegil on ka väga põhjalik kuid samas lühike dokumentatsioon, mis 
osutus väga suureks abiks ning aitas kiiresti etapi läbida.

### Etapp 3
***Ajakulu: 3 tundi***  

Kolmanda etapi raskust oli esialgu raske hinnata, kuna pole varem veebilehel graafidega 
mänginud. Googeldades avastasin ruttu, et on olemas Chart.js. Tundus töökindel ja mugav 
ning näited hoomatavad. Teisi variante ei uurinud, kuna jäin sellega kiiresti rahule. 
Natuke oli ka katsetamist ja eksimist - esialgu ei teadnud, et uue graafi joonistamisel
tuleks vana kustutada. Selle puudusel tegi graaf veidraid asju.  

Natuke rohkem tuli seekord muretseda kasutaja sisendite pärast, seega sai ka sellele 
rohkem tähelepanu pööratud. Ajakulukaks kujunes koodi ümbertöötlus, et vältida
duplikaatkoodi (arvutused kaardi juures versus graafi jaoks).  

Otseselt miski siin tohutult suurt raskust ei valmistanud.  

### Etapp 4
***Ajakulu: 3 tundi***  

Neljanda etapina otsustasin lehe teha ilusaks nii lauaarvutil kui mobiilis. Otsustasin 
selleks kasutada Bootstrap 4-ja, kuigi sellega varajasem kogemus puudus. Peamiselt olid 
abiks allolevad lingid.  
https://getbootstrap.com/  
https://www.w3schools.com/bootstrap4/default.asp  

Peamiselt katseeksitus meetodil sai leht ilusaks tehtud. Raskusteks oli, mõistagi, saada 
asjad ekraanile sellisel kujul, nagu ette kujutasin. Päris raske oli saada sama suured 
ruudukesed üksteise kõrvale ja veel nii, et asi hästi skaleeruks. Alumine rida, kus saab 
üle perioodi päevapikkust arvutada, jäi siiski natuke kehvasti skaleeruv aga visuaalselt 
on kasutaja jaoks aru saada, mis toimub.