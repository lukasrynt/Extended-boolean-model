# Instalační příručka - VWM - Extended Boolean Model

## Klonování repozitáře z GitLabu

Jako první musíme naklonovat repozitář z GitLabu. Pro to použijeme první příkaz `git init`, který inicializuje git lokálně v našem adresáři.
Dále použijeme příkaz `git clone https://gitlab.fit.cvut.cz/ryntluka/vwm---extended-boolean-model.git`, který naklonuje existující repozitář.

## Instalace nodejs
Dále musíme nainstalovat nodejs. Pokud máme nodejs již nainstalovaný, můžeme tuto část přeskočit. Pro instalaci použijeme příkaz `sudo apt install nodejs`. Nodejs se dá také stáhnout přes web na adrese `https://nodejs.org/en/download/ `, v tomto případě by se také mělo stáhnout npm.

## Instalace npm
Pokud jsme nainstalovali nodejs přes příkaz, nemáme nainstalovaný npm. Por instalaci dáme `sudo apt install npm`. Pokud jsme nodejs stahovali z webu, npm by měl obsahovat, pokud neobsahuje, stáhneme ho.

## Instalace ostatních balíčků ve složce server
Dále musíme nainstalovat balíčky, které jsou potřebné ke spuštění serveru. První se přepneme do složky server, kde použijeme k tomu příkaz `npm install`, který spustí install skript. Tím se nám stáhne express a nodemon.

## Instalace ostatních balíčků ve složce client
Postup je stejný jako ve složce server, akorát se přepneme do složky client. Spustíme příkaz `npm install`, který spustí install skript.

# Spuštění serveru
Ke spuštění serveru se nejdříve musíme přepnout do složky server, kde jsme již použili příkaz na nainstalování potřebných balíčků. Pro spuštění samotného serveru pustíme příkaz `npm start`, který spustí server.

# Spuštění klienta
Opět stejný postup, akorát se přepneme do složky client. Opět pustíme příkaz `npm start`, který spustí klienta. Následně by se nám měl spustit prohlížeč se zadanou url. Pokud se prohlížeč nespustí, spustíme ho ručně a zadáme do url `http://localhost:3000/`.
