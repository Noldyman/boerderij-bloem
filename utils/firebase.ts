import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // REACT_APP_API_KEY=AIzaSyCX3inxwBOKJJEvefZZjaEwM9cEuFUcJdk
  // REACT_APP_AUTH_DOMAIN=boerderij-bloem.firebaseapp.com
  // REACT_APP_PROJECT_ID=boerderij-bloem
  // REACT_APP_STORAGE_BUCKET=gs://boerderij-bloem.appspot.com
  // REACT_APP_MESSAGING_SENDER_ID=967981412121
  // REACT_APP_APP_ID=1:967981412121:web:72ee1549d45ece6e6d9f88
  // REACT_APP_DB_URL=https://boerderij-bloem-default-rtdb.europe-west1.firebasedatabase.app/

  apiKey: "AIzaSyCX3inxwBOKJJEvefZZjaEwM9cEuFUcJdk",
  authDomain: "boerderij-bloem.firebaseapp.com",
  projectId: "boerderij-bloem",
  messagingSenderId: "967981412121",
  appId: "1:967981412121:web:72ee1549d45ece6e6d9f88",
  storageBucket: "gs://boerderij-bloem.appspot.com",
  databaseURL: "https://boerderij-bloem-default-rtdb.europe-west1.firebasedatabase.app/",

  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // databaseURL: process.env.REACT_APP_DB_URL,
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);
