Perfect! 💪

Hier is **PROJECT.md** - copy-paste dit helemaal in je bestand:

---

```markdown
# 🏗️ Workbench 3D Configurator - Project Document

**Status:** 🟡 **In Development - Backend in progress**
**Laatste update:** April 22, 2026
**Lead:** Claude Code Development

---

## 📋 PROJECT OVERVIEW

### 🎯 Wat is het?
E-commerce **3D configurator** voor werkplaatsinrichting. Klanten ontwerpen zelf hun werkplek door modulaire kasten, lades, werkbladen, etc. te plaatsen → genereren offerte → (later) rechtstreeks naar WooCommerce order.

### 💡 Waarom?
- **Betere UX:** Klanten zien exact wat ze kopen
- **Minder support:** Geen vragen meer over combinaties
- **Upsell:** Modules suggereren gebaseerd op layout
- **Professioneel imago:** Modern, tech-forward
- **Data:** Configuraties opslaan voor analytics

### 🎁 Eindproduct
✅ Web-based 3D viewer (Vercel)
✅ Drag-and-drop module plaatser
✅ Offerte aanvraag (email + database)
✅ Config opslaan/laden
✅ Email notificaties (user + admin)
✅ WooCommerce integratie (later)
✅ Admin panel (configs beheren)

---

## ✨ REQUIREMENTS & SCOPE

| Requirement | Status | Prioriteit |
|-------------|--------|-----------|
| 3D Scene (Three.js) | ✅ KLAAR | P0 |
| 30 3D Modules laden | 🟡 TODO | P0 |
| Module plaatsen (drag) | 🔴 TODO | P0 |
| 3D Grid (werkplek) | 🔴 TODO | P0 |
| Offerteform | 🔴 TODO | P1 |
| Config opslaan (DB) | 🔴 TODO | P1 |
| Email versturen | 🔴 TODO | P1 |
| Admin panel | 🔴 TODO | P2 |
| WooCommerce koppeling | 🔴 TODO | P2 |

---

## 🏛️ ARCHITECTUUR

### Tech Stack

```
FRONTEND ✅ (localhost:5500)
├── HTML5/CSS3/ES6 JavaScript
├── Three.js v0.176.0 (3D rendering)
├── GLTFLoader (model loading)
├── OrbitControls (camera control)
└── No frameworks (keep it light!)

BACKEND 🟡 (localhost:3000 - database pending)
├── Node.js + Express (REST API)
├── MongoDB Atlas (database)
├── SendGrid (email service)
└── JWT (authentication, later)

DATABASE 🔴 (MongoDB Atlas - setup needed)
├── MongoDB Atlas (cloud DB)
├── SendGrid (SMTP)
├── Vercel Blob (asset storage)
└── WooCommerce REST API (later)
```

### Mapstructuur

```
configurator/
├── public/                    [Frontend - Vercel]
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── scene/
│   │   │   ├── scene-setup.js       ✅ KLAAR
│   │   │   └── lighting.js          ✅ KLAAR
│   │   ├── controls/
│   │   │   └── orbit-controls.js    🟡 TODO
│   │   ├── loaders/
│   │   │   └── model-loader.js      🟡 TODO
│   │   ├── ui/
│   │   │   ├── grid-renderer.js     🔴 TODO
│   │   │   ├── configurator.js      🔴 TODO
│   │   │   ├── quote-form.js        🔴 TODO
│   │   │   └── ui-utils.js          🔴 TODO
│   │   ├── api/
│   │   │   └── api-client.js        🔴 TODO
│   │   └── utils/
│   │       ├── constants.js
│   │       └── debug.js
│   └── models/
│       ├── cabinet/          (10-15 GLB)
│       ├── drawer/           (5-8 GLB)
│       ├── workbench/        (3-5 GLB)
│       └── tools/            (3-5 GLB)
│
├── api/                       [Backend - Railway/Render]
│   ├── server.js             🔴 TODO
│   ├── .env.local
│   ├── .env.production
│   ├── package.json
│   ├── routes/
│   │   ├── quote.js          🔴 TODO
│   │   ├── config.js         🔴 TODO
│   │   └── woocommerce.js    🔴 TODO
│   ├── models/
│   │   ├── Config.js         🔴 TODO
│   │   └── Quote.js          🔴 TODO
│   ├── services/
│   │   ├── email-service.js  🔴 TODO
│   │   ├── db-service.js     🔴 TODO
│   │   └── woocommerce-service.js 🔴 TODO
│   ├── middleware/
│   │   ├── auth.js           🔴 TODO
│   │   └── error-handler.js  🔴 TODO
│   └── config/
│       └── database.js       🔴 TODO
│
├── PROJECT.md               (Dit document)
├── PROGRESS.md              (Voortgang tracker)
├── README.md
├── .gitignore
└── package.json
```

---

## 🔄 USER FLOW

```
FASE 1: DISCOVERY
User → Website → Ziet lege 3D werkplek (4x6m)
                → Tools: OrbitControls (rotate/zoom)

