export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyAC0OPhVqgaoAXjjqRr7108lRldViZplIs",
    authDomain: "ai-crm-edba6.firebaseapp.com",
    projectId: "ai-crm-edba6",
    storageBucket: "ai-crm-edba6.firebasestorage.app",
    messagingSenderId: "643085026607",
    appId: "1:643085026607:web:1debc814f67c423dbbcdda",
    measurementId: "G-P9TKN5ZXYB"
  },
  apiUrl: (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? `http://${window.location.hostname}:8000`
    : 'https://crm-backend-15tu.onrender.com'
};
