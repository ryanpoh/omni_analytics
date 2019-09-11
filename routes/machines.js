var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Pusher = require('pusher');
var MachineData = require('../models/machineData');

var channels_client = new Pusher({
  appId: '859243',
  key: '5ed5a1f25586a0760edb',
  secret: '513c1a9c26df1f2705eb',
  cluster: 'ap1',
  encrypted: true
});

router.get('/machines/new', function(req, res) {
  res.render('machine_new');
});

router.get('/machines', function(req, res) {
  var voltArray = [];
  var progressArray = [];
  var objToPass = {
    voltArray: voltArray,
    progressArray: progressArray
  };

  MachineData.find({}, (err, machineDbData) => {
    //{} means you take everything from DB
    if (err) {
      console.log(err);
    } else {
      // MULTPLE
      machineDbData.forEach(data => {
        var string = JSON.stringify(data);
        var obj = JSON.parse(string);
        voltArray.push(obj.volt);
        progressArray.push(obj.progress)
        console.log('test');
        
      });
      console.log(voltArray)
      console.log(progressArray)
      res.render('machine_show', objToPass);

      // var string = JSON.stringify(machineDbData[0]);
      // var obj = JSON.parse(string);
      // voltArray.push(obj.volt);
      // console.log('test');
      // console.log(voltArray);
      // res.render('machine_show', objToPass);
    }
  });

  // res.render(
  //   'machine_show',
  //   MachineData.find().then(machineDbData =>
  //     JSON.stringify({ success: true, machineDbData: machineDbData })
  //   )
  // );
});

router.post('/machines', function(req, res) {
  var volt = req.body.volt;
  var progress = req.body.progress;

  newData = {
    volt: volt,
    active: 1,
    progress: progress,
    machineId: 1
  };

  // CREATING A NEW DATA ENTRY AND SAVING IT TO DB
  new MachineData(newData).save().then(data => {
    // TRIGGER PUSHER TO UPDATE CLIENT PAGE
    channels_client.trigger('machine-1-channel', 'machine-1-sync', {
      volt: parseInt(data.volt),
      active: parseInt(data.active),
      progress: parseInt(data.progress), //convert string to int using parseInt()
      machineId: parseInt(data.machineId)
    });
    // CLIENT LOG
    console.log('Machine 1 Server Synced. \n=================');
    return res.json({ success: true, message: 'Machine 1 Synced.' });
  });
});

module.exports = router;
