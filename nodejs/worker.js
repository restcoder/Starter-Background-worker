"use strict";

const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URL);
const pg = require('pg');

pg.connect(process.env.POSTGRES_URL, function (err, client) {
  if (err) {
    throw err;
  }

  // NOTE: error and debug logging is not required
  function start() {
    client.query(`SELECT SUM(quantity) as sum FROM product;`, function (err, result) {
      if (err) {
        console.error('pg error', err.stack);
        return;
      }
      const row = result.rows[0];
      const sum = row.sum || 0;
      redisClient.set('sum', sum, function (err) {
        if (err) {
          console.error('redis error', err.stack);
        } else {
          console.log('set success', sum);
        }
      });
    });
  }

  start();
  setInterval(start, 1000);
});

console.log('READY');