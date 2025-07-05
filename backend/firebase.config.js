// This file is intentionally kept but Firebase should not be initialized or used from here.
// It serves as a placeholder for potential future Firebase integration.

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTaeo5mOYXXTaX7kfcslTb2n6UZ90Dg2o", // Example - Real key should be kept secure
  authDomain: "mekinamart-96b98.firebaseapp.com",
  projectId: "mekinamart-96b98",
  storageBucket: "mekinamart-96b98.firebasestorage.app",
  messagingSenderId: "703880155752",
  appId: "1:703880155752:web:bf8918ffe7037356fd61dd",
  measurementId: "G-G7W3LPN473" // Example
};

// Firebase REMOVED: initializeApp(firebaseConfig)
// Firebase REMOVED: getAnalytics(app)

// To re-enable Firebase, you would uncomment the lines above and ensure
// 'firebase/app' and 'firebase/analytics' are installed and imported:
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Export the config object directly.
// Using ES module export as it's common in modern JS projects.
export default firebaseConfig;

// If compatibility with CommonJS is strictly needed (e.g. for some specific bundler configurations):
// module.exports = firebaseConfig;
// However, for most React Native / Expo setups, 'export default' is preferred.
// The original file used ES imports, so 'export default' is consistent.