# Deployment Guide

This guide covers how to deploy your **Masters Application Tracker** to production.

## Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Vite/React applications and offers excellent free tier performance.

### Steps:

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

## Option 2: Firebase Hosting

Since you are already using Firebase for the database, you can host the app there too.

### Steps:

1.  **Install Firebase CLI**:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login**:
    ```bash
    firebase login
    ```

3.  **Initialize Hosting**:
    ```bash
    firebase init hosting
    ```
    *   **Select Project**: Choose your existing project (`application-tracker-mv`).
    *   **Public Directory**: Type `dist` (this is where Vite builds to).
    *   **Configure as single-page app?**: Type `y` (Yes).
    *   **Set up automatic builds and deploys with GitHub?**: `n` (No, for now).
    *   **File dist/index.html already exists. Overwrite?**: `n` (No).

4.  **Build the App**:
    ```bash
    npm run build
    ```

5.  **Deploy**:
    ```bash
    firebase deploy --only hosting
    ```

6.  **Done**: The CLI will output your hosting URL.

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
