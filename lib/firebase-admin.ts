import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = require('../lib/service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;


