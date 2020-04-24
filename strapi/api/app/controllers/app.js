'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const model = require('../../ModelEx');

module.exports = {

  find: async (ctx) => {
    var res = await model.find('apps', ctx)
    return res
  }

};
