const attic_reviews = require('../random_data/attic_reviews.json');
const attics = require('../random_data/attics.json');
const items_wishlist = require('../random_data/items_wishlist.json');
const items = require('../random_data/items.json');
const patches_wishlist = require('../random_data/patches_wishlist.json');
const patches = require('../random_data/patches.json');
const user_preference = require('../random_data/user_preference.json');
const users = require('../random_data/users.json');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('patches_wishlist').del();
  await knex('patches').del();
  await knex('items_wishlist').del();
  await knex('user_preference').del();
  await knex('items').del();
  await knex('attic_reviews').del();
  await knex('users').del();
  await knex('attics').del();

  // Inserts seed data from ../random_data
  await knex('attics').insert(attics);
  await knex('users').insert(users);
  await knex('attic_reviews').insert(attic_reviews);
  await knex('items').insert(items);
  await knex('user_preference').insert(user_preference);
  await knex('items_wishlist').insert(items_wishlist);
  await knex('patches').insert(patches);
  await knex('patches_wishlist').insert(patches_wishlist);
};