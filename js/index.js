// Channel name of the streamer.
var channel = "";
// Word chosen by streamer to draw.
var wordToDraw = "";
// Word chosen represented as an array.
var wordArray = null;
// Holds order of letters to be revealed as hints.
var hintOrder = null;
// Holds hint.
var hintText = "";
// Instantiate client.
const { api, chat } = new TwitchJs({log: { enabled: false, clientId: "49umig77cr4nifzsl6tno3bb3w44n3" }});
// Amount of seconds user has left to draw.
var seconds = 0;
// Initialize counter to null so countdown doesn't happen at page load.
var counter = null;
// Element holding the amount of time left.
var timerTxt = null;
// Element holding messages sent in the streamer's chat.
var chatBubble = null;
// Username of chatter who guseed corectly.
var winnerName = "";

/**
 * Check if the channel name is empty.
 * Open a window with choices to draw if a channel is provided.
 * 
 * @param {string} channelName The name of the streamer's channel.
 */
function verifyChannel(channelName) {
  if (channelName == "") {
    alert("Please enter a channel name.");
  } else {
    // Disable the start button if channel name passes.
    document.getElementById("startButton").disabled = true;
    channel = channelName;
    window.open('wordWindow.html');
  }
}

/**
 * Starts the game by connecting to the streamer's chat and
 * starting a 30 (changeable) second timer.
 * 
 * @param {string} chosenWord The word chosen from the new tab.
 */
function startGame(chosenWord) {
  // Convert chosenWord to lowercase to simplify comparison with guesses and sanitize.
  wordToDraw = DOMPurify.sanitize(chosenWord.toLowerCase());
  // Turn the chosen word into an array.
  wordArray = wordToDraw.split();
  // Temporarily hold length of word so it doesn't need to be calculated multiple times.
  var wordLen = chosenWord.length;
  // Randomize an array of indicies to determine order of letters revealed as hints.
  hintOrder = _.sample(_.range(wordLen), wordLen);
  // Initialize the hint text to (wordLen * "_")
  hintText = _.range(wordLen).map(function () { return '_' });
  document.getElementById("blankSpaces").innerHTML = hintText.join(" ");
  // Start the timer after a word is chosen. Round length can be modified by passing a different argument. 
  startTimer(30);
  // Clear the canvas at the start of every round.
  clearDrawing();
  chatBubble = document.getElementById("chatEntered");
  const handleMessage = message => {
    // Sanitize messages to avoid XSS attacks.
    var cleanMessage = DOMPurify.sanitize(message.message);
    // Trim messages to 140 characters to avoid chat bubble being too large.
    chatBubble.innerHTML = cleanMessage.substring(0, 140);
    // Compare message with chosen word to see if the game should end.
    if (cleanMessage.toLowerCase() == wordToDraw) {
      clearInterval(counter);
      winnerName = message.username;
      endGame(1);
    }
  };

  // Listen for user-sent messages.
  chat.on('PRIVMSG', handleMessage);

  // Connect ...
  chat.connect().then(() => {
    // ... and then join the channel.
    chat.join(channel);
  });
}

/**
 * Pops up a modal containing the result of the game.
 * 
 * @param {number} result Value determines if anyone guessed the drawing correctly.
 */
function endGame(result) {
  // Stop timer.
  clearInterval(counter);
  // Re-enable the start button once the game ends.
  document.getElementById("startButton").disabled = false;
  // Live messages no longer needed, close connection with the Twitch chat.
  chat.disconnect();
  var modal = document.getElementById("resultModal");
  modal.style.display = "block";
  // Close the modal if the x button is clicked.
  document.getElementById("close").onclick = function () {
    modal.style.display = "none";
  }
  // Reveal the entire word at the end of the round.
  document.getElementById("blankSpaces").innerHTML = wordToDraw.split('').join(' ');
  // No winner.
  if (result == 0) {
    // Overwrite last message before game ends to stop inappropriate messages from persisting. Taunt with a giggling peepo.
    chatBubble.innerHTML = "peepoGiggles";
    document.getElementById("resultText").innerHTML = "No one guessed it correctly!<br>" + channel + " was drawing: <b>" + wordToDraw + "</b>";
  }
  // Winner found.
  else {
    // Overwrite last message before game ends to stop inappropriate messages from persisting. Cheer with a happy peepo.
    chatBubble.innerHTML = "HYPERS";
    document.getElementById("resultText").innerHTML = winnerName + " guessed it correctly in " + (30 - seconds) +" second(s)!<br>" + channel + " was drawing: <b>" + wordToDraw + "</b>";
  }
}


/**
 * Creates a setInterval that can be stopped later (Run out of time / word guessed).
 * 
 * @param {number} time Number of seconds per round.
 */
function startTimer(time) {
  // Reset timer for new game.
  seconds = time;
  // Identify timer text.
  timerTxt = document.querySelector('#timer');
  // Start the countdown and label it counter so it can be stopped with clearInterval.
  counter = setInterval(timer, 1000);
}

/**
 * Preform countdown.
 */
function timer() {
  // setInterval initialized with 1000ms so decrement time by a second during each call.
  seconds -= 1;
  // Case where time runs out.
  if (seconds == -1) {
    endGame(0);
  }
  // If the counter passes zero for some reason, end the timer.
  else if (seconds < -1) {
    clearInterval(counter);
  }
  // Format timer text while game is ongoing.
  // Provide leading 0 for time less than 10 seconds.
  else if (seconds < 10) {
    timerTxt.innerHTML = "00:0" + seconds;
  }
  else {
    timerTxt.innerHTML = "00:" + seconds;
  }

  // Reveal around half of the letters during the last 15 seconds of the round.
  if (seconds < 15 && seconds % Math.floor(15 / (wordToDraw.length / 2)) == 0) {
    // Retrieve random index of letter to reveal.
    var letter = wordToDraw[hintOrder[0]];
    // Keep spaces as underlines to make the hint easier to read.
    if (letter != " ") {
      hintText[hintOrder[0]] = wordToDraw[hintOrder[0]];
    }
    document.getElementById("blankSpaces").innerHTML = hintText.join(" ");
    // Shift random indicies to get next value as first element.
    hintOrder.shift();
  }
}