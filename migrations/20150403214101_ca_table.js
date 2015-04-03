'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('cas', function (t) {
    t.increments()
    t.string('name')
    t.integer('user_id')
    t.text('pem')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('cas');
}
