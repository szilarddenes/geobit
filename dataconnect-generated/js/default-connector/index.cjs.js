// Import from firebase data-connect module using require
const { validateArgs } = require('firebase/data-connect');

// Export connector configuration
const connectorConfig = {
  connector: 'default',
  service: 'geobit',
  location: 'us-central1'
};

module.exports = {
  connectorConfig
};

