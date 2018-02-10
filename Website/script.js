
  function Initialize(onComplete){
    if(!!window.SDK){
        console.log("error");
    }
  }

  function RecognizerSetup(SDK, recognitionMode, language, format, subKey){
    recognitionMode = SDK.RecognitionMode.Dictation;
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
    if (append) 
        hypothesisDiv.innerHTML += text + " ";
    else 
        hypothesisDiv.innerHTML = text;
    var length = hypothesisDiv.innerHTML.length;
    if (length > 403) {
        hypothesisDiv.innerHTML = "..." + hypothesisDiv.innerHTML.substr(length-400, length);
    }
  }
  function OnSpeechEndDetected() {
      stopBtn.disabled = true;
  }
  function UpdateRecognizedPhrase(json) {
      hypothesisDiv.innerHTML = "";
      phraseDiv.innerHTML += json + "\n";
  }
  function OnComplete() {
      startBtn.disabled = false;
      stopBtn.disabled = true;
  }

  function Setup() {
    if (recognizer != null) {
        RecognizerStop(SDK, recognizer);
    }
    recognizer = RecognizerSetup(SDK, recognitionMode.value, languageOptions.value, SDK.SpeechResultFormat[formatOptions.value], key.value);
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

  function append(classId, text){
      newPostKey = firebase.database().ref('classes/'+classId).child('text').set(text);
  }

  database.ref('/classes/1234/list').on('value', function(snapshot){
    onQuestionUpdate(snapshot);
  })
  
  function onQuestionUpdate(snapshot){
      console.log(snapshot);
  }
  
  function askQuestion(slide, question){
    database.ref('/classes/1234/list/').transaction(function(post){
        if(post){
            post = post + ';['+slide+'~'+question + ']';
        }
        return post;
    }); 
  }

  append("1234", "lmfao");
