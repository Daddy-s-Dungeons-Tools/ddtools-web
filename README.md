# ddtools-web

The Firebase project and web interface for Daddy's Dungeon Tools.

## Stack

ddtools-web is a [Google Firebase](https://firebase.google.com/) project and a React single-page application. It uses Typescript both for Firebase Functions and for the React application. It uses the following Firebase services:

- Authentication
- Firestore Database
- Storage
- Hosting
- Functions

## Planned Features Master List

- [x] Login with Google Account
- [ ] Users
  - [x] Change display name
  - [ ] Delete user account
- [ ] Campaigns
  - [ ] DMs
    - [x] Accept/decline campaign invites
    - [x] Invite players
    - [ ] Manage players
    - [ ] Edit campaign details
  - [ ] Players
    - [x] Accept/decline campaign invites
    - [ ] Create character
  - [ ] Campaign Dashboards
    - [ ] World map widget
    - [x] Notes widget
    - [x] Adventuring Party widget
    - [ ] Event log/chat widget
    - [ ] Clock widget
    - [x] 3D dice roller
- [ ] List in progress

## Local Setup

> You must be added to the Firebase project as a contributor. Contact Frank for access to this.

1. Install [Firebase CLI](https://firebase.google.com/docs/cli) and login
1. Clone this repository `$ git clone git@github.com:Daddy-s-Dungeons-Tools/ddtools-web.git`
1. Install frontend dependencies `$ cd frontend/ && npm install`

## Local Development

### Run Firebase Emulators

```bash
firebase emulators:start
```

### Run React SPA

```bash
cd frontend/
npm start
```

## Inspiration

- [Adventurer's Codex](https://adventurerscodex.com/)
- [5e Tools](https://5etools-mirror-1.github.io/)
- [Foundry VTT](https://foundryvtt.com/)
- [Beyond Tabletop](https://www.beyondtabletop.com/)
- [Mythic Table](https://www.mythictable.com/)
