
/* global $, alert */

$(document).ready( function() {
"use strict";

// These variable track the state of this "game"
var streak = 0;
var points = 0;

// Send score to service.
function gameOver() {
  var msg = {
	"messageType": "SCORE",
	"score": parseFloat($("#score").text())
  };
  window.parent.postMessage(msg, "*");
};

// Sends this game's state to the service.
// The format of the game state is decided
// by the game
function saveStatus() {
  var msg = {
	"messageType": "SAVE",
	"gameState": {
	  "streak": parseFloat($("#streak").text()),
	  "score": parseFloat($("#score").text())
	}
  };
  window.parent.postMessage(msg, "*");
};

// Sends a request to the service for a
// state to be sent, if there is one.
function loadRequest() {
  var msg = {
	"messageType": "LOAD_REQUEST",
  };
  window.parent.postMessage(msg, "*");
};

// Listen incoming messages, if the messageType
// is LOAD then the game state will be loaded.
// Note that no checking is done, whether the
// gameState in the incoming message contains
// correct information.
//
// Also handles any errors that the service
// wants to send (displays them as an alert).
window.addEventListener("message", function(evt) {
  if(evt.data.messageType === "LOAD") {
	streak = evt.data.gameState.streak;
	$("#streak").text(streak);
	points = evt.data.gameState.score;
	$("#score").text(points);
  } else if (evt.data.messageType === "ERROR") {
	alert(evt.data.info);
  }
});

// This is part of the mechanics of the "game"
// it does not relate to the messaging with the
// service.

$(".playerButton").click( function() {

	// Rock wins Scissors wins Paper wins Rock
	//var rpsNames = ["Rock","Scissors","Paper"];
	var comp = Math.floor((Math.random() * 3));
	
	$(".playerButton").removeClass("btn-info");
	$(".compButton").removeClass("btn-danger");
	$("#" + this.id).addClass("btn-info");
	$("#Comp" + comp).addClass("btn-danger");
	
	//$("#compRPS").text( rpsNames[ comp ] );
	
	var resultText = "TIE";
	if( ( comp + 1 ) % 3 == parseInt( this.id ) )
		resultText = "YOU LOST";
	else if( ( parseInt( this.id ) + 1 ) % 3 == comp )
		resultText = "YOU WON";
		
	$("#result").text( resultText );
});

// Request the service to set the resolution of the
// iframe correspondingly
var message =  {
  messageType: "SETTING",
  options: {
	"width": 400,
	"height": 400
	}
};
window.parent.postMessage(message, "*");
loadRequest();

});
