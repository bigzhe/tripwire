// var request = require('request');
var request = require('sync-request');
var csv = require("fast-csv");


var headersOpt = {
  "content-type": "application/json"
};

const tuples = []
csv
  .fromPath("test_cases/data.csv")
  .on("data", function (tuple) {
    tuples.push(tuple)
    // const data = {
    //   user: tuple[0],
    //   date: tuple[1],
    //   device: tuple[2],
    //   content: tuple[3]
    // }
    // request({
    //   method: 'post',
    //   url: 'http://localhost:3000/api/logs',
    //   form: data,
    //   headers: headersOpt,
    //   json: true
    // }, function (error, response, body) {
    //   //Print the Response
    //   console.log(body);
    // });
  })
  .on("end", function () {
    for (var i = 0; i < 10000; i++) {
      var tuple = tuples[i];
      const data = {
        user: tuple[0],
        date: tuple[1],
        device: tuple[2],
        content: tuple[3]
      }
      console.log(tuple)
      // request({
      //   method: 'post',
      //   url: 'http://localhost:3000/api/logs',
      //   form: data,
      //   headers: headersOpt,
      //   json: true
      // }, function (error, response, body) {
      //   //Print the Response
      //   console.log(body);
      // });
      request('POST', 'http://localhost:3000/api/logs', {json: data})
    }
  });

