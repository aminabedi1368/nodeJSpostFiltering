var jayson = require('jayson');
var post;
var http = require('http');
var connect = require('connect');
var jsonParser = require('body-parser').json;
var app = connect();
// Authentication module.
var basicAuth = require('basic-auth-connect');



var server = jayson.server({
  post: function(args, callback) {
	  post=args[0]
	  console.log(post)
	//  console.log(callback.toString())
	  var result =classifier.categorize(post)
    callback(null, result);
  }
});

// parse request body before the jayson middleware
app.use(jsonParser());
app.use(basicAuth(function(user, pass){
  return 'payam' == user && 'payam' == pass;
}))
app.use(server.middleware());
app.listen(3000);



function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a
}


var bayes = require('bayes')
var fs = require('fs');
var classifier = bayes()
var lables = []



var contents = fs.readFileSync('main', 'utf8');
contents = contents.replace(/#|_|-|'|]|\[|\*|\+|\,|\!|\&|\%|\$|\#|\?|\.|\'|\/|\@|\(|\)|\^/g,'');
contents = contents.replace(/#| a | an | and | or /g,' ');
contents = contents.toLowerCase()
var messages = contents.split("\n")
messages.splice(messages.length - 1)


// --- train test ---
messages = shuffle(messages)
var trn_number = Math.floor(messages.length * 0.75)
var tst_number = trn_number + 1

for (m_ind in messages)
{
	lable_sms = messages[m_ind].split("\t")
	if (lable_sms[0] == 'ham')
	{
		lables[m_ind] = 'general'
		messages[m_ind] = messages[m_ind].replace("ham\t","")
	}
	else
	{
		lables[m_ind] = 'filter'
		messages[m_ind] = messages[m_ind].replace("spam\t","")
	}
}


for (var m_ind = 0; m_ind <= trn_number; m_ind ++)
{
	classifier.learn(messages[m_ind], lables[m_ind])
}

// serialize the classifier's state as a JSON string.
var stateJson = classifier.toJson()

// load the classifier back from its JSON representation.
var revivedClassifier = bayes.fromJson(stateJson)
//console.log(revivedClassifier)


var error_trn = 0
for (var m_ind = 0; m_ind <= trn_number; m_ind ++)
{
	if (classifier.categorize(messages[m_ind]) !== lables[m_ind])
	{
		error_trn ++
	}
}

console.log("Train error percentage is: ")
console.log(100 * error_trn/(trn_number))



var error_tst = 0
for (var m_ind = tst_number; m_ind < messages.length; m_ind ++)
{
	if (classifier.categorize(messages[m_ind]) !== lables[m_ind])
	{
		error_tst ++
	}
}

//console.log("Test error percentage is: ")
//console.log(100 * error_tst/(messages.length-tst_number))
