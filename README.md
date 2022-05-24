# ddtools-web

The Firebase project and web interface for Daddy's Dungeon Tools.

## Stack

ddtools-web is a [Google Firebase](https://firebase.google.com/) project and a React single-page application. It uses Typescript both for Firebase Functions and for the React application. It uses the following Firebase services:

- Authentication
- Firestore Database
- Storage
- Hosting
- Functions

## Local Setup

> You must be added to the Firebase project as a contributor. Contact Frank for access to this.

1. Install [Firebase CLI](https://firebase.google.com/docs/cli) and login
1. Clone this repository `$ git clone git@github.com:Daddy-s-Dungeons-Tools/ddtools-web.git`
1. Install frontend dependencies `$ cd frontend/ && npm install`

## Local Development

### Run Firebase Emulators

```bash
$ firebase emulators:start
```

### Run React SPA

```bash
$ cd frontend/
$ npm start
```

## Inspiration

- [Adventurer's Codex](https://adventurerscodex.com/)
- [5e Tools](https://5etools-mirror-1.github.io/)
- [Foundry VTT](https://foundryvtt.com/)
