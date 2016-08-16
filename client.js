var jayson = require('jayson');

var client = jayson.client.http({
  port: 3000
});
var post='Dear Matthew please call ham9ham6344ham45spam from a landline your complimentary 4 Lux Tenerife'
client.request('post', [post], function(err, error, result) {
  if(err) throw err;
  console.log(result);
});


post='What time you think youll have it Need to know when I should be near campus'
client.request('post', [post], function(err, error, result) {
  if(err) throw err;
  console.log(result); // 25
});



