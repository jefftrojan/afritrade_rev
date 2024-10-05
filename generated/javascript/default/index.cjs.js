const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'Afritrade',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

