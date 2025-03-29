# Capacitor Setup Guide for NoteBlue

This guide explains how to set up Capacitor to build an Android APK from your NoteBlue web application.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Android Studio](https://developer.android.com/studio) (for Android builds)
- [Java Development Kit (JDK)](https://adoptopenjdk.net/) (v8 or higher)

## Step 1: Clone and Setup

1. Clone the repository:
```bash
git clone https://github.com/rohithmohanan1/NoteBlue.git
cd NoteBlue
```

2. Install dependencies:
```bash
npm install
```

3. Install Capacitor packages:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android --force
```

## Step 2: Initialize Capacitor

1. Initialize Capacitor with your app information:
```bash
npx cap init NoteBlue com.noteblue.app --web-dir www
```

2. Build your web assets:
```bash
# Create a www directory and copy public files
mkdir -p www
cp -r public/* www/
```

3. Add the Android platform:
```bash
npx cap add android
```

## Step 3: Configure Capacitor

The `capacitor.config.json` file is already included in the repository. It contains:

```json
{
  "appId": "com.noteblue.app",
  "appName": "NoteBlue",
  "webDir": "www",
  "server": {
    "androidScheme": "https"
  }
}
```

## Step 4: Modify Server for Capacitor (Optional)

If your app depends on the Node.js server, you'll need to modify how data is stored:

1. Update the app to use local storage instead of server-side storage
2. OR: Implement a remote API that your app can connect to

## Step 5: Build the Android App

1. Copy your web assets to the Android project:
```bash
npx cap copy android
```

2. Open the Android project in Android Studio:
```bash
npx cap open android
```

3. In Android Studio:
   - Wait for the Gradle sync to complete
   - Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
   - The APK will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`

## Step 6: Create a Signed Release APK (For Production)

1. In Android Studio, go to Build > Generate Signed Bundle / APK
2. Select APK and click Next
3. Create a new keystore or use an existing one
4. Fill in the required information and click Next
5. Select release build variant and click Finish
6. The release APK will be generated in `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

- If you have issues with dependencies, try using the `--force` flag with npm commands
- Ensure that your Android SDK is properly set up in Android Studio
- Check the Capacitor logs for detailed error messages: `npx cap doctor`

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Documentation](https://developer.android.com/docs)