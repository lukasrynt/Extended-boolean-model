# VWM - Extended Boolean Model

## ZADÁNÍ
Cílem projektu je implementace rozšířeného boolovského modelu ukládání dat (tj. poreprocessing a
indexování) spolu s možností dotazování z GUI.
### VSTUP
Boolovský dotaz.
### VÝSTUP
Seznam databázových dokumentů odpovídající dotazu v klesajícím pořadí podobnosti.

## INFORMACE/POTŘEBNÉ ZNALOSTI
Boolovský model je jeden ze způsobů jak prohledávat kolekci dokumentů s cílem identifikace dokumentů
obsahující termy odpovídající dotazu. Dotaz je tvořen boolovským výrazem, který se skládá z tzv. termů (slov)
spojených logickými spojkami (AND, OR, NOT).
Dotaz je vyhodnocován oproti kolekci dokumentů, tj. každý dokument lze chápat jako objekt databáze.
V případě (rozšířeného) boolovského modelu projde každý dokument nejdříve fází preprocesingu, kdy jsou
z dokumentu odstraněna nevýznamová slova (tj. slova, která se nesou málo informace, jako např. spojky a
předložky) a významová slova jsou “stemmovány” (jednodušší proces) nebo “lematizovány” (sofistikovanější
proces) za účelem získání základů slov.
Po preprocesingu máme tedy k dispozici kolekci slov, kterou je třeba uložit takovým způsobem, aby v ní šlo
efektivně vyhledávat. U boolovského modelu je každý dokument uložen jako binární vektor, čímž dostáváme
tzv. term-by-document matici, kde na i-tém řádku v j-tém sloupci je 1, pávě tehdy pokud je term i obsažen
v dokumentu j. Takový přístup nedokáže rozlišit, jak moc daný term vystihuje dokument, v kterém se nachází.
Nelze říci, zda se term i vyskytuje v dokumentu pouze okrajově, nebo je celý dokument právě o tomto termu.
Z toho důvodu jsou v term-by-document matici reálné hodnoty v rozmezí 0 až 1, definující váhu (důležitost)
termu pro dokument. Určování vah je typicky založeno na frekvenci výskytu termu v dokumentu a výskytu
termu přes celou kolekci. Nejznámější schéma založené na tomto principu se nazývá tf-idf (term frequency -
inverse document frequency) schéma. Každý dokument je pak možné popsat n-dimenionálním vektorem (n je
velikost slovníku) a tedy lze chápat jako bod v n-dimenzionálním prostoru.
Stejně jako dokument lze reprezentovat i dotaz. Podle boolovského výrazu reprezentujícím dotaz lze bod
dosadit na kraj prostoru (souřadnice dotazu můžou obsahovat pouze 1 nebo 0, protože jde stále o boolovské
dotazování). Definujeme-li pak nějakou vzdálenost mezi dvěma body v n-dimenzionálním prostoru (u
boolovského modelu je to euklidovská (L2) nebo obecně Lp metrika), lze podobnost dokumentů chápat jako
převrácenou vzdálenost bodů, které je reprezentují.
Boolovský model se tedy skládá z následujících částí:
1.  Extrakce a preprocesing termů z dokumentů.
2.  Efektivní uložení dokumentů pomocí invertovaného seznamu.
3.  Vyhodnocovací/dotazovací modul využívající strukturu z předchozího kroku. 
    
### STAVBA APLIKACE
Aplikace by měla obsahovat:
-   Extrakce termů. 
-   Identifikace nevýznamových slov. 
-   Stemming/lematizace. 
-   Výpočet vah termů. 
-   Implementace invertovaného seznamu. 
-   Parsování dotazu. 
-   Vyhodnocení dotazu. 
-   Webový interface (zadání dotazu a vizualizace výsledku).
   
### POZNÁMKY K ŘEŠENÍ
   V rámci projektu je třeba implementovat jak invertovaný seznam, tak sekvenční průchod, tj. procházení kolekce
   dokumentů. Sekvenční průchod je pak možné použít k porovnání výsledků vyhledávání vzhledem k
   boolovskému modelu.
   Parser dotazu by měl umět vyhodnocovat libovolné boolovské dotazy, tj. včetně uzávorkování.
   Lze využít knihovny na parsování dokumentů, příp. preprocessing. 
   
### DATA
   Datová sada by měla obsahovat alespoň tolik dokumentů, aby bylo možné pozorovat výhody použití
   boolovského modelu oproti sekvenčnímu průchodu. Zdroj dat je libovolný – např. offline verze nějakého
   webového serveru (novinové články, …).
   
### EXPERIMENTY
   V tomto projektu lze mimo jiné provádět srovnání boolovského modelu se sekvenčním průchodem s ohledem
   na čas vykonání dotazu.
   
### ZDROJE
-   [Přednáška Vyhledávání textu - Booleovské modely. Implementace.](https://moodle-vyuka.cvut.cz/pluginfile.php/383628/mod_page/content/23/support/lecture02.pdf)
-   [Přednáška Vyhledávání textu - Vektorové modely. Implementace.](https://moodle-vyuka.cvut.cz/pluginfile.php/383603/course/section/57068/BIVWM_lecture03.pdf)
-   Jaroslav Pokorný, Václav Snášel, Dušan Húsek. Dokumentografické Informační Systémy. Karolinum, 1998