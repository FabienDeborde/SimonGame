$(document).ready(function() {

  var game = {
    // Store the state of the game
    playing: false,

    // Store the count number
    count : 0,

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
      button.el.addClass('active');
      game.playsound(button.sound);
      setTimeout(function () {
        button.el.removeClass('active');
      }, 200);
    }


  }

  $('.col').on('click', function(){
    var className = this.className;
    className = className.replace('col ', '');
    game.playsound(game.buttons[className].sound);
  })

  $('.restart-container a').on('click', function(e){
    e.preventDefault();
    if (!game.playing) { // If not playing already
      // Start the game
      game.updateStartButton('Reset');
      game.activeButton(game.randomColor());
    } else {
      // Reset the game
      game.reset();
    }
    game.playing = !game.playing;


  })

})
