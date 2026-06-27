# FindAFriend Frontend Design

## Architecture

```
findAFriend/
├── backend/          # API Fastify existente
│   ├── prisma/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── orgs/    (controllers, routes, factories, repositories)
│   │   │   └── pets/    (controllers, routes, factories, repositories)
│   │   ├── shared/
│   │   ├── app.ts
│   │   ├── routes.ts
│   │   └── server.ts
│   ├── uploads/         # imagens enviadas via frontend
│   └── docker-compose.yml
├── frontend/             # React + Vite + TS + Tailwind v4
│   └── src/
│       ├── pages/       # Home, PetList, PetProfile, OrgRegister, OrgLogin, Dashboard
│       ├── components/  # Shared UI components
│       ├── services/    # api.ts (Axios)
│       ├── lib/         # utils, types
│       └── App.tsx
└── README.md
```

## API Endpoints

### Existing (unchanged)
- `POST /orgs` — register org
- `POST /sessions` — authenticate, returns JWT
- `POST /pets` — create pet (auth required)
- `GET /pets?cidade=X&idade=&porte=&nivel_energia=` — search pets
- `GET /pets/:id` — pet profile

### New backend
- `GET /orgs/:id` — org profile (name, whatsapp, address, lat/lng)
- `POST /pets/:id/images` — upload images (auth required, multipart)
- `GET /uploads/:filename` — serve uploaded images (static)

### Schema additions (Prisma)
- `Pet.imagens: String[]` — list of image URLs
- `Org.latitude: Float?` + `Org.longitude: Float?` — geolocation

## Frontend Routes

| Path | Page | Auth |
|---|---|---|
| `/` | Home — hero, search by city, map with pins | No |
| `/pets` | Pet list — grid + filters (idade, porte, energia, ambiente) | No |
| `/pets/:id` | Pet profile — photos, description, org info, map | No |
| `/register` | Org registration form | No |
| `/login` | Org login | No |
| `/dashboard` | Org dashboard — list/create/edit/delete own pets | Yes |

## Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **React Router v7** — client-side routing
- **Tailwind CSS v4** — utility-first CSS
- **PostCSS** — CSS processing pipeline
- **Leaflet** + **react-leaflet** — free maps (OpenStreetMap)
- **Axios** — HTTP client with JWT interceptor
- **react-dropzone** — drag-and-drop image upload

### Backend additions
- `@fastify/multipart` — file upload handling
- `@fastify/static` — serve `uploads/` directory

## Data Flow

1. User searches city → `GET /pets?cidade=X`
2. Clicks pet → `GET /pets/:id` → shows pet + fetches org via `GET /orgs/:orgId`
3. Org registers → `POST /orgs` → redirects to login
4. Org logs in → `POST /sessions` → JWT stored in localStorage
5. Org creates pet → `POST /pets` (JWT header) → then upload images via `POST /pets/:id/images`
6. Images stored in `backend/uploads/` — served as static files

## Geolocation

- **Org registration**: Leaflet map picker + autocomplete search (Nominatim) to set lat/lng
- **Pet profile**: Map showing org location using Leaflet marker
- **Home**: Map with pins for pets in searched city, clustered

## Image Upload

- Backend: `@fastify/multipart` parses multipart form, saves to `uploads/` with UUID filenames
- Backend: stores relative paths in `Pet.imagens[]`
- Frontend: `react-dropzone` + preview before upload, sent via `FormData`

## Frontend Component Tree

```
App
├── Header (logo + nav: Home, Login/Dashboard)
├── Routes
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── SearchBar (city input + button)
│   │   └── MapSection (Leaflet map with pet pins)
│   ├── PetListPage
│   │   ├── FilterSidebar (idade, porte, energia, ambiente)
│   │   └── PetGrid
│   │       └── PetCard (photo, name, age, size)
│   ├── PetProfilePage
│   │   ├── ImageCarousel
│   │   ├── PetInfo
│   │   └── OrgCard (name, whatsapp, map)
│   ├── OrgRegisterPage
│   │   └── RegisterForm (name, email, password, CEP, address, whatsapp, city, map picker)
│   ├── OrgLoginPage
│   │   └── LoginForm (email + password)
│   └── DashboardPage (auth required)
│       ├── PetList (org's pets)
│       └── PetForm (create/edit with image upload)
└── Footer
```
