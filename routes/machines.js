var express = require('express');
var router = express.Router();

const Pusher = require('pusher');

var channels_client = new Pusher({
  appId: '859243',
  key: '5ed5a1f25586a0760edb',
  secret: '513c1a9c26df1f2705eb',
  cluster: 'ap1',
  encrypted: true
});

router.get('/machines', function(req, res) {
  res.render('machine_show');
});

router.post('/machines', function(req, res) {
  var volt = req.body.volt;

  dataSync = {
    volt: volt,
    active: 1,
    progress: 70
  };
  console.log(dataSync)

  channels_client.trigger('machine-1-channel', 'machine-1-sync', dataSync);

  return res.json({ success: true, message: 'Machine 1 Synced.' });
});

module.exports = router;
