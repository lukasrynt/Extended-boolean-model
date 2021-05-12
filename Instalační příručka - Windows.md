# Instalační příručka - VWM - Extended Boolean Model

## Klonování repozitáře z GitLabu
Jako první musíme naklonovat repozitář z GitLabu. Pro to použijeme první příkaz `git init`, který inicializuje git lokálně v našem adresáři.
Dále použijeme příkaz `git clone https://gitlab.fit.cvut.cz/ryntluka/vwm---extended-boolean-model.git`, který naklonuje existující repozitář.

## Odzipování balíčku
V případě, že nechcete klonovat repozitář, stačí si rozbalit .zip soubor.

## Struktura aplikace
Aplikace se dělí na 2 části - klient a server. Obě části budeme spouštět odděleně. Server se nachází ve složce server a klient v client. Tedy pro instlaci balíčků a spuštění samotného server musíme přejít do složky server. Obdobně pro klienta.

## Instalace nodejs
Dále musíme nainstalovat nodejs. Pokud máme nodejs již nainstalovaný, můžeme tuto část přeskočit. Pro instalaci přejdeme na adresu `https://nodejs.org/en/download/ `, kde nodejs stáhneme. V tomto případě by se také mělo stáhnout npm

## Instalace ostatních balíčků ve složce server
Dále musíme nainstalovat balíčky, které jsou potřebné ke spuštění serveru. První se přepneme do složky server, kde použijeme k tomu příkaz `npm install`, který spustí install skript. Tím se nám stáhne express a nodemon.

## Instalace ostatních balíčků ve složce client
Postup je stejný jako ve složce server, akorát se přepneme do složky client. Spustíme příkaz `npm install`, který spustí install skript.

### Spuštění serveru
Ke spuštění serveru se nejdříve musíme přepnout do složky server, kde jsme již použili příkaz na nainstalování potřebných balíčků. Pro spuštění samotného serveru pustíme příkaz `npm start`, který spustí server.

### Spuštění klienta
Opět stejný postup, akorát se přepneme do složky client. Opět pustíme příkaz `npm start`, který spustí klienta. Následně by se nám měl spustit prohlížeč se zadanou url. Pokud se prohlížeč nespustí, spustíme ho ručně a zadáme do url `http://localhost:3000/`.

## Alternativní spuštění klienta
Pro klienta jsme vytvořili spustitelný soubor, který se nachází ve složce klient. Díky tomuto souboru můžeme obejít instalování balíčků ve složce server a nemusíme spouštět příkaz `npm start`, pouze stačí spustit spustitelné soubory. Spustitelné soubory jsou pro platformy Windows, Linux i macOS.

Linux - `./extended-boolean-model-linux`
Windows - `extended-boolean-model-linux.exe`

 Pro klienta tato možnost nešla naimplementovat, tedy musíme ručně nainstalovat balíčky ve složce client a také ho musíme spustit.