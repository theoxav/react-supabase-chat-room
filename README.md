# 💬 Chat App - Application de Chat en Temps Réel

Une application de chat moderne et performante construite avec React et TypeScript, offrant des conversations en temps réel dans des salles de chat multiples.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.86-3ECF8E?logo=supabase)

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Architecture](#architecture)
- [Scripts disponibles](#scripts-disponibles)

## 🎯 Aperçu

Cette application de chat permet aux utilisateurs de :
- S'authentifier de manière sécurisée
- Créer et rejoindre des salles de chat
- Échanger des messages en temps réel
- Voir l'historique des conversations

L'application utilise Supabase pour l'authentification, la base de données PostgreSQL et les fonctionnalités de temps réel, offrant une expérience utilisateur fluide et réactive.

## ✨ Fonctionnalités

### 🔐 Authentification
- **Inscription** : Création de compte avec email et mot de passe
- **Connexion** : Authentification sécurisée via Supabase Auth
- **Gestion de session** : Persistance de la session utilisateur
- **Déconnexion** : Bouton de déconnexion accessible depuis la navbar

### 💬 Chat en temps réel
- **Messages instantanés** : Synchronisation en temps réel grâce à Supabase Realtime
- **Affichage des messages** : Interface claire avec distinction visuelle entre vos messages et ceux des autres
- **Informations contextuelles** : Affichage de l'email de l'expéditeur et de la date/heure de chaque message
- **Historique** : Chargement automatique de l'historique des messages lors de l'ouverture d'une salle

### 🏠 Gestion des salles
- **Création de salles** : Création de nouvelles salles de chat avec un nom personnalisé
- **Liste des salles** : Visualisation de toutes les salles disponibles
- **Sélection de salle** : Changement de salle avec mise à jour automatique des messages
- **Redirection automatique** : Redirection vers la page principale après création d'une salle

### 🎨 Interface utilisateur
- **Design moderne** : Interface utilisateur élégante et intuitive
- **Navigation fluide** : Menu de navigation avec React Router
- **Responsive** : Adaptation à différentes tailles d'écran
- **Feedback visuel** : Messages d'erreur et états de chargement

## 🛠 Technologies utilisées

### Frontend
- **[React 19.2](https://react.dev/)** - Bibliothèque UI moderne avec hooks
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Typage statique pour une meilleure maintenabilité
- **[Vite 7.2](https://vite.dev/)** - Build tool ultra-rapide et moderne
- **[React Router 7](https://reactrouter.com/)** - Routage côté client
- **[React Hook Form 7](https://react-hook-form.com/)** - Gestion performante des formulaires
- **[TanStack Query 5](https://tanstack.com/query)** - Gestion des données serveur avec cache et synchronisation
- **[Zustand 5](https://zustand-demo.pmnd.rs/)** - Gestion d'état légère et simple

### Backend & Services
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - **Auth** : Authentification utilisateur
  - **PostgreSQL** : Base de données relationnelle
  - **Realtime** : Synchronisation en temps réel via WebSockets
  - **Row Level Security** : Sécurité au niveau des lignes

### Outils de développement
- **[ESLint](https://eslint.org/)** - Linter pour maintenir la qualité du code
- **[TypeScript ESLint](https://typescript-eslint.io/)** - Règles ESLint spécifiques à TypeScript

## 📁 Structure du projet

```
chat-app/
├── src/
│   ├── components/          # Composants React
│   │   ├── features/        # Composants fonctionnels
│   │   │   ├── auth/        # Authentification
│   │   │   ├── chat/        # Chat et messages
│   │   │   └── rooms/       # Gestion des salles
│   │   └── layouts/         # Layouts et navigation
│   ├── pages/               # Pages de l'application
│   │   ├── chat-room.tsx    # Page principale de chat
│   │   ├── room-list.tsx    # Liste des salles
│   │   └── create-room.tsx  # Création de salle
│   ├── services/            # Services API
│   │   ├── message.ts       # Gestion des messages
│   │   └── room.ts          # Gestion des salles
│   ├── store/               # Gestion d'état (Zustand)
│   │   ├── authStore.ts     # État d'authentification
│   │   └── chatStore.ts     # État du chat
│   ├── types/               # Définitions TypeScript
│   │   └── index.ts         # Types et interfaces
│   ├── lib/                 # Utilitaires
│   │   └── utils.ts         # Fonctions utilitaires
│   ├── App.tsx              # Composant racine
│   ├── main.tsx             # Point d'entrée
│   ├── supabaseClient.ts    # Client Supabase
│   └── index.css            # Styles globaux
├── public/                  # Assets statiques
├── index.html              # Template HTML
├── package.json            # Dépendances
├── tsconfig.json           # Configuration TypeScript
├── tsconfig.app.json       # Config TS pour l'app
├── vite.config.ts          # Configuration Vite
└── README.md               # Documentation

```

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn** ou **pnpm**
- Un compte **Supabase** (gratuit) avec un projet créé

## 🚀 Installation

1. **Cloner le repository** (ou télécharger le projet)
```bash
git clone <url-du-repo>
cd chat-app
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

## ⚙️ Configuration

### Configuration Supabase

1. **Créer un projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Notez votre URL et votre clé anonyme

2. **Configurer les variables d'environnement**
   
   Créez un fichier `.env` à la racine du projet :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
```

3. **Configurer la base de données**
   
   Exécutez ces requêtes SQL dans l'éditeur SQL de Supabase :

```sql
-- Table des salles
CREATE TABLE rooms (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des messages
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Activer Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour les salles (lecture publique, écriture authentifiée)
CREATE POLICY "Anyone can read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create rooms" ON rooms FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politiques de sécurité pour les messages (lecture publique, écriture authentifiée)
CREATE POLICY "Anyone can read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create messages" ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Activer Realtime pour les messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

## 🎮 Utilisation

### Démarrage en mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite).


### Gestion d'état

L'application utilise **Zustand** pour la gestion d'état globale :

- **`authStore`** : Gère l'état de l'utilisateur authentifié
- **`chatStore`** : Gère la salle de chat actuellement sélectionnée

### Gestion des données

**TanStack Query** est utilisé pour :
- Le cache des données serveur
- La synchronisation automatique
- La gestion des états de chargement et d'erreur
- L'invalidation intelligente du cache

### Temps réel

**Supabase Realtime** permet :
- La synchronisation instantanée des nouveaux messages
- L'utilisation de WebSockets pour une communication bidirectionnelle
- La mise à jour automatique de l'interface sans rechargement

### Alias de chemins

L'application utilise l'alias `@` pour simplifier les imports :
- `@/components` → `src/components`
- `@/services` → `src/services`
- `@/store` → `src/store`
- etc.

Configuration dans `tsconfig.app.json` et `vite.config.ts`.

## 📜 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run build` | Compile l'application pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Exécute ESLint pour vérifier le code |

## 🔒 Sécurité

- **Authentification** : Gérée par Supabase Auth avec tokens JWT
- **Row Level Security** : Politiques de sécurité au niveau de la base de données
- **Validation** : Validation des formulaires côté client avec React Hook Form
- **TypeScript** : Typage statique pour éviter les erreurs à l'exécution


## 📄 Licence

Ce projet est sous licence MIT.

---

Développé avec ❤️ en utilisant React, TypeScript et Supabase
