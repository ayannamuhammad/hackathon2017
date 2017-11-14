// Chris Joakim, Microsoft, 2017/11/14

const express = require('express');
const router  = express.Router();

router.get('/', function(req, res) {
  var date = new Date();
  var obj = {};
  obj.date = date;
  obj.epoch = date.getTime();
  res.json(obj);
});

module.exports = router;
