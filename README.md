# Temple: Fitness, Fuel and Faith

Version 0.2. The full interface prototype (Today, Fuel, Body, Train, Coach, Faith) packaged as an Android app with Capacitor. All numbers are sample data until the integrations in docs/ROADMAP.md are connected.

## Build the APK on GitHub
1. Create a new empty repo on GitHub.
2. Unzip this folder, then push everything to the `main` branch.
3. Open the repo's Actions tab. The "Build Android APK" workflow runs on every push (or press "Run workflow").
4. When it finishes, download the `Temple-debug-apk` artifact, unzip it and install `app-debug.apk` on your phone (allow installs from unknown sources).

## Edit the app
All screens live in `www/index.html`. Edit it, push, and the workflow rebuilds the APK.

## Run locally
`npm install`, `npx cap add android`, `npx cap sync`, `npx cap open android` (needs Android Studio).

## New in 0.2
Our journey milestones, progress photos, app icon, Android back button, meal photo scanner and Google Health connect. The last two need the server in `docs/SERVER.md`.
