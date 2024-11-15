import { Handler } from '@netlify/functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
var serviceAccount = require('../drive-schools-3fa8f-firebase-adminsdk-8ue8l-7e71615120.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://drive-schools-3fa8f-default-rtdb.europe-west1.firebasedatabase.app',
});

const handler: Handler = async (event, context) => {
  const firestore = admin.firestore();
  try {
    // Access Firestore data here
    const collectionRef = firestore
      .collection('schools')
      .doc('T4GpuQlOBycURI4BzvG2')
      .collection('school');
    const snapshot = await collectionRef.get();

    const data: any[] = [];
    if (JSON.parse(event.body)?.subscription?.status === 'active') {
      snapshot.forEach((doc) => {
        if (
          JSON.parse(event.body)?.subscription?.uuid ===
            doc.data()['school']['payrexxUuid'] &&
          JSON.parse(event.body)?.subscription?.uuid !== undefined
        ) {
          let time = (new Date().getHours() + 1).toString();
          if (time.toString()[1] === undefined) {
            time = '0' + time.toString();
          }
          collectionRef.doc(doc.id).update({
            school: {
              ...doc.data()['school'],
              time: JSON.parse(event.body)?.subscription?.time,
              valid:
                JSON.parse(event.body)?.subscription?.valid_until +
                'T' +
                time +
                ':00',
            },
          });
        }
      });
    }

    // Respond with Firestore data or do something with it
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
