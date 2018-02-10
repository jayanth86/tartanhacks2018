
  recognizer = null;
  function Initialize(onComplete){
    if(!!window.SDK){
        console.log("error");
    }
  }

  subscriptionKey = '4bcb01f1ad104b659986942a5cfe4e3c';
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
        hypothesisDiv.innerHTML += text + " ";
        append2("1234", hypothesisDiv.innerHTML)
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

  database.ref('/classes/1234/list').on('value', function(snapshot){
    onQuestionUpdate(snapshot);
  });
  
  function onQuestionUpdate(snapshot){
      console.log(snapshot);
  }
  
  function askQuestion(slide, question){
    database.ref('/classes/1234/list/').transaction(function(post){
        if(post){
            post = post + ';['+slide+'~'+question + ']';
        }
        console.log("Question asked");
        return post;
    });
  }

  function onTextUpdate(snapshot){
    hypothesisDiv = document.getElementById("text1");
    if(hypothesisDiv)
      hypothesisDiv.innerHTML = snapshot.val();
      console.log(snapshot.val())
  }

  append2("1234", "lmfao");
  if(document.getElementById("test")){
    Initialize(function (speechSdk) {
        SDK = speechSdk;
    });
    Setup();
    RecognizerStart(SDK, recognizer);
  }else{
    database.ref('classes/'+'1234').child('text').on('value', function(snapshot){
      onTextUpdate(snapshot);
    });
  }
