# LocuList

MUC Project 2026 — A mobile app built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev).

---

## Table of Contents

1. [What is this project?](#what-is-this-project)
2. [How the technology works (plain English)](#how-the-technology-works-plain-english)
3. [Prerequisites — install these first](#prerequisites--install-these-first)
4. [Getting the project on your computer](#getting-the-project-on-your-computer)
5. [Running the app](#running-the-app)
6. [Project structure](#project-structure)
7. [Making changes](#making-changes)
8. [Building for production](#building-for-production)
9. [Common problems and fixes](#common-problems-and-fixes)

---

## What is this project?

LocuList is a mobile app that runs on both **iOS** (iPhone/iPad) and **Android** phones from a single shared codebase. You don't need to write two separate apps — React Native translates your code into native mobile components automatically.

---

## How the technology works (plain English)

| Term | What it means |
|---|---|
| **React Native Paper** | A UI component library that gives you pre-built, Material Design styled components (buttons, cards, inputs, etc.) so you don't have to build everything from scratch. |
| **React Native** | A framework that lets you write mobile apps using JavaScript. It turns your code into real native iOS and Android components. |
| **Expo** | A toolchain built on top of React Native that handles the hard parts (building, testing on a device, publishing) so you don't have to configure Xcode or Android Studio for day-to-day development. |
| **npm** | Node Package Manager — the tool that downloads all the libraries (called "packages" or "dependencies") your project needs. |
| **`node_modules/`** | The folder where all downloaded packages live. You never edit this folder directly. |
| **`package.json`** | A file that lists every package the project depends on, plus shortcuts for running common commands. |
| **Metro** | The development server that Expo starts. It watches your files and pushes changes to your device instantly. |
| **Expo Go** | A free app on the App Store / Google Play that lets you preview the app on a real device without building a full binary. |

---

## Prerequisites — install these first

You only need to do this section **once**, the first time you set up your machine.

### 1. Node.js

Node.js is the JavaScript runtime that powers everything.

- Download from [nodejs.org](https://nodejs.org) — pick the **LTS** (Long-Term Support) version.
- After installing, verify it worked by opening a terminal and running:
  ```
  node --version
  ```
  You should see something like `v20.x.x`.

### 2. Git

Git is the version-control tool used to share and track code changes.

- **Mac:** Git is included with Xcode Command Line Tools. Run `git --version` in a terminal. If it's not installed, macOS will prompt you to install it.
- **Windows:** Download from [git-scm.com](https://git-scm.com).
- Verify: `git --version`

### 3. Expo Go (on your phone)

To preview the app on a real device during development:

- **iPhone:** Search "Expo Go" in the App Store.
- **Android:** Search "Expo Go" in the Google Play Store.

> **Important:** This project uses **Expo SDK 54**. Make sure your Expo Go app is version 54 or newer. If you see an "incompatible" error, update Expo Go from the App Store or Google Play.

Your phone and computer must be on the **same Wi-Fi network** during development.

### 4. (Optional) iOS Simulator — Mac only

If you want to run the app in a simulator on your Mac instead of a real phone:

- Install **Xcode** from the Mac App Store (it's large — ~15 GB).
- Open Xcode once to accept the license agreement.

### 5. (Optional) Android Emulator

- Install [Android Studio](https://developer.android.com/studio).
- Open Android Studio → More Actions → Virtual Device Manager → create a device.

---

## Getting the project on your computer

### Step 1 — Clone the repository

Open a terminal and run:

```bash
git clone <repository-url>
cd LocuList
```

Replace `<repository-url>` with the actual URL from GitHub/GitLab.

### Step 2 — Install dependencies

This downloads all the packages the project needs:

```bash
npm install
```

This only needs to be re-run when someone adds a new package to `package.json`.

---

## Running the app

### Start the development server

```bash
npm start
```

This starts the **Metro** bundler and shows a QR code in the terminal.

```
 › Metro waiting on exp://192.168.x.x:8081
 › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Open on a device

| Platform | How to open |
|---|---|
| **iPhone** | Open the native Camera app, point it at the QR code. Tap the Expo Go banner that appears. |
| **Android** | Open the Expo Go app, tap "Scan QR code". |
| **iOS Simulator** | Press `i` in the terminal (Xcode must be installed). |
| **Android Emulator** | Press `a` in the terminal (Android Studio must be installed and an emulator running). |
| **Web browser** | Press `w` in the terminal. |

### Hot reload

While the development server is running, every time you **save a file** the app updates automatically on your device within a second or two — no need to restart.

---

## Project structure

```
LocuList/
├── App.js            # The root component — this is where the app starts
├── index.js          # Entry point that registers App.js with React Native
├── app.json          # App metadata: name, icon, splash screen, etc.
├── package.json      # Dependency list and npm script shortcuts
├── assets/           # Images, fonts, and other static files
│   ├── icon.png      # App icon
│   └── splash-icon.png
└── node_modules/     # Downloaded packages (never edit this)
```

### UI component library

This project uses **React Native Paper** for pre-built Material Design components. `App.js` wraps the entire app in two required providers:

- `<SafeAreaProvider>` — ensures content stays within the safe area of the screen (away from notches and home indicators).
- `<PaperProvider>` — makes all Paper components available and applies the theme.

You can use any Paper component inside these providers. Browse the full list at [reactnativepaper.com](https://reactnativepaper.com).

**Example — using a Paper Button:**
```js
import { Button } from 'react-native-paper';

<Button mode="contained" onPress={() => console.log('Pressed')}>
  Press me
</Button>
```

### Where to start coding

Open [App.js](App.js). Everything you see on screen comes from this file. When the app grows, you'll create additional component files and import them here.

---

## Making changes

1. Make sure `npm start` is running in a terminal.
2. Open `App.js` (or any other file) in your editor.
3. Edit and save — the app on your device updates automatically.

### Adding a new screen or component

Create a new `.js` file, for example `screens/HomeScreen.js`:

```js
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Hello from HomeScreen!</Text>
    </View>
  );
}
```

Then import and use it in `App.js`:

```js
import HomeScreen from './screens/HomeScreen';
```

### Adding a package

```bash
npx expo install <package-name>
```

Always use `npx expo install` instead of plain `npm install` for new packages — Expo picks the version that is compatible with your current Expo SDK.

### Committing your changes

```bash
git add .
git commit -m "Short description of what you changed"
git push
```

---

## Building for production

Expo provides a cloud build service called **EAS Build** that creates the final `.ipa` (iOS) or `.apk`/`.aab` (Android) file without needing Xcode or Android Studio installed locally.

### One-time setup

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build for iOS

```bash
eas build --platform ios
```

### Build for Android

```bash
eas build --platform android
```

Builds run in the cloud. When finished, EAS provides a download link. See the [Expo EAS docs](https://docs.expo.dev/build/introduction/) for full details.

---

## Common problems and fixes

### "Project is incompatible with this version of Expo Go"

This means the **Expo Go app on your phone** is outdated, not the project. Update Expo Go:

- **iPhone:** Open the App Store → search "Expo Go" → tap **Update**.
- **Android:** Open Google Play → search "Expo Go" → tap **Update**.

This project uses **Expo SDK 54**. Expo Go must be at version 54 or newer.

---

### "Unable to find expo in this project" or similar

Run `npm install` again — the `node_modules` folder may be missing or incomplete.

### QR code doesn't open the app on my phone

- Make sure your phone and computer are on the **same Wi-Fi network**.
- Try switching the connection type in the Expo terminal: press `s` to toggle between tunnel, LAN, and local.

### The app is stuck on a white/blank screen

Press `r` in the Expo terminal to reload, or shake your device and tap "Reload".

### npm install fails with a permission error

On Mac, this often means the npm cache is owned by root. Fix it by running:

```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

### My changes aren't showing up

- Make sure you saved the file (`Cmd+S` / `Ctrl+S`).
- Press `r` in the Metro terminal to force a full reload.

### "Port 8081 is already in use"

Another Metro server is running. Either close it, or press `shift+r` in the new terminal to use a different port.

---

## Useful links

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Components reference](https://reactnative.dev/docs/components-and-apis)
- [EAS Build (cloud builds)](https://docs.expo.dev/build/introduction/)
