const postsdb = require('../posts/postDb');
const router = require('express').Router();

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

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