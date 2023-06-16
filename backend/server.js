const express = require("express");
const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"]
);
const server = express();
const port = 8080;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

server.use(express.json())
server.use(bodyParser.json());

require('dotenv').config()

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  next();
});

server.get('/', (req, res) => {
  res.status(200).send("Server is up and running. Maybe it'll win the race.")
})

// BCRYPT

server.post('/authenticate', (req, res) => {
  const reqPassword = req.body.password;
  const reqEmail = req.body.email;
  // console.log(reqPassword, reqEmail);

  knex('users')
    .where('email', reqEmail)
    .then(data => {
      bcrypt.compare(reqPassword, data[0].hashed_password)
      .then(auth => {
          // console.log(data);
          if (auth) {
            res.status(200).json({
              id: data[0].id,
              name: data[0].name,
              admin: data[0].is_admin,
              isLoggedIn: true,
              BOP: data[0].base
            })
          } else {
            res.status(404).json({
              id: 0,
              name: '',
              admin: false,
              isLoggedIn: false,
              BOP: ''
            })
          }
        })
        .catch(err => res.json({
          error: `bcrypt: ${err}`
        }))
    })
    .catch(err => res.json({
      error: `user does not exist`
    }))
})

// GET
server.get('/users?', (req, res) => {
  knex('users')
    .modify((soFar) => {
      if (req.query?.email) {
        soFar.where('email', req.query.email)
      }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get users: ${err}`
    }))
})

server.get('/items?', (req, res) => {
  knex('items')
    .modify((soFar) => {
      if (req.query?.attic_id) {
        soFar.where('attic_id', req.query.attic_id)
      } else if (req.query?.can_ship) {
        soFar.where('can_ship', req.query.can_ship)
      } else if (req.query?.base) {
        soFar.join('attics', 'items.attic_id', 'attics.id')
          .where('attics.location', req.query.base)
          .select('items.id', 'items.name', 'items.price', 'items.picture_url', 'items.can_ship', 'items.attic_id', 'items.tags')
      }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get items: ${err}`
    }))
})

server.get('/items/:id', (req, res) => {
  knex('items')
    .where('id', req.params.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get item with id ${req.params.id}: ${err}`
    }))
})

server.get('/items_wishlist?', (req, res) => {
  knex('items_wishlist')
    .modify((soFar) => {
      if (req.query?.user_id) {
        soFar.where('user_id', req.query.user_id)
      }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get items wishlist: ${err}`
    }))
})

server.get('/attics', (req, res) => {
  knex('attics')
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get attics: ${err}`
    }))
})

server.get('/attic_reviews', (req, res) => {
  knex('attic_reviews')
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get attic reviews: ${err}`
    }))
})

server.get('/patches', (req, res) => {
  knex('patches')
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get patches: ${err}`
    }))
})

server.get('/patches_wishlist', (req, res) => {
  knex('patches_wishlist')
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get patches_wishlist: ${err}`
    }))
})

server.get('/users', (req, res) => {
  knex('users')
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get users: ${err}`
    }))
})

server.get('/user_preference', (req, res) => {
  knex('user_preference')
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get user preferences: ${err}`
    }))
})

// POST

server.post('/users', (req, res) => {
  const newUser = req.body;

  // hash the requested password
  bcrypt.hash(newUser.password, saltRounds)
    .then(hash => {
      const hashedUser = {
        name: newUser.name,
        email: newUser.email,
        base: newUser.base,
        hashed_password: hash,
        attic_admin: false,
        attic_id: null
      }
      knex('users')
        .insert(hashedUser, ['*'])
        .then(data => {
          res.status(200).json(data)
        })
        .catch(err => {
          res.status(404).json({
            message: `Could not post user: ${err}`
          })
        })
    })
})

// PATCH

// DELETE

server.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);