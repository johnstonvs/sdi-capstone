const express = require("express");
const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"]
);
const server = express();
const port = 8080;
const bodyParser = require('body-parser');

let email;
import('emailjs').then((emailjs) => {
  email = emailjs;
});

server.use(express.json())
server.use(bodyParser.json());

require('dotenv').config()
const myEmail = process.env.EMAIL;
const password = process.env.PASSWORD;

// POST
server.post('/email', (req, res) => {
  const server  = email.server.connect({
      user:    myEmail,
      password: password,
      host:    "smtp.gmail.com",
      ssl:     true
  });

  server.send({
      text:    req.body.Body,
      from:    myEmail,
      to:      myEmail,
      cc:      "",
      subject: req.body.Email + req.body.Type + " " + req.body.Name
  }, function(err, message) {
      if (err) {
          console.log(err);
          res.status(500).send("Email not sent");
      } else {
          res.status(200).send("Email sent");
      }
  });
});

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

// GET
server.get('/users', (req, res) => {
  knex('users')
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
      }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get items: ${err}`
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

// PATCH

// DELETE

server.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);