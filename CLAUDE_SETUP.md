# LocuList — Claude Setup Chat Log

This document is a record of the setup conversation used to initialize and configure this project.

---

## Session Summary

**Date:** 2026-03-21
**Goal:** Set up a basic Expo + React Native project, write a beginner-friendly README, and resolve Expo Go compatibility issues.

---

## 1. Initial Project Scaffold

**User:** Set up a basic Expo and React Native project. Add a detailed README that describes to a person with no background how to run, build, and work on this project.

**What was done:**
- Ran `npx create-expo-app@latest` with the `blank` template to generate the base project.
- Copied generated files into the project root: `App.js`, `index.js`, `app.json`, `package.json`, `assets/`.
- Fixed the app name from the temp scaffold value (`LocuListTemp`) to `LocuList` in both `package.json` and `app.json`.
- Wrote a detailed `README.md` covering:
  - Plain-English explanations of React Native, Expo, npm, Metro, and Expo Go.
  - Prerequisites (Node.js, Git, Expo Go, optional simulators).
  - Step-by-step clone and install instructions.
  - How to run the app on a real device, iOS Simulator, Android Emulator, and web.
  - Project file structure walkthrough.
  - How to make changes and add packages.
  - EAS Build instructions for production builds.
  - Common problems and fixes.

**npm cache issue encountered:**
During scaffolding, `npm install` failed with an `EACCES` permission error because the npm cache directory (`~/.npm`) was owned by root (caused by a previous `sudo npm` run). Resolution required running the following in a terminal:
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

---

## 2. Expo Go Compatibility Error

**User:** "Project is incompatible with this version of Expo Go — the project you requested requires a newer version of Expo Go." Upgrade to the newest form of Expo in this project.

**Finding:**
The project was already on Expo SDK 55.0.8 — the latest stable release at the time. The error was caused by the **Expo Go app on the phone being outdated**, not the project itself.

**What was done:**
- Confirmed the installed expo version: `55.0.8`.
- Confirmed `55` was the latest stable SDK (no `56` stable release existed yet).
- No SDK upgrade was needed — the project was already current.
- Updated `README.md` to:
  - Add a note in the Expo Go prerequisites section warning users to keep Expo Go updated.
  - Add a new troubleshooting entry: **"Project is incompatible with this version of Expo Go"** explaining the fix is to update Expo Go from the App Store / Google Play.

**Actual fix for the user:** Update Expo Go on the phone from the App Store or Google Play.

---

## 3. Downgrade to Expo SDK 54

**User:** Convert the Expo app to support SDK 54, which is my phone's current version.

**What was done:**
- Looked up the official Expo blank template for SDK 54 on GitHub to get the exact compatible dependency versions.
- Updated `package.json` with SDK 54 compatible versions:

| Dependency | Old (SDK 55) | New (SDK 54) |
|---|---|---|
| `expo` | `~55.0.8` | `~54.0.33` |
| `expo-status-bar` | `~55.0.4` | `~3.0.9` |
| `react` | `19.2.0` | `19.1.0` |
| `react-native` | `0.83.2` | `0.81.5` |

- Deleted `node_modules/` and ran `npm install` fresh.
- Verified the installed expo version was `54.0.33`.
- Updated both SDK version references in `README.md` from `55` → `54`.

---

## Final Project State

```
LocuList/
├── App.js              # Root component
├── index.js            # Entry point
├── app.json            # App metadata (name: LocuList, slug: LocuList)
├── package.json        # Dependencies pinned to Expo SDK 54
├── README.md           # Beginner-friendly setup guide
├── CLAUDE_SETUP.md     # This file
├── assets/             # Icon and splash screen images
└── node_modules/       # Installed packages (not committed to git)
```

**To run the project:**
```bash
npm install   # only needed if node_modules is missing
npm start     # starts Metro; scan QR code with Expo Go (SDK 54+)
```
