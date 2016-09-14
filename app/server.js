var jsonfile = require('jsonfile')
var Spamist = require('./lib/Spamist')
var bayes = require('./lib/bayes')
var jayson = require('jayson');
var http = require('http');
var connect = require('connect');
var jsonParser = require('body-parser').json;
var app = connect();
// Authentication module.
var basicAuth = require('basic-auth-connect');
var post;
var learnOnfly;
var learnOtherCat;
var tempfilter = bayes()
var mynet = Spamist()
var enableloadfromjson= false
var t = 65.5



var messages = mynet.readtext('joke')


var cleaning_options = {
"need_histo": true,
"need_neutral": true,
"need_length": true,
"neutral_population_ratio": 0.2,
"neutral_difference": 0.05
}

var options = {
"calc_error": {
  "do_calc": true,
  "iteration": 10,
  "train_ratio": 0.8,
  "threshold": t
},
"cleaning" : {
  "do_clean": true,
  "cleaning_options": cleaning_options
}
}

var filter = mynet.train(messages,options)
console.log(mynet)


var stateJson = filter.toJson()

// load the spamfilter back from its JSON representation.

		if (enableloadfromjson == true)
		{
		var revivedClassifier = bayes.fromJson(stateJson)
		console.log(revivedClassifier)
		}



var server = jayson.server({
  categorize: function(args, callback) {
	//	console.log(post)
	//  console.log(callback.toString())  
	
	post=args[0]
	learnOnfly = args[2]
	learnOtherCat = args[3]
	enableloadfromjson=args[4]
		
//		if (learnOnfly != '')
//		{
		///////////////////////learn on the fly
//		var filter = mynet.train(learnOnfly,options)
//		console.log(mynet)
//		}
//		if (learnOtherCat != '')
//		{
		////////////////////// learn other catagory
//			var messages = mynet.readtext(learnOtherCat)
//			var filter = mynet.train(messages,options)
//			console.log(mynet)
//		} 
		
		
		
		if (enableloadfromjson == true)
		{
		var revivedClassifier = bayes.fromJson(stateJson)
		console.log(revivedClassifier)
		}
		
		
	var result = mynet.classify(post,filter,t)	//console.log(result)
	 // var result =classifier.categorize(post)
    callback(null, result);
  },

  
  ////////////////////////////////////////compare post===========
	  similarity: function(args, callback) {
		var oldpost = args[0]
	//	console.log(oldpost)
		
		var newpost = args[1]
	//	console.log(newpost)
		var textsimilarity = require('./similarity.js')
		var result =  textsimilarity(oldpost,newpost)
	//	console.log(result)
	  callback(null, result);
	  }
  });

// parse request body before the jayson middleware
app.use(jsonParser());
app.use(basicAuth(function(user, pass){
    return 'anarAppcategory' == user && 'Fu4*;^6{%+CN*G#x' == pass;
}))
app.use(server.middleware());
app.listen(3000);