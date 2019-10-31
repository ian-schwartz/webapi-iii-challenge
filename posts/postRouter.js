const postsdb = require('../posts/postDb');
const router = require('express').Router();

router.get('/', (req, res) => {
    postsdb.get(req.query)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => res.status(500).json({ error: "The post's information could not be retrieved." }));
});

router.get('/:id', validatePostId, (req, res) => {
    postsdb.getById(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => res.status(500).json({ error: "The post's information could not be retrieved." }));
});

router.delete('/:id', validatePostId, (req, res) => {
    postsdb.remove(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json({ message: `Deleted post with id ${req.params.id}`})
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(() => res.status(500).json({ error: "The post could not be removed." }));
});

router.put('/:id', validatePostId, (req, res) => {
    postsdb.update(req.params.id, req.body)
      .then(post => {
          res.status(200).json(post);
      })
      .catch(() => res.status(500).json({ error: "The post could not be modified." }));
});

// custom middleware

function validatePostId(req, res, next) {
    postsdb.getById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(400).json({ message: "invalid post id" });
            } else {
                next();
            }
        })
        .catch(() => res.status(500).json({ message: "there was an error getting the post" }));
};

module.exports = router;