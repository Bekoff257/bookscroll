# BookScroll MVP

Instagram-style book feed app with React + Firebase + Express + MongoDB Atlas.

## Structure

- `apps/web` — Vite + React + TypeScript + Tailwind
- `apps/api` — Node/Express + TypeScript + Mongoose

## Run locally

### Web

```bash
cd apps/web
npm i
npm run dev
```

### API

```bash
cd apps/api
npm i
npm run dev
```

## Environment

### `apps/web/.env`

Use `apps/web/.env.example`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_API_URL`

### `apps/api/.env`

Use `apps/api/.env.example`:

- `MONGO_URI`
- `FIREBASE_SERVICE_ACCOUNT_JSON` (JSON string for service account)
- `PORT`
- `CORS_ORIGIN`

## API endpoints

- `GET /me`
- `GET /feed?cursor=`
- `POST /posts`
- `GET /posts/:id`
- `POST /posts/:id/like`
- `DELETE /posts/:id/like`
- `GET /posts/:id/comments`
- `POST /posts/:id/comments`
- `GET /users/:id`
- `GET /admin/users?query=` (admin)
- `PATCH /admin/users/:id/verify` (admin)

## Auth bridge

Frontend sends Firebase ID token:

`Authorization: Bearer <token>`

Backend verifies token via `firebase-admin` middleware and maps to Mongo user.

## Firebase Storage rules example

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /covers/{uid}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    match /pdfs/{uid}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Create an admin user

Update MongoDB user document role manually:

```js
{ role: 'admin' }
```

(For example in Atlas UI or mongo shell.)
