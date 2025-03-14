const { connectorConfig } = require('../');
const { CallerSdkTypeEnum, validateArgs } = require('firebase/data-connect');
const { useQuery } = require('@tanstack-query-firebase/react/data-connect');

module.exports = { connectorConfig, useQuery };

