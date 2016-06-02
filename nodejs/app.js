'use strict';


var express = require('express');
var app = express();
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URL);

app.get("/sum", function (req, res, next) {
  redisClient.get('sum', function (err, result) {
    if (err) {
      return next(err);
    }
    res.json({
      sum: result ? Number(result) : 0
    });
  });
});


app.listen(process.env.PORT, function () {
  console.log('READY');
});