# 💻 INSTALARE PE WINDOWS - Ghid Complet

## 📥 PASUL 1: Descarcă Proiectul

### Opțiunea A: Descarcă manual din interfață
1. Scroll în sus în chat
2. Vei vedea fișierele proiectului disponibile pentru download
3. Descarcă și salvează-le într-un folder (ex: `C:\Users\TauNume\Desktop\livepick-pwa`)

### Opțiunea B: Creează manual structura
Urmează pașii de mai jos și creează fiecare fișier manual.

---

## 🛠️ PASUL 2: Instalează Prerequisite

### 1. Node.js (OBLIGATORIU)
**Descarcă și instalează:**
- Mergi la: https://nodejs.org/
- Descarcă versiunea **LTS** (ex: 20.x.x)
- Rulează installer-ul
- ✅ Verificare: Deschide **PowerShell** și scrie:
```powershell
node --version
npm --version
```
Ar trebui să vezi: `v20.x.x` și `10.x.x`

### 2. Git (Opțional, dar recomandat)
- Descarcă de la: https://git-scm.com/download/win
- Instalează cu setările default

### 3. Visual Studio Code (Opțional, dar recomandat)
- Descarcă de la: https://code.visualstudio.com/
- Editor excelent pentru cod

---

## 📂 PASUL 3: Structura Proiectului

Creează această structură de foldere pe PC-ul tău:

```
C:\Users\TauNume\Desktop\livepick-pwa\
├── app\
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public\
│   ├── icons\
│   │   ├── icon-72x72.svg
│   │   ├── icon-96x96.svg
│   │   ├── icon-128x128.svg
│   │   ├── icon-144x144.svg
│   │   ├── icon-152x152.svg
│   │   ├── icon-180x180.svg
│   │   ├── icon-192x192.svg
│   │   ├── icon-384x384.svg
│   │   └── icon-512x512.svg
│   └── manifest.json
├── scripts\
│   └── generate-icons.js
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── README.md
├── START-RAPID.md
└── PAS-1-TESTARE.md
```

---

## ⚡ PASUL 4: Instalare Rapidă (PowerShell)

### 1. Deschide PowerShell
- Apasă **Win + X**
- Selectează **"Windows PowerShell"** sau **"Terminal"**

### 2. Navighează la folderul proiectului
```powershell
cd C:\Users\TauNume\Desktop\livepick-pwa
```
**Nota:** Înlocuiește `TauNume` cu username-ul tău Windows!

### 3. Instalează dependințele
```powershell
npm install
```
⏱️ **Timp așteptat:** 2-3 minute (descarcă ~200MB)

### 4. Pornește aplicația
```powershell
npm run dev
```

### 5. Deschide în browser
- Deschide Chrome/Edge
- Mergi la: **http://localhost:3000**
- ✅ Ar trebui să vezi homepage-ul LivePick!

---

## 📱 PASUL 5: Test PWA pe iPhone

### 1. Găsește IP-ul calculatorului Windows
```powershell
ipconfig
```
Caută linia **"IPv4 Address"**, de exemplu: `192.168.1.100`

### 2. Pe iPhone
1. Deschide **Safari** (nu Chrome!)
2. Navighează la: `http://192.168.1.100:3000`
3. Tap **Share** (⬆) din bara de jos
4. Tap **"Add to Home Screen"**
5. Confirmă instalarea

### 3. Verificare
- Iconița "LP" cu gradient apare pe home screen
- Când o deschizi, rulează fullscreen (fără Safari UI)
- Status bar-ul este cyan (#00F5FF)

---

## 🐛 TROUBLESHOOTING WINDOWS

### Eroare: "npm: The term 'npm' is not recognized"
**Soluție:**
- Node.js nu este instalat sau nu este în PATH
- Reinstalează Node.js de la nodejs.org
- Restart PowerShell după instalare

### Eroare: "Port 3000 is already in use"
**Soluție:**
```powershell
npm run dev -- -p 3001
```
Apoi deschide: `http://localhost:3001`

### Eroare: "Cannot find module..."
**Soluție:**
```powershell
# Șterge node_modules și reinstalează
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Firewall blochează conexiunea iPhone
**Soluție:**
1. Deschide **Windows Defender Firewall**
2. Click **"Allow an app through firewall"**
3. Găsește **Node.js** și activează pentru **Private networks**

### iPhone nu se conectează la PC
**Verificări:**
- ✅ iPhone și PC pe aceeași rețea WiFi
- ✅ IP-ul este corect (verifică cu `ipconfig`)
- ✅ Port 3000 este deschis (nu este blocat de firewall)
- ✅ Folosești Safari pe iPhone (nu Chrome!)

---

## 🔧 COMENZI UTILE POWERSHELL

### Instalare dependințe
```powershell
npm install
```

### Pornire development server
```powershell
npm run dev
```

### Build pentru production
```powershell
npm run build
npm run start
```

### Generare iconițe PWA
```powershell
npm run generate-icons
```

### Verificare versiuni
```powershell
node --version
npm --version
```

### Curățare cache
```powershell
Remove-Item -Recurse -Force .next
npm run build
```

---

## 📝 URMĂTORII PAȘI

După ce aplicația rulează:

1. ✅ Verifică că homepage-ul se încarcă
2. ✅ Testează instalarea PWA pe desktop
3. ✅ Testează instalarea PWA pe iPhone
4. ✅ Rulează Lighthouse în Chrome DevTools
5. ✅ Verifică toate testele din **PAS-1-TESTARE.md**

Când totul funcționează:
**Scrie în chat: "PAS 1 TESTAT - START PAS 2"**

---

## 💡 TIPS WINDOWS

### Folosește PowerShell, NU Command Prompt
- PowerShell are comenzi mai moderne
- Suportă mai bine Node.js

### Instalează Windows Terminal (Opțional)
- Descarcă de pe Microsoft Store
- Interface mai frumos pentru PowerShell

### Activează Developer Mode (Opțional)
1. Settings → Update & Security → For developers
2. Activează "Developer Mode"
3. Îți permite să rulezi scripturi mai ușor

---

## 📞 AJUTOR RAPID

### Dacă nimic nu funcționează:
1. Verifică că Node.js este instalat: `node --version`
2. Verifică că ești în folderul corect: `Get-Location`
3. Verifică că `package.json` există: `Get-ChildItem package.json`
4. Reinstalează totul de la început

### Pentru mai multe detalii:
- **START-RAPID.md** - Ghid quick start (5 min)
- **PAS-1-TESTARE.md** - Toate testele (10 teste)
- **README.md** - Documentație completă

---

**Mult succes! 🚀**

Dacă întâmpini probleme, trimite-mi:
1. Screenshot cu eroarea
2. Output din PowerShell
3. Versiunea Windows (Win 10/11)
