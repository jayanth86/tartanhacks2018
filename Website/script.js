
  recognizer = null;
  currentSlide = 1;
  textNo = 0;
  var token = '';

  var translate = "en";

  function Initialize(onComplete){
    if(!!window.SDK){
        console.log("error");
    }
  }

  subscriptionKey = '4bcb01f1ad104b659986942a5cfe4e3c';
  translatorKey = '31c12adc1b544812963e39687575170d'
  hypothesisDiv = document.getElementById("text1");

  function RecognizerSetup(SDK, recognitionMode, language, format, subKey){
    recognitionMode = SDK.RecognitionMode.Dictation;
    var recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode,
        language, // Supported languages are specific to each recognition mode. Refer to docs.
        format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)
    var useTokenAuth = false;
    
    var authentication = function() {
        if (!useTokenAuth)
            return new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);
        var callback = function() {
            var tokenDeferral = new SDK.Deferred();
            try {
                var xhr = new(XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                xhr.open('GET', '/token', 1);
                xhr.onload = function () {
                    if (xhr.status === 200)  {
                        tokenDeferral.Resolve(xhr.responseText);
                    } else {
                        tokenDeferral.Reject('Issue token request failed.');
                    }
                };
                xhr.send();
            } catch (e) {
                window.console && console.log(e);
                tokenDeferral.Reject(e.message);
            }
            return tokenDeferral.Promise();
        }
        return new SDK.CognitiveTokenAuthentication(callback, callback);
    }();
    return SDK.CreateRecognizer(recognizerConfig, authentication);
  }

  function RecognizerStop(SDK, recognizer) {
      // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
      recognizer.AudioSource.TurnOff();
  }


  function RecognizerStart(SDK, recognizer) {
    recognizer.Recognize((event) => {
        /*
         Alternative syntax for typescript devs.
         if (event instanceof SDK.RecognitionTriggeredEvent)
        */
        switch (event.Name) {
            case "RecognitionTriggeredEvent" :
                UpdateStatus("Initializing");
                break;
            case "ListeningStartedEvent" :
                UpdateStatus("Listening");
                break;
            case "RecognitionStartedEvent" :
                UpdateStatus("Listening_Recognizing");
                break;
            case "SpeechStartDetectedEvent" :
                UpdateStatus("Listening_DetectedSpeech_Recognizing");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechHypothesisEvent" :
                UpdateRecognizedHypothesis(event.Result.Text, false);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechFragmentEvent" :
                UpdateRecognizedHypothesis(event.Result.Text, true);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechEndDetectedEvent" :
                OnSpeechEndDetected();
                UpdateStatus("Processing_Adding_Final_Touches");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechSimplePhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "SpeechDetailedPhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "RecognitionEndedEvent" :
                OnComplete();
                UpdateStatus("Idle");
                console.log(JSON.stringify(event)); // Debug information
                break;
            default:
                console.log(JSON.stringify(event)); // Debug information
        }
    })
      .On(() => {
          // The request succeeded. Nothing to do here.
      },
      (error) => {
          console.error(error);
      });
  }

  function UpdateStatus(status) {
    console.log(status);
  }

  function UpdateRecognizedHypothesis(text, append) {
        hypothesisDiv = document.getElementById("text1");
        //hypothesisDiv.innerHTML += text + " ";
        append2("1234", text)
    //var length = hypothesisDiv.innerHTML.length;
    /*if (length > 403) {
        hypothesisDiv.innerHTML = "..." + hypothesisDiv.innerHTML.substr(length-400, length);
    }*/
  }
  function OnSpeechEndDetected() {
    console.log("speech done");
  }
  function UpdateRecognizedPhrase(json) {
      /*hypothesisDiv.innerHTML = "";
      phraseDiv.innerHTML += json + "\n";
      console.log("finished")
      //append(json);*/
      console.log("phrase " + json);
  }
  function OnComplete() {
      /*startBtn.disabled = false;
      stopBtn.disabled = true;*/
      console.log("finished")
  }

  function Setup() {
    if (recognizer != null) {
        RecognizerStop(SDK, recognizer);
    }
    recognizer = RecognizerSetup(SDK, 'recognitionMode.value', 'en-US', SDK.SpeechResultFormat['Simple'], 
      subscriptionKey);
  }


  var config = {
    apiKey: "AIzaSyCnxiZJnOi4ZoRdZxorHOgZSmk-TkFGQVw",
    authDomain: "intellect-fddd0.firebaseapp.com",
    databaseURL: "https://intellect-fddd0.firebaseio.com",
    projectId: "intellect-fddd0",
    storageBucket: "",
    messagingSenderId: "111240858067"
  };
  firebase.initializeApp(config);

  text = "lmao"
  var database = firebase.database();

  function append2(classId, text){
      newPostKey = firebase.database().ref('classes/'+classId).child('text').set(text);
      console.log("appending " + text);
  }

  /*database.ref('/classes/1234/list/').on('value', function(snapshot){
    onQuestionUpdate(snapshot, textNo);
  });
  
  function onQuestionUpdate(snapshot, tNo){
      if(tNo == 0){
        tNo = 1;
      }
      var el = document.getElementById("questions"+(tNo));
      if(!el){
        console.log("not there");
        return;
      }
      var arr = snapshot.val().split(";");
      el.innerHTML = "";
      for(var i = 0;i < arr.length;i++){
        el.innerHTML = el.innerHTML + " " + arr[i] + "\n";
      }
  }*/

  function getQuestions(idNo, elem){
    database.ref('/classes/1234/questions/'+idNo).once('value').then(
      function(snappy){
        arr = snappy.val().split(';');
        for(var i = 0;i < arr.length;i++){
          elem.push(arr[i]);
        }
        
      });
  }

  //database.ref('/classes/1234/list/').set("");
  function askQuestion(slide, question){
    database.ref('/classes/1234/list/').transaction(function(post){
        slide = currentSlide;
        if(post){
            if(post.length == 0){
              post = question;
            }else{
              console.log("lmao");
              post = post + ';' + question;
            }
        }
        console.log("Question asked");
        console.log(post);
        return post;
    });
  }

  function onTextUpdate(snapshot){
    hypothesisDiv = document.getElementById("text"+textNo);
    console.log("TRANSLATE IS " + translate);
    if(hypothesisDiv){
      hypothesisDiv.innerHTML = hypothesisDiv.innerHTML + snapshot.val() + " ";
      if(translate != "en"){
        translateTheShit(hypothesisDiv.innerHTML, "en", translate, hypothesisDiv);
        console.log("1");
      }else{
        //hypothesisDiv.innerHTML = snapshot.val();
        if(impterms.length != 0){
          hilite(impterms);
        }
        console.log("2");
      }
      console.log(snapshot.val())
    }
  }

  function addQuestion(snapshot)
  {
    makeQCard(snapshot);
  }


  function setVal(s)
  {
    database.ref('/classes/1234/currentQ/').set(s);
  }
  
  function onSlideChange(snapshot){
    //currentSlide = parseInt(snapshot.val());
    currentSlide = parseInt(snapshot.val());
    if(textNo == 0){
      textNo = 1;
      makeCard(currentSlide, textNo);
      return;
    }
    textNo++;
    stuff = database.ref('/classes/1234/list').once('value').then(function(snappy){
      database.ref('/classes/1234/questions/'+textNo).set(snappy.val());
     // database.ref('/classes/1234/text').set("");
     console.log('/classes/1234/questions/'+textNo)
     makeCard(currentSlide, textNo);
    currentSlide = parseInt(snapshot.val());
    database.ref('/classes/1234/text').set("");
    database.ref('/classes/1234/list').set("");
    });
  }

  function changeLang(text){
    last = translate;
    translate = text;
    translateEverything(last, translate);
  }

  function translateEverything(from, to){
    for(var i = 1; i <= textNo; i++){
      stuff = document.getElementById("text"+i);
      translateTheShit(stuff.innerHTML, from, to, stuff);
    }
  }

  function getToken(){
    url2 = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken?Subscription-Key='
    +translatorKey;
    $.ajax({
      url: url2,
      data: '',
      type: 'POST',
      success: function(data){
        console.log('Data ' +data);
        token = data;
      },
      error: function(){
        alert("error");
      },
      async: false
    });
    return true;
  }

  function translateTheShit(text, from, to, gay){
    //getToken();
    console.log("TRANSLATING " + text);
    url2 = 'https://api.microsofttranslator.com/V2/Http.svc/Translate?text=' + text
    + '&from='+from+'&to=' + to + '&Ocp-Apim-Subscription-Key=' + translatorKey +
    '&appId=Bearer%20' + token;
    console.log(url2);
    $.ajax({
      url: url2,
      data: "",
      type: 'GET',
      success: function(data){
        console.log('TRANSLATED '+data.children[0].innerHTML);
        gay.innerHTML = data.children[0].innerHTML;
        if(impterms.length != 0){
          hilite(impterms);
        }
      },
      error: function(){
        getToken();
        //alert("not working");
        return translateTheShit(text, from, to, gay);
      },
      async: false
    });
  }

  function makeQCard(q)
  {
    var str = q.val();
    console.log(q)
    var html =  `<div class="row">
                    <!-- Column -->
                    <div class="col-sm-6">
                        <div class="card">
                            <div class="card-block">` + str + `
                            </div>
                        </div>
                    </div>
                    <!-- Column -->
                    <!-- Column -->
                </div> 
    `
    $('#boxthing2').append(html);
  }



  function makeCard(imgnum, cardnum)
{
  // imgnum = 2;
  // cardnum = 2;
    count++;
    if (imgnum < 10)
    {
      ans = 'Slide0' + imgnum;
    }
    else
    {
      ans = 'Slide' + imgnum;
    }

    var html = `
    <div class="row">
                    <!-- Column -->
                    <div class="col-sm-6">
                        <div class="card">
                            <div class="card-block" id="text`+cardnum+`">

                            </div>
                        </div>
                    </div>
                    <!-- Column -->
                    <!-- Column -->
                    <div class="col-sm-6">
                        <div class="card">
                            <div class="card-block" id="slide`+cardnum+`">
                                <img id ="img`+imgnum+`" style="width:100%;" src = "assets/images/Inbios Presentation/` +ans+ `.jpg"></img>
                                    <div style = "padding-top: 1%;"></div>
                                <textarea id ="questions`+cardnum+`" style="display: none;"> </textarea>
                                <div id="special`+cardnum+`">
                                `

    + seenQuesForCountId[0] +

                                `
                                </div>
                          <a id="`+cardnum+`" onclick = "clickAskQ(this.id)" style = "display: flex; justify-content: center;" class="btn hidden-sm-down btn-info">Ask a Question Here</a>
                                    <div style="padding-top: 1%;"> </div>




                          <a id="SeeQ`+cardnum+`" onclick = "clickSeeQ(this.id)" style = "display: flex; justify-content: center;" class="btn hidden-sm-down btn-info">See Questions</a>
                                    <div style="padding-top: 1%;"> </div>







                                <a id="BackSeeQ`+cardnum+`" onclick = "clickBackAfterSeeQ(this.id)" style = "display: none" class="btn hidden-sm-down btn-info">Back</a>
                                <div id="divCheckbox`+cardnum+`" style="display: none;">
                                    <form>
                                      Question:<br>
                                      <textarea id="textarea`+cardnum+`" style="width: 100%; height: 100px" id="msg" name="user_message"></textarea>
                                      <a id="Submit`+cardnum+`" onclick = "clickSubmitAfterAskQ(this.id)" class="btn hidden-sm-down btn-info" style='width:50%;'>Submit</a>
                                      <a id="Back`+cardnum+`" onclick = "clickBackAfterAskQ(this.id)" class="btn hidden-sm-down btn-info" style='width:49%;'>Back</a>
                                    </form>
                                </div>
                                <div id="didFind`+cardnum+`" style= "display:none;">
                                    <form>
                                      Did you find your Answer?<br>
                                      <a id="foundAns`+cardnum+`" onclick = "clickFoundAns(this.id)" class="btn hidden-sm-down btn-info" style='width:50%;'>Found it!</a>
                                      <a id="notFoundAns`+cardnum+`" onclick = "clickNotFoundAns(this.id)" class="btn hidden-sm-down btn-info" style='width:49%;'>Ask the Professor</a>
                                    </form>
                                </div>

                            </div>

                        </div>
                    </div>
                    <!-- Column -->
                </div>
    `
    $('#boxthing').append(html);
}

  database.ref('/classes/1234/slide/').on('value', function(snapshot){
    onSlideChange(snapshot)});

  database.ref('/classes/1234/currentQ/').on('value' , (function(snapshot) {addQuestion(snapshot)}));

  if(document.getElementById("test")){
    //append2("1234", "lmfao");
    Initialize(function (speechSdk) {
        SDK = speechSdk;
    });
    Setup();
    RecognizerStart(SDK, recognizer);
  }
    database.ref('classes/'+'1234/text').on('value', function(snapshot){
      onTextUpdate(snapshot);
  });
  //}

  //console.log(translateTheShit("hello", "fr"));