FASE 2: ONTWERPEN
User → Kiest module type (dropdown)
    → Klikt op grid → plaats module
    → Kan roteren/verplaatsen/delete
    → Real-time 3D preview
    → Repeat tot configuratie af

FASE 3: OFFERTE AANVRAAG
User → Klikt "Offerte aanvragen"
    → Form: email, naam, bedrijf, notities
    → Klikt "Verzenden"

FASE 4: BACKEND VERWERKING
Frontend → API POST /quote
Backend → Validatie
       → Slaat config in MongoDB
       → Genera PDF
       → Stuurt email (user + admin)
Frontend → Toon "Verzonden!"

FASE 5: FOLLOW-UP
User → Ontvangt email met config ID
Admin → Ziet offerte in admin panel
     → Kan aanpassen/goedkeuren
     → Stuurt quote terug naar user
(Later) → User import in WooCommerce
```

---

## 📊 DATABASE SCHEMA

### Config Collection
```javascript
{
  _id: ObjectId,
  configId: String,              // Unique UUID
  email: String,
  userId: String,                // Optional
  
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    source: String,              // "web"
    userAgent: String
  },
  
  workspace: {
    width: Number,               // 4 meters
    depth: Number,               // 6 meters
    height: Number               // 2.4 meters
  },
  
  modules: [
    {
      id: String,                // Unique per config
      type: String,              // "cabinet" | "drawer" | "workbench" | "tool"
      modelId: String,           // "cabinet-400-600-h"
      modelName: String,
      quantity: Number,
      position: { x, y, z },
      rotation: { x, y, z },
      color: String,
      customNotes: String
    }
  ],
  
  totals: {
    moduleCount: Number,
    estimatedPrice: Number,
    currency: String             // "EUR"
  },
  
  status: String,                // "draft" | "submitted" | "quoted" | "ordered"
  notes: String
}
```

### Quote Collection
```javascript
{
  _id: ObjectId,
  quoteId: String,               // Unique
  configId: String,              // Reference to Config
  
  clientInfo: {
    email: String,
    fullName: String,
    company: String,
    phone: String
  },
  
  content: {
    projectName: String,
    modules: [...],              // Copy from config
    workspace: {...},
    totalModules: Number,
    estimatedPrice: Number
  },
  
  admin: {
    notes: String,               // Internal
    status: String,              // "new" | "reviewing" | "approved" | "sent"
    assignedTo: String,
    reviewedAt: Date,
    approvedAt: Date
  },
  
  timeline: {
    createdAt: Date,
    sentToUserAt: Date,
    respondedAt: Date
  }
}
```

---

## 📈 VOORTGANG - REAL TIME UPDATE

| Fase | Taak | Status | Datum |
|------|------|--------|-------|
| 1 | Scene + Lighting | ✅ KLAAR | Apr 22 |
| 1 | Controls + Loader | ✅ KLAAR | Apr 22 |
| 1 | Grid + Configurator | ✅ KLAAR | Apr 22 |
| 1 | Forms + API client | ✅ KLAAR | Apr 22 |
| 2 | Express Server | ✅ KLAAR | Apr 22 |
| 2 | MongoDB Setup | 🟡 NEXT | - |
| 2 | Routes + Services | 🔴 TODO | - |
| 3 | Integration testing | 🔴 TODO | - |
| 4 | Polish + Deploy | 🔴 TODO | - |

Overall: **9/16 tasks done (56%)**

---

## 🔗 CURRENT STATUS (Apr 22 Evening)

✅ Frontend: Fully functional (Scene, Controls, Grid, Quote Form)
✅ Backend: Server running (http://localhost:3000)
✅ Both communicating via API (CORS enabled)

🟡 Next: MongoDB Database + Email Service

---

## 🚀 PROMPTS - CLAUDE CODE (VOLGORDE)

### FASE 1: Frontend (In Progress)

#### ✅ PROMPT 1: Scene Setup
```
Maak me een Three.js scene setup in js/scene/scene-setup.js
```

#### ✅ PROMPT 2: Lighting
```
Maak js/scene/lighting.js met AmbientLight + DirectionalLight
```

#### 🟡 PROMPT 3: OrbitControls (VOLGENDE!)
```
Maak js/controls/orbit-controls.js met:
- OrbitControls initialisatie (camera + renderer.domElement)
- Distance limits (min 2, max 50)
- Auto-rotate: false
- Pan + zoom enabled
- Smooth damping
- Export controls object
- Import in main.js en use in animation loop
- Console log: "✓ OrbitControls ready"
- Comments in Nederlands
```

#### 🔴 PROMPT 4: Model Loader
```
Maak js/loaders/model-loader.js met ModelLoader class:
- loadModel(path) → Promise
- GLTFLoader wrapper
- Error handling
- Cache loaded models
- Export default ModelLoader
```

#### 🔴 PROMPT 5: 3D Grid
```
Maak js/ui/grid-renderer.js met:
- 3D grid (4x6 meter, grijs)
- GridHelper van Three.js
- Zichtbare grenzen
- Export function om aan scene toe te voegen
```

#### 🔴 PROMPT 6: Configurator Core
```
Maak js/ui/configurator.js met ConfiguratorCore class:
- Module selector (dropdown)
- Klik op grid → plaats module
- Module data opslag
- Export/import config als JSON
```

#### 🔴 PROMPT 7: Quote Form
```
Maak js/ui/quote-form.js met:
- HTML form (email, naam, bedrijf, bericht)
- Form validation
- Submit handler → API call
- Error/success feedback
```

#### 🔴 PROMPT 8: API Client
```
Maak js/api/api-client.js met:
- submitQuote(configData, contactData) → POST /api/quote
- saveConfig(configData) → POST /api/config
- loadConfig(configId) → GET /api/config/:id
- Error handling
```

---

## 🎨 ADVANCED FEATURES (LATER)

### 3D Workspace Editor (Future Enhancement)
- User kan workspace grootte aanpassen (input: width x depth x height)
- 3D vloer met texture/material
- 3D muren (optioneel, voor referentie)
- Realtime grid update bij size change
- Estimated: LATER (na basis configurator)
- Priority: P3

---

### FASE 2: Backend (TODO)

#### 🔴 PROMPT 9: Express Server
```
Maak api/server.js
```

#### 🔴 PROMPT 10: MongoDB Setup
```
Maak api/config/database.js
```

#### 🔴 PROMPT 11: Quote Routes
```
Maak api/routes/quote.js
```

#### 🔴 PROMPT 12: Email Service
```
Maak api/services/email-service.js
```

---

## 📅 TIMELINE

| Fase | Taak | Uren | Status |
|------|------|------|--------|
| 1 | Scene + Lighting | 1 | ✅ |
| 1 | Controls + Loader | 2 | 🟡 |
| 1 | Grid + Configurator | 3 | 🔴 |
| 1 | Forms + API | 2 | 🔴 |
| 2 | Backend server | 2 | 🔴 |
| 2 | Routes + Email | 3 | 🔴 |
| 3 | Integration | 3 | 🔴 |
| 4 | Deploy + polish | 2 | 🔴 |
| **TOTAAL** | | **18 uur** | |

**Realistische pace:**
- Dag 1: Frontend basis (6 uur)
- Dag 2: Backend (8 uur)
- Dag 3: Integration + deploy (4 uur)

---

## 🔐 SECURITY

- [ ] CORS properly configured
- [ ] Input validation (backend)
- [ ] Rate limiting
- [ ] Environment variables (no secrets)
- [ ] HTTPS production

---

## 📚 RESOURCES

- Three.js: https://threejs.org/docs/
- Vercel: https://vercel.com/docs
- MongoDB: https://docs.mongodb.com/
- SendGrid: https://docs.sendgrid.com/
- Express: https://expressjs.com/

---

## 🔗 VOLGENDE STAP

→ **PROMPT 3 in Claude Code (OrbitControls)**

---

*Gemaakt voor Workbench e-commerce - April 2026*
*Klaar voor upload in nieuwe chats*
```