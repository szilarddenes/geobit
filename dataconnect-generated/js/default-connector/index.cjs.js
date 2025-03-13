const { , validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'geobit',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

