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
      var newPostKey = firebase.database().ref().child('text').push().key;

      var updates = {};
      updates['/text/' + newPostKey] = text;
      return firebase.database().ref('classes/'+classId).update(updates);
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
