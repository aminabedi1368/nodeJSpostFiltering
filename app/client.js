var jayson = require('jayson');

var client = jayson.client.http({
  port: 3000
});
var post='سلام بر همه'
client.request('categorize', [post], function(err, error, result) {
  if(err) throw err;
  console.log(result);
});


