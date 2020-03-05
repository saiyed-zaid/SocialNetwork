const express = require("express");
const router = express.Router();

router.get('/',(req, res, next) => {
    res.send('all posts');
});

module.exports = router