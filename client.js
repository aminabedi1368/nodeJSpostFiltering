var jayson = require('jayson');

var client = jayson.client.http({
  port: 3000
});
var post='چندتا دختر و پسر با شخصیت میخوام بیان تو گروهم اگه کسی هست بگه لینک بدم.. چرا کسی نمیاد ؟؟ یعنی همه گروه دارن؟'
client.request('post', [post], function(err, error, result) {
  if(err) throw err;
  console.log(result);
});


