importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDHrNDgZjffLM9E0o1yJD43o6KKSG1ETvI",
  authDomain: "flutter-push-test-5fe6d.firebaseapp.com",
  databaseURL: "",
  projectId: "flutter-push-test-5fe6d",
  storageBucket: "flutter-push-test-5fe6d.appspot.com",
  appId: "1:20262213676:web:632c3995e29f71a376d989",
  messagingSenderId:"20262213676"
});

const messaging = firebase.messaging();

// Optional:
messaging.onBackgroundMessage((message) => {
  console.log("onBackgroundMessage", message);
});