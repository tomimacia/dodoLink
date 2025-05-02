const firebaseAdmin = require('firebase-admin');
const { onRequest } = require('firebase-functions/https');

firebaseAdmin.initializeApp();

exports.createUser = onRequest((request: any, response: any) => {
  response.set('Access-Control-Allow-Origin', '*'); // O mejor: 'http://localhost:3000'
  response.set('Access-Control-Allow-Methods', 'POST');
  response.set('Access-Control-Allow-Headers', 'Content-Type');

  // Manejo del preflight
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }
  let { body } = request;
  const { email, password, displayName } = body;
  if (!email || !password || !displayName) {
    response.status(400).send('Missing required fields');
    return;
  }
  firebaseAdmin
    .auth()
    .createUser({
      email: email,
      emailVerified: false,
      password: password,
      displayName: displayName,
      disabled: false,
    })
    .then((userRecord: any) => {
      return response.status(200).send({
        message: 'User created successfully',
        uid: userRecord.uid,
      });
    })
    .catch((error: any) => {
      return response.status(400).send('Failed to create user: ' + error);
    });
});
exports.deleteUser = onRequest((req: any, res: any) => {
  res.set('Access-Control-Allow-Origin', '*'); // En producción: usar tu dominio
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Manejo de preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { uid } = req.body;

  if (!uid) {
    res.status(400).send({ message: 'Missing UID in request body.' });
    return;
  }

  firebaseAdmin
    .auth()
    .deleteUser(uid)
    .then(() => {
      res.status(200).send({ message: `Successfully deleted user: ${uid}` });
    })
    .catch((error: any) => {
      res
        .status(400)
        .send({ message: 'Failed to delete user', error: error.message });
    });
});
