# Päeva Pikkuse Arvutaja (CGI ülesanne 2020)
#### Autor: Alex Viil

## Rakendusest
Kirjeldav tekst

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
lihtsamaid valemeid, aga need töötasid oletusel, et maa on perfektne kera (mõistagi,
tegelikult ei ole perfektne, kuid on keralaadne küll), ning nendega oli oht kindlates 
oludes, et annab väga vale vastuse.  
Internetis oli aga mitu vägagi vabade litsentsidega valmis tehtud Javascripti lahendust 
olemas. Valisin kõige kergema neist ning veendusin, et annab väga lähedasi tulemusi 
võrreldes täpsete allikatega.  

Kellaaegadega toimetamine (UTC versus kohalik) ei olnud liialt keeruline aga samas ka
mitte lihtne. Leidsin ka selleks kergekaalulise Javascripti lahenduse vaba litsentsiga, 
mis koordinaatide alusel annab ajatsooni kätte kujul, mis sisseehitatud Date'ile korda 
läheb.

### Etapp 2
***Ajakulu: 2 tundi***

Teine etapp tundus esialgu raske, kuid osutus üllatusväärselt kergeks. Algselt pidin 
otsustama, millist teeki kasutada. Lisalugemise alt paistis OpenLayers kohe silma, kuna
olin sellest varem kuulnud, kuid igaks juhuks vaatasin ka Leafletjs-i üle. Leafletjs 
tundus palju lihtsama ja kergekaalulisema ülesehitusega olevat, seega otsustasin tema
kasuks. 

Leafletjs-i teegil oli ka väga põhjalik kuid samas lühike dokumentatsioon, mis 
osutus väga suureks abiks ning aitas kiiresti etapi läbida.

### Etapp 3
***Ajakulu: 3 tundi***  

Kolmanda etapi raskust oli esialgu raske hinnata, kuna pole varem veebilehel graafidega 
mänginud. Googeldades avastasin ruttu, et on olemas Chart.js. Tundus töökindel ja mugav 
ning näited hoomatavad. Teise variante ei uurinud, kuna jäin sellega kiiresti rahule. 
Natuke oli ka katsetamist ja eksimist - esialgu ei teadnud, et uue graafi joonistamisel
tuleks vana kustutada. Selle puudusel tegi graaf veidraid asju.  

Natuke rohkem tuli seekord muretseda kasutaja sisendite pärast, seega sai ka sellele 
rohkem tähelepanu pööratud. Ajakulukaks kujunes koodi ümbertöötlus, et vältida
duplikaatkoodi (arvutused kaardi juures versus graafi jaoks).  

Otseselt miski siin tohutult suurt raskust ei valmistanud.  

### Etapp 4
***Ajakulu: x tund(i)***  

todo