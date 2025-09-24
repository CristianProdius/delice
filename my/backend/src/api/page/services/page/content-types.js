'use strict';

/**
 * content-types service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::content-types.content-types');
