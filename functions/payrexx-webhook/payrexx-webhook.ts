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
    snapshot.forEach((doc) => {
      if (
        JSON.parse(event.body)?.subscription?.uuid ===
          doc.data()['school']['payrexxUuid'] &&
        JSON.parse(event.body)?.subscription?.uuid !== undefined
      ) {
        /*         console.log(JSON.parse(event.body)?.subscription?.uuid);
        console.log(doc.data()['school']['payrexxUuid']);
        console.log(doc.id); */
        console.log(JSON.parse(event.body));
        console.log(JSON.parse(event.body)?.subscription?.valid_until);
        console.log(new Date().getHours() + 1);
        const time = new Date().getHours() + 1;
        collectionRef.doc(doc.id).update({
          school: {
            ...doc.data()['school'],
            valid:
              JSON.parse(event.body)?.subscription?.valid_until +
              'T' +
              time +
              ':00',
          },
        });
      }
      /* data.push({
        id: doc.id,
        ...doc.data(),
      }); */
    });

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
