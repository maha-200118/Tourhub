import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = require('../lib/service-account.json');
 admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
}


export default admin;


