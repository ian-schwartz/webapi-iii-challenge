const usersdb = require('./userDb');
const postsdb = require('../posts/postDb');
const router = require('express').Router();

router.get('/', (req, res) => {
    usersdb.get(req.query)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(() => res.status(500).json({ error: "The user's information could not be retrieved." }));
});

router.get('/:id', validateUserId, (req, res) => {
    usersdb.getById(req.params.id)
      .then(user => {
        res.status(200).json(user);
    })
      .catch(() => res.status(500).json({ error: "The user's information could not be retrieved." }));
});

router.get('/:id/posts', validateUserId, (req, res) => {
    usersdb.getUserPosts(req.params.id)
      .then(posts => {
          res.status(200).json(posts);
      })
      .catch(() => res.status(500).json({ error: "There was an error getting the user's post." }));
});

router.post('/', validateUser, (req, res) => {
    usersdb.insert(req.body)
      .then(user => {
          res.status(201).json(user)
      })
      .catch(() => res.status(500).json({ error: "There was an error creating the user."}));
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    postsdb.insert({ text: req.body.text, user_id: req.params.id })
      .then(post => {
          res.status(201).json(post);
      })
      .catch(() => res.status(500).json({ error: "There was an error adding the post."}))
});

router.delete('/:id', validateUserId, (req, res) => {
    usersdb.remove(req.params.id)
    .then(user => {
        if (user) {
            res.status(200).json({ message: `Deleted user with id ${req.params.id}`})
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    })
    .catch(() => res.status(500).json({ error: "The user could not be removed." }));
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    usersdb.update(req.params.id, req.body)
      .then(user => {
          res.status(200).json(user);
      })
      .catch(() => res.status(500).json({ error: "The user could not be modified." }));
});

//custom middleware

function validateUserId(req, res, next) {
    usersdb.getById(req.params.id)
      .then(users => {
          if (!users) {
              res.status(400).json({ message: "invalid user id" });
          } else {
              next();
          }
      })
      .catch(() => res.status(500).json({ message: "there was an error getting the user" }));
  };
  
function validateUser(req, res, next) {
    if (Object.entries(req.body).length === 0) {
        res.status(400).json({ message: "missing user data" });
    } else if (!req.body.name) {
        res.status(400).json({ message: "missing required name field" });
    } else {
        next();
    }
  };
  
function validatePost(req, res, next) {
    if (Object.entries(req.body).length === 0) {
      res.status(400).json({ message: "missing post data" });
    } else if (!req.body.text) {
      res.status(400).json({ message: "missing required text field" });
    } else {
      next();
    }
  };

module.exports = router;
