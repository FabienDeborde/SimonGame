$(document).ready(function() {

  var game = {
    // Store the state of the game
    playing: false,
    clickable: true,

    // Store the count number
    count : 0,

    // Store player click count
    playerClick : 0,

    // Contains the buttons data
    buttons : {
      green : {
        el: $('.green'),
        sound: 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
      },
      red : {
        el: $('.red'),
        sound: 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
      },
      yellow : {
        el: $('.yellow'),
        sound: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
      },
      blue : {
        el: $('.blue'),
        sound: 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3',
      }
    },

    // Store the computer combination
    combination : [],

    // Handles the sound playing when a button is active or pressed
    playsound : function(url){
      var audio = new Audio(url);
      audio.play();
    },

    // Handles the game reset
    reset : function() {
      game.count = 0;
      game.combination = [];
      game.updateStartButton('Start');
      game.updateCountText();
    },

    // Update the Start button text
    updateStartButton : function(text) {
      $('#startButton').text(text);
    },

    //Update the counter text
    updateCountText : function(){
      var msg = '';
      if (game.count < 9) {
        msg = '0' + game.count;
      } else {
        msg = game.count;
      }
      $('.step-counter').text(msg)
    },

    // Generate random pick
    randomColor : function() {
      // Store the buttons color in an array
      var colors = Object.keys(game.buttons);
      var randomNumber = Math.floor(Math.random() * 4);
      return colors[randomNumber];
    },

    // Activate a button for a second
    activeButton : function(color) {
      var button = game.buttons[color];
      game.playsound(button.sound);
      button.el.addClass('active');
      setTimeout(function () {
        button.el.removeClass('active');
      }, 200);
    },

    // Make the 4 buttons flash
    flashButtons : function(x) {
      setTimeout(function () {
        $('.col').toggleClass('active');
      }, x);
    },

    // Add a new color to combination
    addRandomColor : function() {
      game.clickable = false;
      // Generate a random color
      var randomColor = game.randomColor();
      console.log(randomColor);
      // Push the element inside the combination array
      game.combination.push(randomColor);
      // Play the combination
      game.playCombination();
      // Update the count and display it
      game.count += 1;
      game.updateCountText();
      game.clickable = true;
    },

    // Play the combination
    playCombination : function() {
      var timeoutValue = 600;
      var timeout = timeoutValue;
      game.combination.map(function(color){
        setTimeout(function() {
          game.activeButton(color);
        }, timeout);
        timeout += timeoutValue;
      })
    }

  }

  $('.col').on('click', function(){
    var className = this.className;
    className = className.replace('col debug ', '');
    if (!game.playing || !game.clickable) { // If the game has not started yet
      return null // do nothing
    } else {
      game.playsound(game.buttons[className].sound);
      // Get the corresponding element color
      var colorButton = game.combination[game.playerClick];
      console.log(className, colorButton);
      //console.log(colorButton);
      if (className === colorButton) { // If the player clicked the right element
        setTimeout(function() {
          game.addRandomColor();
        }, 700);
        game.playerClick += 1;
      } else { // If the player clicked the wrong element
        setTimeout(function () {
          game.playsound('buzzer.m4a');
          for (var i = 0; i < 4; i++) {
            game.flashButtons( (i * 100) + 300);
          }
        }, 300);
        setTimeout(function () {
          game.playCombination();
        }, 2000);
      }
    }
  })

  $('.restart-container a').on('click', function(e){
    e.preventDefault();
    if (!game.playing) { // If not playing already
      // Start the game
      game.updateStartButton('Reset');
      game.addRandomColor();
    } else {
      // Reset the game
      game.reset();
    }
    game.playing = !game.playing;
  })



  $('.debug').on('click', function(){
    console.log(game);
  })

})
