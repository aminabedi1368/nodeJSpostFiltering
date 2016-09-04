module.exports = function () {
  return new Spamist()
}


var STATE_KEYS = module.exports.STATE_KEYS = [
  'falsePosetive', 'uniqueCleanedRate', 'totalError'
];
//=======================
//=======================
//=======================

var xxx = 0
var bayes = require('../lib/bayes')
var fs = require('fs');

function Spamist() {

  this.falsePosetive = 0      // hams that classified as spam
  this.uniqueCleanedRate = 0  // percentage of uniquewords cleaned
  this.totalError = 0         // total test error

}



Spamist.prototype.readtext = function (text) {

			//////////////// get spam post from json file////////////////////////////
			var obj = JSON.parse(fs.readFileSync("./resource/anar_abuse_contents.json"));

			var contents=[]
			//console.log(obj["content"]);
			var jsonData=obj
			var j =1
			for(var i in jsonData){
				var key = i
				var val = jsonData[i]
				contents[j]=val['content']
				contents[j] = contents[j].replace(/#|_|\ـ|-|'|]|\[|\*|\+|\,|\!|\&|\%|\$|\#|\?|\.|\'|\/|\@|\(|\)|\^/g,'');
				contents[j] = contents[j].replace(/#| a | an | and | or /g,' ');
				contents[j] = contents[j].toLowerCase()
				contents[j] = "spam	" + contents[j]
				
				j++
				//console.log(val['content']);
			}
			
			//////////////// get real post from json file////////////////////////////
			var obj_ham = JSON.parse(fs.readFileSync("./resource/anar_real_contents.json"));

			var contents_ham=[]
			//console.log(obj["content"]);
			var jsonData_ham=obj_ham
			var j =1
			for(var i in jsonData){
				var key_ham = i
				var val_ham = jsonData_ham[i]
				contents_ham[j]=val_ham['content']
				contents_ham[j] = contents_ham[j].replace(/#|_|\ـ|-|'|]|\[|\*|\+|\,|\!|\&|\%|\$|\#|\?|\.|\'|\/|\@|\(|\)|\^/g,'');
				contents_ham[j] = contents_ham[j].replace(/#| a | an | and | or /g,' ');
				contents_ham[j] = contents_ham[j].toLowerCase()
				contents_ham[j] = "ham	" + contents_ham[j]
				
				j++
				//console.log(val['content']);
			}

//console.log(contents_ham)
			//////////////// get other catagory post from json file////////////////////////////
			var adress= "./resource/"+text
			 var contents1 = fs.readFileSync(adress,'utf8')
			  contents1 = contents1.replace(/#|_|\ـ|-|'|]|\[|\*|\+|\,|\!|\&|\%|\$|\#|\?|\.|\'|\/|\@|\(|\)|\^/g,'');
			  contents1 = contents1.replace(/#| a | an | and | or /g,' ');
			  contents1 = contents1.toLowerCase()
  
  
			  var messages = contents1.split("\n")
			  var messages = messages.concat(contents);
				  messages = messages.concat(contents_ham);
			 // messages= contents+messages
			  //console.log(messages)
			  for (m_ind in messages)
			  {
				if (messages[m_ind].length < 2)
				{
				  var b = messages.splice(m_ind,1)
				}
			  }
			  return messages
			}

function shuffle(a)
{
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a
}

function getLable(messages) {
  var lables = []
  var sms = []
  for (m_ind in messages)
  {
	  if (typeof messages[m_ind] !== 'undefined')
	{
	 
		lable_sms = messages[m_ind].split("\t")
		if (lable_sms[0] == 'ham')
		{
		  lables[m_ind] = 'ham'
		  sms[m_ind] = messages[m_ind].replace("ham\t","")
		}
		if (lable_sms[0] == 'spam')
		{
		  lables[m_ind] = 'spam'
		  sms[m_ind] = messages[m_ind].replace("spam\t","")
		}
	}
  }
  var output = [sms, lables]

  return output
}




function text_cleaner(messages,options){

  // ========== OPTIONS =============
  /*
  var options = {
    "need_histo": true/false,
    "need_neutral": true/false,
    "need_length": true/false,
    "neutral_population_ratio": (the higher, less the cleaning will be)
    "neutral difference": (the higher, more cleaning will be)
  }
  */

  // --- elicit lable vector ---
  var messages_lables = getLable(messages)
  var sms = messages_lables[0]
  var lables = messages_lables[1]

  var need_histo = options.need_histo
    , need_neutral = options.need_neutral
    , need_length = options.need_length
  var neutral_population_ratio = options.neutral_population_ratio
    , neutral_difference = options.neutral_difference

  var tempfilter = bayes()
  for (m_ind in messages)
  {
    tempfilter.learn(sms[m_ind],lables[m_ind])
  }
  
  var uniquewords = Object.keys(tempfilter.vocabulary)
  
  var spamwords = tempfilter.wordFrequencyCount['spam']
  var hamwords = tempfilter.wordFrequencyCount['ham']
  var histo = []
  var spamity = []
  for (uni_ind in uniquewords)
  {
    var isSpam = spamwords[uniquewords[uni_ind]]
    var isHam = hamwords[uniquewords[uni_ind]]
    if (isSpam == undefined)
    {
      isSpam = 0
    }
    if (isHam == undefined)
    {
      isHam = 0
    }
    histo[uni_ind] = isSpam + isHam
    spamity[uni_ind] = isSpam / histo[uni_ind]
  }
  
  var before = uniquewords.length
  var spam_percentage = tempfilter.docCount.spam / (tempfilter.docCount.spam + tempfilter.docCount.ham)
  var max = Math.max(...histo)
  var junk = []
  for (var uni_ind = uniquewords.length,i = 0; uni_ind >= 0; uni_ind--)
  {
    var histo_check = histo[uni_ind] == 1
    var neutral_check = (histo[uni_ind]>max*neutral_population_ratio & 
      Math.abs(spamity[uni_ind]-(spam_percentage))<neutral_difference )
    var length_check = uniquewords.length < 2
    if ((need_histo&histo_check) == true || (need_neutral&neutral_check) == true || (need_length&length_check) == true )
    {
      junk[i] = uniquewords[uni_ind]
      i++
      uniquewords.splice(uni_ind,1)
      histo.splice(uni_ind,1)
      spamity.splice(uni_ind,1)
    }
  }
  var after = uniquewords.length

  xxx = 100*(before-after)/before

  for (m_ind in sms)
  {
    for (j in junk)
    {
      sms[m_ind] = sms[m_ind].replace(' '+junk[j]+' ',' ')
      var a = sms[m_ind].length-1-junk[j].length
      var b = sms[m_ind].length
      if (sms[m_ind].substring(a,b) == ' '+junk[j])
      {
        sms[m_ind] = sms[m_ind].replace(' '+junk[j],'')
      }
      if (sms[m_ind].substring(0,junk[j].length+1) == junk[j]+' ')
      {
        sms[m_ind] = sms[m_ind].replace(junk[j]+' ','')
      }
    }
    // --- concatenation ---
    messages[m_ind] = lables[m_ind] + '\t' + sms[m_ind]
  }
  return messages
}


Spamist.prototype.train = function (messages,options) {

  // ========== OPTIONS =============
  /*
  var options = {
    "calc_error": {
      "do_calc": true/false,
      "iteration": iter
      "train_ratio": trn_tst_ratio
      "threshold": threshold
    },
    "cleaning" = {
      "do_clean": true/false,
      "cleaning_options": cleaning_options
    }
  }
  */
  var do_clean = options.cleaning.do_clean
    , do_calc = options.calc_error.do_calc

  // --- text cleaning ---
  if (do_clean)
  {
    messages = text_cleaner(messages,options.cleaning.cleaning_options)
  }

  if (do_calc)
  {
    var error_tst_it = []
    var fpos_it = []
    var iter = options.calc_error.iteration
    var threshold = options.calc_error.threshold
    for (var iteration = 0; iteration < iter; iteration ++)
    {
      var classifier = bayes()

      // --- shuffle and split ---
      var messages = shuffle(messages)

      // --- elicit lable vector ---
      var messages_lables = getLable(messages)
      var sms = messages_lables[0]
      var lables = messages_lables[1]

      // --- split for train/test ---
      var trn_number = Math.floor(messages.length * options.calc_error.train_ratio)
      var tst_number = trn_number + 1

      // --- learning process ---
      for (var m_ind = 0; m_ind <= trn_number; m_ind ++)
      {
        classifier.learn(sms[m_ind], lables[m_ind])
      }

      // --- 6. calculating test error ---
      error_tst_it[iteration] = 0
      fpos_it[iteration] = 0
      for (var m_ind = tst_number; m_ind < messages.length; m_ind ++)
      {
        if (classifier.categorize(sms[m_ind],threshold) !== lables[m_ind])
        {
          error_tst_it[iteration] ++
          if (lables[m_ind] == 'ham')
          {
            fpos_it[iteration] ++
          }
        }
      }
      fpos_it[iteration] = 100 * fpos_it[iteration] / error_tst_it[iteration]
      error_tst_it[iteration] =  100 * error_tst_it[iteration]/(messages.length-tst_number)
    }

    var sum_tst = 0
    var sum_fpos = 0
    for (var iteration = 0; iteration < iter; iteration ++)
    {
      sum_tst += error_tst_it[iteration]
      sum_fpos += fpos_it[iteration]

    }
    this.falsePosetive = sum_fpos/iter
    this.totalError = sum_tst/iter
    this.uniqueCleanedRate = xxx
  }
  // --- main learning process ---
  var messages_lables = getLable(messages)
  var sms = messages_lables[0]
  var lables = messages_lables[1]

  var classifier = bayes()
  for (m_ind in messages)
  {
    classifier.learn(sms[m_ind], lables[m_ind])
  }

  return classifier
}

Spamist.prototype.classify = function (sms,classifier,threshold) {
  var result = classifier.categorize(sms,threshold)
  return result
}