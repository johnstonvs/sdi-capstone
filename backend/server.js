const express = require("express");
const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"]
);
const server = express();
const port = 8080;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const awsKeyId= process.env.AWS_KEY_ID
const awsAccessKey= process.env.AWS_ACCESS_KEY
const awsRegion= process.env.AWS_REGION
const awsBuket= process.env.AWS_BUCKET

const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: awsKeyId,
    secretAccessKey: awsAccessKey,
    region: awsRegion
});

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

server.get('/users/:id', (req, res) => {
  knex('users')
    .where('id', req.params.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get item with id ${req.params.id}: ${err}`
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

server.get('/attics/:id', (req, res) => {
  knex('attics')
    .where('id', req.params.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get item with id ${req.params.id}: ${err}`
    }))
})

server.get('/attic_reviews', (req, res) => {
  knex('attic_reviews')
    .join('users', 'attic_reviews.user_id', 'users.id')
    .select('attic_reviews.*', 'users.name')
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get attic reviews: ${err}`
    }))
})

server.get('/attic_reviews/:attic_id', (req, res) => {
  knex('attic_reviews')
    .join('users', 'attic_reviews.user_id', 'users.id')
    .select('attic_reviews.*', 'users.name')
    .where('attic_reviews.attic_id', req.params.attic_id)
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

server.get('/patches/:id', (req, res) => {
  knex('patches')
    .where('id', req.params.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get item with id ${req.params.id}: ${err}`
    }))
})

server.get('/patches_wishlist?', (req, res) => {
  knex('patches_wishlist')
    .modify((soFar) => {
      if (req.query?.user_id) {
        soFar.where('user_id', req.query.user_id)
      }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get patches wishlist: ${err}`
    }))
})

server.get('/user_preference', (req, res) => {
  knex('user_preference')
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get user preferences: ${err}`
    }))
})

server.get('/posts?', (req, res) => {
  knex('posts')
    .modify((soFar) => {
      if (req.query?.attic_id) {
        soFar.where('attic_id', req.query.attic_id)
      }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get users: ${err}`
    }))
})

server.get('/posts/:id', (req, res) => {
  knex('posts')
    .where('id', req.params.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get users: ${err}`
    }))
})

server.get('/comments?', (req, res) => {
  knex('comments')
    .join('users', 'comments.user_id', 'users.id')
    .select('comments.*', 'users.name')
    .modify((soFar) => {
      if (req.query?.review_id) {
        soFar.where('comments.review_id', req.query.review_id)
      } else if (req.query?.post_id) {
        soFar.where('comments.post_id', req.query.post_id)
      }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get users: ${err}`
    }))
})


server.get('/comments/:id', (req, res) => {
  knex('comments')
    .where('id', req.params.id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({
      message: `Could not get users: ${err}`
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


server.post('/comments', (req, res) => {
  console.log(req.body)
  knex('comments')
    .insert(req.body, ['*'])
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json({
      message: `Could not post comment: ${err}`
    }))
})

server.post('/attic_reviews', (req, res) => {
  knex('attic_reviews')
    .insert(req.body, ['*'])
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json({
      message: `Could not post your attic review: ${err}`
    }))
})

server.post('/items_wishlist', (req, res) => {
  knex('items_wishlist')
    .insert(req.body, ['*'])
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json({
      message: `Could not post to items wishlist: ${err}`
    }))
})

server.post('/patches_wishlist', (req, res) => {
  knex('patches_wishlist')
    .insert(req.body, ['*'])
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json({
      message: `Could not post to patches wishlist: ${err}`
    }))
})

server.post('/patches', (req, res) => {

  console.log(req.body)

  var s3 = new AWS.S3();

  var awsImgUrl = ''

  var params = {
    Bucket: awsBuket,
    Key: req.body.imageUrl,
    Body: fileContent
  };

  s3.upload(params, function(err, data) {
    if (err) {
        throw err;
    }
    awsImgUrl = data.Location
    console.log(`File uploaded successfully. ${data.Location}`);
 });

 req.body.imageUrl = awsImgUrl
 console.log(awsImgUrl)
 console.log(req.body.imageUrl)

  knex('patches')
    .insert(req.body, ['*'])
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json({
      message: `Could not post the patch: ${err}`
    }))
})


// PATCH

server.patch('/users/:id', (req, res) => {
  knex('users')
    .where('id', req.params.id)
    .update(req.body, ['*'])
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json({
      message: `Could not update user with id ${req.params.id}: ${err}`
    }))
})


// DELETE

server.delete('/items_wishlist', (req, res) => {
  knex('items_wishlist')
    .where('item_id', req.body.item_id)
    .andWhere('user_id', req.body.user_id)
    .del()
    .then(data => res.status(204).json(data))
    .catch(err => res.status(400).json({
      message: `Could not delete wishlist item with item id ${req.body.item_id} and user id ${req.body.user_id}: ${err}`
    }))
})

server.delete('/patches_wishlist', (req, res) => {
  knex('patches_wishlist')
    .where('patch_id', req.body.patch_id)
    .andWhere('user_id', req.body.user_id)
    .del()
    .then(data => res.status(204).json(data))
    .catch(err => res.status(400).json({
      message: `Could not delete wishlist patch with item id ${req.body.patch_id} and user id ${req.body.user_id}: ${err}`
    }))
})

// SERBER LISTEN
server.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);