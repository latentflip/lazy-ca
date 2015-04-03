exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (t) {
    t.increments();
    t.string('github_id');
    t.string('github_username');
    t.string('name');
    t.string('email');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
