const Knex        = require('knex');
const { Model }   = require('objection');
const knexFile    = require('./knexfile');

const knex = Knex(knexFile);
Model.knex(knex);

class Provider extends Model {
  static get tableName () {
    return 'providers';
  }
}

module.exports.Provider = Provider;