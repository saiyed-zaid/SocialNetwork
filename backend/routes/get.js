const express = require("express");
const router = express.Router();

exports.getPosts = router.use((req, res, next) => {
    res.send('all posts');
});
