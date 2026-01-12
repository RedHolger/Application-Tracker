# Deployment Guide

This guide covers how to deploy your **Masters Application Tracker** to production.

## Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Vite/React applications and offers excellent free tier performance. You can deploy via the Web Dashboard or the CLI.

### Method A: Vercel CLI (Fastest)

1.  **Run the deploy command**:
    You can use `npx` to run Vercel without installing it globally.
    ```bash
    npx vercel
    ```

2.  **Follow the interactive prompts**:
    *   **Set up and deploy?**: `y` (Yes)
    *   **Which scope?**: Select your account (e.g., `manuvashistha`).
    *   **Link to existing project?**: `n` (No)
    *   **Project name?**: `manu-masters-portfolio` (or press Enter).
    *   **In which directory?**: `./` (Press Enter).
    *   **Want to modify these settings?**: `n` (No) - Vercel auto-detects Vite settings.

3.  **Deploy to Production**:
    The first command creates a "Preview" deployment. To push to production (main URL):
    ```bash
    npx vercel --prod
    ```

### Method B: Vercel Dashboard (Web UI)

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```

2.  **Sign up/Login to Vercel**: Go to [vercel.com](https://vercel.com) and sign in with GitHub.

3.  **Add New Project**:
    *   Click **"Add New..."** > **"Project"**.
    *   Import your `Application-Tracker` repository.

4.  **Configure Project**:
    *   **Framework Preset**: It should auto-detect "Vite".
    *   **Root Directory**: Leave as `./`.
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).

5.  **Environment Variables**:
    *   Expand the **"Environment Variables"** section.
    *   Add all the Firebase config values from your `src/firebase.js` (or `.env` if you have one).
    *   *Note*: Since you currently have the config hardcoded in `src/firebase.js`, you don't *strictly* need to add them here unless you switch to using `import.meta.env`.
    *   **Best Practice**: It is highly recommended to move secrets to `.env` files.
        1.  Create `.env` in your project root:
            ```env
            VITE_FIREBASE_API_KEY=your_api_key
            VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
            VITE_FIREBASE_PROJECT_ID=your_project_id
            VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
            VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
            VITE_FIREBASE_APP_ID=your_app_id
            ```
        2.  Update `src/firebase.js` to use `import.meta.env.VITE_FIREBASE_API_KEY`, etc.
        3.  Add these same variables in the Vercel dashboard.

6.  **Deploy**: Click **"Deploy"**.

7.  **Finalize**: Once deployed, Vercel will give you a live URL (e.g., `https://application-tracker.vercel.app`).

---

## Option 2: Firebase Hosting (Active)

**Status**: ✅ Configured with GitHub Actions.

Your project is set up to automatically deploy to Firebase Hosting whenever you push to the `main` branch.

### How it works:
1.  **Workflows**: Two GitHub Actions files were created in `.github/workflows/`.
    *   `firebase-hosting-merge.yml`: Deploys to live site when merging to `main`.
    *   `firebase-hosting-pull-request.yml`: Creates a preview URL when you open a Pull Request.
2.  **Configuration**: Settings are in `firebase.json` and `.firebaserc`.
3.  **Deployment**: Just commit and push your changes!
    ```bash
    git add .
    git commit -m "Update app"
    git push origin main
    ```

### Manual Deployment (Optional)
If you ever need to deploy manually without git:
1.  Build the app:
    ```bash
    npm run build
    ```
2.  Deploy:
    ```bash
    firebase deploy --only hosting
    ```

---

## Important: Firestore Rules

Ensure your Firestore security rules allow access from your deployed domain.

1.  Go to [Firebase Console](https://console.firebase.google.com).
2.  Navigate to **Firestore Database** > **Rules**.
3.  For development/testing, you might have them open:
    ```
    allow read, write: if true;
    ```
4.  For production, consider locking them down or adding authentication later.

## Troubleshooting

*   **White Screen on Deploy**: Check the console for errors. usually related to missing environment variables or incorrect build output path.
*   **Routing 404s**: If refreshing a page gives a 404, ensure you configured the host as a "Single Page App" (rewrites all routes to index.html).
