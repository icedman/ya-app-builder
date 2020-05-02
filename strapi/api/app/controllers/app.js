'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const fs = require('fs');
const exec = require('child_process').exec;
const hbs = require('handlebars');
const path = require('path');
const pluralize = require('pluralize');

const model = require('../../ModelEx');

const gen = (model) => {
    new Promise((resolve, reject) => {
        let cmd = `yarn strapi generate:api ${model.name}`;
        exec(cmd,
            function (err, stdout, strerr) {
                let res = {
                    err,
                    stdout,
                    sterr
                };
                return resolve(res);
            });
}   );
}

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 4);
});

const updateController = async(model) => {
    let tpl = hbs.compile(
        fs.readFileSync(path.join(__dirname, './controller.hbs'), {
          encoding: 'utf-8'
        })
    );

    let models = pluralize(model.name);
    let modelJson = tpl({model: model.name, models: models});

    fs.writeFileSync(path.join(__dirname, `../../${model.name}`, `controllers/${model.name}.js`), modelJson, {
        encoding: 'utf-8'
      });
};

const updateFields = async (model) => {
    let tpl = hbs.compile(
        fs.readFileSync(path.join(__dirname, '../models/settings.json.hbs'), {
          encoding: 'utf-8'
        })
    );

    let models = pluralize(model.name);

    let attributes = model.children.map(c => {
        return {
            name: c.name,
            type: c.dataType
        }
    })

    let modelJson = tpl({model: model.name, models: models, attributes: attributes});
    console.log(modelJson);
    fs.writeFileSync(path.join(__dirname, `../../${model.name}`, `models/${model.name}.settings.json`), modelJson, {
        encoding: 'utf-8'
      });
}

module.exports = {

  find: async (ctx) => {
    var res = await model.find('apps', ctx)
    return res
  },

  generate: async (ctx) => {

    console.log('generate');
    // console.log(ctx.request.body);

    let model = ctx.request.body.model;
    await gen(model);
    await updateFields(model);
    await updateController(model);

    return {}
  }
}
