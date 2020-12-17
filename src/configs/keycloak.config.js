import Keycloak from 'keycloak-connect';
import session from 'express-session';

/* init keycloak */
const memoryStore = session.MemoryStore();
const kcConfig = {
  clientId: 'nodejs-microservice',
  bearerOnly: true,
  serverUrl: process.env.SERVER_URL_KEYCLOAK,
  realm: 'Demo-Realm',
  realmPublicKey: process.env.REALM_PUBLIC_KEY,
};

let keycloak = null;

const getKeycloak = () => {
  if (!keycloak) {
    keycloak = new Keycloak({ store: memoryStore }, kcConfig);
  }
  return keycloak;
};

export default getKeycloak();
