var jayson = require('jayson');
////$credentials = "anarAppcategory:Fu4*;^6{%+CN*G#x";
var client = jayson.client.http({
  port: 3000
});
var post='چندتا دختر و پسر با شخصیت میخوام بیان تو گروهم اگه کسی هست بگه لینک بدم.. چرا کسی نمیاد ؟؟ یعنی همه گروه دارن؟'
client.request('categorize', [post], function(err, error, result) {
  if(err) throw err;
  console.log(result);
});


