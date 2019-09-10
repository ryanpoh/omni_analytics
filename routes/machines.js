var express = require('express');
var router = express.Router();

//const Pusher = require('pusher');

router.get('/machines', function(req, res) {
  res.render('machine_show');
});

module.exports = router;
