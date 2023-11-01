import { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
var serviceAccount = require("../drive-schools-3fa8f-firebase-adminsdk-8ue8l-7e71615120.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://drive-schools-3fa8f-default-rtdb.europe-west1.firebasedatabase.app",
});

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
admin
  .firestore()
  .collection("mail")
  .add({
    to: "dschakub@hotmail.de",
    message: {
      subject: "Hello from Firebase!",
      html: "This is an <code>HTML</code> email body.",
    },
  });
