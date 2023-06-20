## API Endpoints

# GET

all gets can get their individual ID passed as a param

/users
  queries: email

/items
  queries: attic_id, can_ship, base

/items_wishlist
  queries: user_id

/attics

/attic_reviews

/patches

/patches_wishlist

/users

/user_preference

/posts
  queries: attic_id

/comments
  queries: post_id, review_id

# POST

/users
  body: {
    name: "name",
    email: "email",
    base: "base"
  }

# PATCH

# DELETE