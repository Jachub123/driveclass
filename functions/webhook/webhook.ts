import { Handler } from '@netlify/functions';
import * as admin from 'firebase-admin';
// Code to Unsub at stripe
// Initialize Firebase Admin SDK
var serviceAccount = require('../drive-schools-3fa8f-firebase-adminsdk-8ue8l-7e71615120.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://drive-schools-3fa8f-default-rtdb.europe-west1.firebasedatabase.app',
});
const handler: Handler = async (event, context) => {
  try {
    const stripe = require('stripe')(
      'sk_test_51O3G1zHuUB3uXapboGxbUf2NwlLEa6bqQn5bWodYEw5A4KwR3IbwGgUo0EN8l2TXgoHFxQEIlpuFJzP35xI1Nd2i00j6vUzcMc'
    );
    const subscriptions = await stripe.subscriptions.list();
    for (let i = 0; i < subscriptions.data.length; i++) {
      const firestore = admin.firestore();
      // Access Firestore data here
      const collectionRef = firestore
        .collection('schools')
        .doc('T4GpuQlOBycURI4BzvG2')
        .collection('school');
      const snapshot = await collectionRef.get();
      snapshot.forEach(async (doc) => {
        if (
          doc.data()['school']['profilename'] ===
          event.rawQuery.split('=')[0].replace(/%40/g, '@')
        ) {
          if (
            doc.data()['school']['payrexxUuid'] ===
            subscriptions.data[i].metadata.subscription
          ) {
            const subscription = await stripe.subscriptions.cancel(
              subscriptions.data[i].id
            );
          }
        }
      });
      /* } */
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

export { handler };
