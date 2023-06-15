/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('attics', (table) => {
    table.increments('id');
    table.string('location');
    table.varchar('phone', [19]);
    table.string('email');
    table.string('address');
    table.string('about');
  })
  .createTable('users', (table) => {
    table.increments('id');
    table.string('name');
    table.string('email');
    table.string('base');
    table.string('hashed_password');
    table.boolean('attic_admin');
    table.integer('attic_id');
    table.foreign('attic_id').references('users.id').onUpdate('CASCADE').onDelete('SET NULL');
  })
  .createTable('attic_reviews', (table) => {
    table.increments('id');
    table.string('body');
    table.integer('stars');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onUpdate('CASCADE').onDelete('SET NULL');
    table.integer('attic_id');
    table.foreign('attic_id').references('attics.id').onUpdate('CASCADE').onDelete('SET NULL');
  })
  .createTable('items', (table) => {
    table.increments('id');
    table.string('name');
    table.decimal('price');
    table.string('picture_url');
    table.boolean('can_ship');
    table.integer('attic_id');
    table.foreign('attic_id').references('attics.id').onUpdate('CASCADE').onDelete('SET NULL');
    table.string('tags', 'string ARRAY');
  })
  .createTable('user_preference', (table) => {
    table.increments('id');
    table.string('tags', 'string ARRAY');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onUpdate('CASCADE').onDelete('SET NULL');
  })
  .createTable('items_wishlist', (table) => {
    table.increments('id');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onUpdate('CASCADE').onDelete('SET NULL');
    table.integer('item_id');
    table.foreign('item_id').references('items.id').onUpdate('CASCADE').onDelete('SET NULL');
  })
  .createTable('patches', (table) => {
    table.increments('id');
    table.string('name');
    table.decimal('price');
    table.string('picture_url');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onUpdate('CASCADE').onDelete('SET NULL');
  })
  .createTable('patches_wishlist', (table) => {
    table.increments('id');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onUpdate('CASCADE').onDelete('SET NULL');
    table.integer('patch_id');
    table.foreign('patch_id').references('patches.id').onUpdate('CASCADE').onDelete('SET NULL');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('patches_wishlist')
  .dropTableIfExists('patches')
  .dropTableIfExists('items_wishlist')
  .dropTableIfExists('user_preference')
  .dropTableIfExists('items')
  .dropTableIfExists('attic_reviews')
  .dropTableIfExists('users')
  .dropTableIfExists('attics')
};
