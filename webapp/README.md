# Opportuniteitskost & FIRE Calculator

Een moderne, snelle financiële calculator webapp gebouwd met React + TypeScript + Vite.

## 🚀 Snel starten

```bash
cd webapp
npm install
npm run dev
```

Open http://localhost:5173 in je browser.

## 📊 Functionaliteit

### 1. Opportuniteitskost Calculator

Berekent het verschil in rendement tussen direct betalen en lenen + beleggen.

**Input parameters:**
- Kredietbedrag (€)
- Jaarlijkse rente (%)
- Looptijd (jaren)
- Instapkosten belegging (%)

**Vergelijkt twee scenario's:**

1. **Klassiek Krediet**: Maandelijks kapitaal + rente aflossen, startkapitaal beleggen
2. **Bulletkrediet**: Alleen rente betalen, kapitaal pas aan het einde aflossen. Het verschil in maandelijkse kosten wordt ook belegd.

**Output per scenario (3 rendementsscenario's: 2%, 5%, 7%):**
- Eindkapitaal
- Behaald rendement
- Netto resultaat (rendement - betaalde rente)

### 2. FIRE Calculator

Berekent wanneer je financieel onafhankelijk kunt worden.

**Input parameters:**
- Startkapitaal (€)
- Jaarlijks verwacht rendement (%)
- Beleggingshorizon (jaren)
- Maandelijkse bijdrage (€)

**Output:**
- Eindkapitaal
- Geïnvesteerd kapitaal vs behaald rendement
- Maandelijks inkomen @ 3% withdrawal rate
- Maandelijks inkomen gecorrigeerd voor 2% inflatie

## 🛠 Tech Stack

- **Vite** - Razendsnelle build tool
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **CSS Modules** - Scoped styling

## 📁 Projectstructuur

```
webapp/
├── src/
│   ├── components/
│   │   ├── InputField.tsx          # Herbruikbare input component
│   │   ├── ResultCard.tsx          # Resultaat display components
│   │   ├── OpportuniteitskostCalculator.tsx
│   │   ├── FIRECalculator.tsx
│   │   └── *.module.css            # Component styles
│   ├── utils/
│   │   └── calculations.ts         # Alle financiële formules
│   ├── App.tsx                     # Hoofd app met navigatie
│   ├── App.module.css
│   ├── index.css                   # Globale styles & CSS variabelen
│   └── main.tsx
├── index.html
└── package.json
```

## 🔢 Formules

De formules zijn geëxtraheerd uit `Opportuniteitskost - FIRE calculator.xlsx` met behulp van het script in `tools/extract_excel.py`.

### Maandelijkse aflossing (PMT formule)
```
M = P × (r/12) × (1 + r/12)^n / ((1 + r/12)^n - 1)
```
Waar: P = hoofdsom, r = jaarlijkse rente, n = aantal maanden

### Compound growth
```
FV = PV × (1 + r)^t
```
Waar: FV = future value, PV = present value, r = jaarlijks rendement, t = jaren

### Future Value of Contributions
```
FV = C × ((1 + r/12)^n - 1) / (r/12)
```
Waar: C = maandelijkse bijdrage, r = jaarlijks rendement, n = aantal maanden

### FIRE Withdrawal Rate
```
Maandelijks inkomen = Eindkapitaal × 0.03 / 12 × 0.9868
```
De factor 0.9868 houdt rekening met 1.32% beursbelasting.

## 🎨 Design

- Donker kleurenschema met gouden accenten
- Serif + Sans-serif typografie (Instrument Serif & DM Sans)
- Responsive design voor mobiel en desktop
- Subtiele animaties en hover effecten

## 📝 Development

```bash
# Start dev server
npm run dev

# Build voor productie
npm run build

# Preview productie build
npm run preview
```
