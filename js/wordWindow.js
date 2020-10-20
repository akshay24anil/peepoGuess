// List of all words that could appear. This is a modified version of Google's Quick Draw list.
const wordList = ["airplane", "alarm", "ambulance", "angel", "ant", "anvil", "apple", "arm", "axe", "backpack", "banana", "bandage", "barn", "baseball", "baseball bat", "basket", "basketball", "bat", "bathtub", "beach", "bear", "beard", "bed", "bee", "belt", "bench", "bicycle", "binoculars", "bird", "book", "boomerang", "bottlecap", "bowtie", "bracelet", "brain", "bread", "bridge", "broccoli", "broom", "bucket", "bulldozer", "bus", "bush", "butterfly", "cactus", "cake", "calculator", "calendar", "camel", "camera", "campfire", "candle", "cannon", "canoe", "car", "carrot", "castle", "cat", "cello", "chair", "church", "circle", "clock", "cloud", "coffee", "compass", "computer", "cookie", "couch", "cow", "crab", "crayon", "crocodile", "crown", "cup", "diamond", "dishwasher", "diving board", "dog", "dolphin", "donut", "door", "dragon", "dresser", "drill", "drum", "duck", "dumbbell", "ear", "elbow", "elephant", "envelope", "eraser", "eye", "face", "fan", "feather", "fence", "finger", "fire hydrant", "fireplace", "firetruck", "fish", "flamingo", "flashlight", "flip flops", "flower", "foot", "fork", "frog", "garden", "garden hose", "giraffe", "goatee", "golf club", "grass", "guitar", "hamburger", "hammer", "hand", "harp", "hat", "headphones", "hedgehog", "helicopter", "helmet", "hockey stick", "horse", "hospital", "hot dog", "hourglass", "house", "hurricane", "ice cream", "jacket", "jail", "kangaroo", "key", "keyboard", "knee", "knife", "ladder", "lantern", "laptop", "leaf", "leg", "light bulb", "lighter", "lighthouse", "lightning", "lion", "lipstick", "lobster", "lollipop", "mailbox", "map", "matches", "megaphone", "mermaid", "microphone", "microwave", "monkey", "moon", "mosquito", "mountain", "mouse", "moustache", "mouth", "mug", "mushroom", "nail", "necklace", "nose", "ocean", "octopus", "onion", "oven", "owl", "paintbrush", "palm tree", "panda", "pants", "paper clip", "parachute", "parrot", "peanut", "pear", "peas", "pencil", "penguin", "piano", "pig", "pillow", "pineapple", "pizza", "pond", "pool", "popsicle", "postcard", "potato", "outlet", "purse", "rabbit", "raccoon", "radio", "rain", "rainbow", "rake", "remote", "rhinoceros", "rifle", "river", "rollerskates", "sailboat", "sandwich", "saw", "saxophone", "school bus", "scissors", "scorpion", "screwdriver", "turtle", "shark", "sheep", "shoe", "shorts", "shovel", "sink", "skateboard", "skull", "skyscraper", "sleeping bag", "snail", "snake", "snorkel", "snowflake", "snowman", "soccer", "sock", "spider", "spoon", "squirrel", "stairs", "star", "steak", "stethoscope", "stitches", "stop sign", "stove", "strawberry", "streetlight", "submarine", "suitcase", "sun", "swan", "sweater", "swing", "sword", "syringe", "table", "teapot", "teddy", "telephone", "television", "tennis", "tent", "tiger", "toaster", "toe", "toilet", "tooth", "toothbrush", "toothpaste", "tornado", "tractor", "traffic light", "train", "tree", "trombone", "truck", "trumpet", "shirt", "umbrella", "underwear", "van", "vase", "violin", "washing machine", "watermelon", "whale", "wheel", "windmill", "wine", "watch", "yoga", "zebra"];

/**
 * Reveals words the streamer can select from. Starts hidden so
 * the chat can't see.
 */
function revealChoices() {
  // Pick 2 words randomly from the word list.
  wordListSample = _.sample(wordList, 3)
  // Hide reveal button after it is clicked.
  document.getElementById("revealButton").style.display = "none";
  // Reveal and set text of the first random word.
  document.getElementById("choiceOne").innerHTML = wordListSample[0];
  document.getElementById("choiceOne").style.display = "block";
  // Reveal and set text of the second random word.
  document.getElementById("choiceTwo").innerHTML = wordListSample[1];
  document.getElementById("choiceTwo").style.display = "block";
  // Reveal and set text of the third random word.
  document.getElementById("choiceThree").innerHTML = wordListSample[2];
  document.getElementById("choiceThree").style.display = "block";
}

/**
 * Calls the startGame function on parent tab/window after a word is chosen.
 * 
 * @param {number} choice Identifier of the word selected by the user.
 */
function userSelected(choice) {
  // One of three random words is selected.
  if (choice < 4) {
    // Call the startGame function on the parent tab/window.
    window.opener.startGame(wordListSample[choice - 1]);
  }
  // Custom word is selected.
  else {
    var customChoice = document.getElementById("customChoice").value;
    // Ensure the user entered a custom word before the game is started.
    if (customChoice == "") {
      alert("Please enter a custom choice.");
      return;
    }
    else {
      // Remove leading and ending whitespaces from user input.
      window.opener.startGame(customChoice.trim());
    }
  }
  // Close word.html tab after starting the game.
  window.close();
}