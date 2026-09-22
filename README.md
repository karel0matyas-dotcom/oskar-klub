[README.md](https://github.com/user-attachments/files/32509643/README.md)
# Oskar Klub — web

Statické webové stránky (HTML/CSS/JS, bez buildu) — připravené k nahrání na GitHub Pages.

## Struktura

```
index.html       Domů
o-nas.html        O nás
kalendar.html     Kalendář akcí (interaktivní kalendář + agenda)
menu.html         Menu (přepínání kategorií)
galerie.html      Fotogalerie (filtrování + lightbox)
kontakt.html      Kontakt (mapa + formulář)
rezervace.html    Rezervace stolu (formulář s validací)
css/style.css     Styly, barvy zlatá/černá
js/main.js        Veškerá interaktivita
```

## Nahrání na GitHub Pages

1. Vytvořte na GitHubu nové repository, např. `oskar-klub-web`.
2. Nahrajte do něj obsah této složky (přes web rozhraní "Add file → Upload files", nebo přes git):
   ```
   git init
   git add .
   git commit -m "Web Oskar Klub"
   git branch -M main
   git remote add origin https://github.com/VASE-JMENO/oskar-klub-web.git
   git push -u origin main
   ```
3. V repository přejděte na **Settings → Pages**.
4. V sekci "Build and deployment" vyberte **Deploy from a branch**, branch `main`, složku `/ (root)`.
5. Uložte — GitHub za chvíli vygeneruje adresu typu `https://vase-jmeno.github.io/oskar-klub-web/`.

## Co si přizpůsobit

- **Fotografie** — v `galerie.html`, `index.html`, `o-nas.html` a `menu.html`/`kontakt.html` jsou místo fotek dekorativní zlaté linkové grafiky (SVG). Nahraďte je vlastními fotkami: `<img src="images/nazev.jpg" alt="...">` místo `<svg>...</svg>`.
- **Akce v kalendáři** — v `kalendar.html` na konci souboru je pole `OSKAR_EVENTS` s ukázkovými akcemi. Upravte data, časy a popisy, případně je napojte na vlastní systém.
- **Mapa** — v `kontakt.html` je vložená mapa OpenStreetMap s orientačními souřadnicemi. Nahraďte `bbox` a `marker` souřadnicemi vašeho klubu (souřadnice najdete třeba na openstreetmap.org export).
- **Rezervační a kontaktní formulář** — formuláře nyní jen ověřují vyplnění a zobrazí potvrzení v prohlížeči (žádná data se nikam neodesílají — GitHub Pages neumí zpracovat backend). Pro reálné odesílání e-mailů doporučujeme napojit službu jako Formspree, Getform nebo EmailJS — obě formuláře (`reservationForm`, `contactForm`) mají `id`, na které lze snadno navázat.
- **Kontaktní údaje** — adresa, telefon a e-mail jsou v patičce každé stránky a na stránce Kontakt — nahraďte reálnými údaji.

## Barvy

| Účel | Hex |
|---|---|
| Pozadí | `#0a0806` |
| Karty / plochy | `#17130f` |
| Linky / okraje | `#2a231b` |
| Zlatá (akcent) | `#c9a227` |
| Zlatá světlá | `#e8c468` |
| Text | `#efe6d0` |
