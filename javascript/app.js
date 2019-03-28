// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate how many minutes until train arrival
//    Then use moment.js formatting to set difference in months.
// 5. Calculate time until arrival



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD6TcbyxN1hMiEKX2IfjTpG4SwIpzBhlHQ",
    authDomain: "train-schedule-a251f.firebaseapp.com",
    databaseURL: "https://train-schedule-a251f.firebaseio.com",
    projectId: "train-schedule-a251f",
    storageBucket: "train-schedule-a251f.appspot.com",
    messagingSenderId: "24712311688"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // 2. Button for adding Trains
$(".add-train-btn").on("click", function(event) {
    event.preventDefault();

      // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = $("#start-input").val().trim();
  var trainFreq = $("#freq-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFreq,
      };

// Uploads train data to the database
  database.ref().push(newTrain);

   // Logs everything to console
   console.log(newTrain.name);
   console.log(newTrain.destination);
   console.log(newTrain.start);
   console.log(newTrain.frequency);

   alert("Train successfully added");

   // Clears all of the text-boxes
   $("#train-name-input").val("");
   $("#destination-input").val("");
   $("#start-input").val("");
   $("#freq-input").val("");
 });

 // 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

// Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStart);
  console.log(trainFreq);

   // Prettify the train start
   var trainStartPretty = moment(trainStart, "HH:mm").subtract(1, "years");


   // Calculate time until arrival
  var trainTime = moment().diff(moment(trainStartPretty, "H"), "hours");
  console.log(trainTime);
  var diffTime = moment().diff(moment(trainStartPretty), "minutes");
  var tRemainder = diffTime % trainFreq;

  var tMinutesTillTrain = trainFreq - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(moment(trainStartPretty).format('hh:mm A')),
        $("<td>").text(trainFreq),
        $("<td>").text(tMinutesTillTrain),
      );
    
    // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});