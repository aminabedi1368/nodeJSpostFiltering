var jsonfile = require('jsonfile')
var Spamist = require('./lib/Spamist')
var bayes = require('./lib/bayes')
var jayson = require('jayson');
var http = require('http');
var connect = require('connect');
var regexp = require('node-regexp');
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
var t = 65
var do_clean= false
var revivedClassifier
var filter
var stateJson
var lPhase = false
var fs = require('fs');
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
		  "do_clean": do_clean,
		  "cleaning_options": cleaning_options
		}
	}
	if (lPhase)
	{
		var messages = mynet.readtext('joke')
		filter = mynet.train(messages,options)
		console.log(mynet)
		stateJson = filter.toJson()
		revivedClassifier = bayes.fromJson(stateJson)
		
	}
	else{
		
		var x = require("./data.json")
		// load the spamfilter back from its JSON representation.
		revivedClassifier = bayes.fromJson(x)
	}

console.log("start server")
var server = jayson.server({
  categorize: function(args, callback) {
	var result=null
	if(args[2]!=null)
	{
		if(typeof args[2]== "number")
		{
			t=args[2]
			console.log(" threashold change with " , t)
			
			//result=result+" threashold change with " + t
			//callback(null, result2);
		}
	}
	 //console.log("start server")  
	if(args[0]!=null)
	{
		domain=null
		filterlink=null
		post=args[0]
		
		var re = regexp()
		  .must('http')
		  .maybe('s')
		  .must('://')
		  .maybe('WWW.')
		  .somethingBut(regexp.space)
		  .ignoreCase()
		  .toRegExp()
		  if(re.test(post))
			{
				if (post.indexOf("://") > -1) {
					domain = post.split('/')[2];
				}
				else {
					domain = post.split('/')[0];
				}

				//find & remove port number
				domain = domain.split(':')[0];
				//console.log("domain",domain)
				domain = domain.replace(/#|_|\ـ|-|'|]|\[|\*|\+|\,|\!|\&|\%|\$|\#|\?|\.|\'|\/|\@|\(|\)|\^/g,'');
				domain = domain.replace(/#| a | an | and | or /g,' ');
				domain = domain.toLowerCase()
				t=55
				filterlink=mynet.classify(domain,revivedClassifier,t)
			}
			//console.log("filterlink",filterlink)
		if(filterlink=="spam")
		{
			result="spam"
		}
		else{
		post = post.replace(/#|_|\ـ|-|'|]|\[|\*|\+|\,|\!|\&|\%|\$|\#|\?|\.|\'|\/|\@|\(|\)|\^/g,'');
		post = post.replace(/#| a | an | and | or /g,' ');
		post = post.toLowerCase()
		console.log(post , "threashold: ", t)
		result = mynet.classify(post,revivedClassifier,t)
		}
		
	}
	
	if(args[1]!=null)
	{
		//console.log(args[1])
		learnOnfly=args[1]	
		learning(learnOnfly)
		result=result+" learning post save on file "
	}
	
	
	if(args[3]!=null)
	{
		if(typeof args[3]== "boolean")
		{
			result="start new learning"
			callback(null, result);
			//console.log(args[3])
			options.cleaning.do_clean=args[3]
			console.log(options)
			var messages = mynet.readtext('joke')
			filter = mynet.train(messages,options)
			console.log(mynet)
			stateJson = filter.toJson()		
			revivedClassifier = bayes.fromJson(stateJson)
			
		}
	}
	console.log(post)
	console.log(result)
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

function learning(learnOnfly)
{
	var messages = learnOnfly
	messages = messages.replace(/\n/g, " ");
    messages = messages.toLowerCase()
	messages = messages+'\n'
	var file= "./resource/joke"
	fs.appendFile(file,messages, function (err) {
	});
}