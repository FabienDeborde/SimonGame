$(document).ready(function() {

  var game = {
    // Debug mode
    debug: false,

    // Store the state of the game
    playing: false,
    clickable: true,
    strictMode: false,

    // Store the winning condition
    winCount: 5,

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
      game.playerClick = 0;
      game.combination = [];
      game.updateStartButton('Start');
      game.updateCountText();
      game.clickable = true;
    },

    // Update the Start button text
    updateStartButton : function(text) {
      $('#startButton').text(text);
    },

    //Update the counter text
    updateCountText : function(){
      var msg = '';
      if (game.count < 10) {
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
      // Prevent the player to click during the demo of the combination array
      game.clickable = false;
      // Reset the playerClick counter
      game.playerClick = 0;
      // Generate a random color
      var randomColor = game.randomColor();
      // Push the element inside the combination array
      game.combination.push(randomColor);
      // Play the combination
      game.playCombination();
      // Update the count and display it
      game.count += 1;
      game.updateCountText();
    },

    // Play the combination
    playCombination : function() {
      // Store an arbitrary delay between each combination color
      var timeoutValue = 600;
      var timeout = timeoutValue;
      // Map through the combination and activate one button at a time
      game.combination.map(function(color){
        setTimeout(function() {
          game.activeButton(color);
        }, timeout);
      timeout += timeoutValue;
      });
      // Make the board clickable again once the demo is finished
      setTimeout(function() {
        game.clickable = true;
      }, timeout);
    }
  }

  // Button click handler
  $('.col').on('click', function(){
    // Store the name of the color
    var className = this.className;
    className = className.replace('col', '').trim();
    if (game.debug) {
      className = className.replace('debug', '').trim();
    }
    if (!game.playing || !game.clickable) { // If the game has not started yet
      return null // do nothing
    } else {
      // Activate the button clicked (sound and color effect)
      game.activeButton(className);
      // Get the corresponding element color in the combination array
      var colorButton = game.combination[game.playerClick];

      if (className === colorButton) { // If the player clicked the right element
        game.playerClick += 1; // add 1 to the playerClick counter (go to the next item in the combination array)
        if ((game.combination.length) === game.playerClick && game.count !== game.winCount ) { // if it was the last item in combination array
          setTimeout(function() { // generate a new color
            game.addRandomColor();
          }, 700);
        } else if ((game.combination.length) === game.playerClick && game.count === game.winCount ){
          // Winning effect (buzzer sound and color buttons flashing)
          $('.step-container').addClass('rotate');
          setTimeout(function () {
            game.clickable = false;
            game.playsound('youwin.mp3');
            for (var i = 0; i < 20; i++) {
              game.flashButtons( (i * 100) + 300);
            }
          }, 300);
          setTimeout(function() {
            $('.step-container').removeClass('rotate');
            game.reset();
          }, 3000)
        }
      } else { // If the player clicked the wrong element
        if (game.strictMode) {
          console.log('Game Over');
          // Game over effect (buzzer sound and color buttons flashing)
          $('.step-counter').addClass('gameover');
          setTimeout(function () {
            game.clickable = false;
            game.playsound('gameover.mp3');
            for (var i = 0; i < 8; i++) {
              game.flashButtons( (i * 100) + 300);
            }
          }, 300);
          setTimeout(function() {
            $('.step-counter').removeClass('gameover');
            game.reset();
          }, 2000)
        } else {
          // Prevent the player to click during the demo of the combination array
          game.clickable = false;
          // Error effect (buzzer sound and color buttons flashing)
          setTimeout(function () {
            game.playsound('buzzer.m4a');
            for (var i = 0; i < 4; i++) {
              game.flashButtons( (i * 100) + 300);
            }
          }, 300);
          // Show the demo again
          setTimeout(function () {
            game.playCombination();
          }, 2000);
        }
      }
    }
  })

  // Start button click handler
  $('.restart-container a').on('click', function(e){
    e.preventDefault();
    if (!game.playing) { // If not playing already
      // Start the game
      game.clickable = false;
      game.updateStartButton('Reset');
      game.addRandomColor();
    } else {
      // Reset the game
      game.reset();
    }
    game.playing = !game.playing;
  })

  // Strict Mode checkbox handler
  $('#switch').on('change', function(){
    if (this.checked) { // Strict mode checked
      game.strictMode = true;
    } else { // Strict mode unchecked
      game.strictMode = false;
    }
  })


  // Handle the debug mode
  if (game.debug) {
    $('.col').addClass('debug');
    $('.debug').on('click', function(){
    console.log(game);
  })

  }

})
