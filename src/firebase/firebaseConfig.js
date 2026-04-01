/* ╔═══════════════════════════════════════════════════════════════════╗
   ║  FIREBASE CONFIGURATION                                         ║
   ║                                                                  ║
   ║  SETUP INSTRUCTIONS:                                             ║
   ║  ─────────────────────────────────────────────────────────────── ║
   ║  1. Go to https://console.firebase.google.com                   ║
   ║  2. Click "Create a project" and follow the wizard              ║
   ║  3. In the project dashboard, click the Web icon (</>)          ║
   ║  4. Register your app with a nickname (e.g. "la-maison")       ║
   ║  5. Copy the firebaseConfig values into a .env file:           ║
   ║                                                                  ║
   ║     VITE_FIREBASE_API_KEY=AIza...                               ║
   ║     VITE_FIREBASE_AUTH_DOMAIN=la-maison.firebaseapp.com         ║
   ║     VITE_FIREBASE_PROJECT_ID=la-maison                          ║
   ║     VITE_FIREBASE_STORAGE_BUCKET=la-maison.appspot.com          ║
   ║     VITE_FIREBASE_MESSAGING_SENDER_ID=123456789                  ║
   ║     VITE_FIREBASE_APP_ID=1:123456789:web:abc123                  ║
   ║                                                                  ║
   ║  6. In the Firebase console, go to Build → Firestore Database   ║
   ║  7. Click "Create database" → Start in test mode                ║
   ║  8. Choose the closest region                                    ║
   ║                                                                  ║
   ║  FIRESTORE COLLECTIONS NEEDED:                                   ║
   ║  ─────────────────────────────────────────────────────────────── ║
   ║  • menuItems        — restaurant menu dishes                    ║
   ║  • reservations     — table booking submissions                 ║
   ║  • contactMessages  — contact form submissions                  ║
   ║  • orders           — online orders from customers              ║
   ║                                                                  ║
   ║  SAMPLE menuItems DOCUMENT:                                      ║
   ║  {                                                               ║
   ║    name: "Truffle Bruschetta",                                   ║
   ║    description: "Toasted sourdough topped with black truffle…",  ║
   ║    price: 16,                                                    ║
   ║    category: "Appetizers",                                       ║
   ║    image: "https://images.unsplash.com/photo-…",                ║
   ║    popular: true,                                                ║
   ║    dietary: ["vegetarian"]                                       ║
   ║  }                                                               ║
   ║                                                                  ║
   ║  SECURITY RULES (recommended for production):                    ║
   ║  ─────────────────────────────────────────────────────────────── ║
   ║  rules_version = '2';                                            ║
   ║  service cloud.firestore {                                       ║
   ║    match /databases/{database}/documents {                       ║
   ║      // Anyone can read menu items                               ║
   ║      match /menuItems/{doc} {                                    ║
   ║        allow read: if true;                                      ║
   ║        allow write: if false;                                    ║
   ║      }                                                           ║
   ║      // Anyone can create reservations; only admins read         ║
   ║      match /reservations/{doc} {                                 ║
   ║        allow create: if true;                                    ║
   ║        allow read, update, delete: if false;                     ║
   ║      }                                                           ║
   ║      // Anyone can create contact messages; only admins read     ║
   ║      match /contactMessages/{doc} {                              ║
   ║        allow create: if true;                                    ║
   ║        allow read, update, delete: if false;                     ║
   ║      }                                                           ║
   ║    }                                                             ║
   ║  }                                                               ║
   ╚═══════════════════════════════════════════════════════════════════╝ */

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL:       `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

export { db };
export default app;
