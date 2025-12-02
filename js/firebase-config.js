// Firebase v8 compatível com seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyCe9akuXWO4KLQlXLMqzCAGbobeP9JLo54",
  authDomain: "sorveteria-fica-frio-ae.firebaseapp.com",
  projectId: "sorveteria-fica-frio-ae",
  storageBucket: "sorveteria-fica-frio-ae.appspot.com",
  messagingSenderId: "212266190471",
  appId: "1:212266190471:web:e50af4f21619637ec91a22",
  measurementId: "G-H87BTFQ87E"
};

firebase.initializeApp(firebaseConfig);

// Serviços Firebase (v8)
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
