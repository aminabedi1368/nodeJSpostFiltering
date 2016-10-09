var jayson = require('jayson');

var client = jayson.client.http({
  port: 3000
});
var post='spam\t در این زمانه پد \n\n مبیابرتد'
client.request('categorize', [post,,,true], function(err, error, result) {
  if(err) throw err;
  console.log(result);
});


