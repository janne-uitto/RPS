/* global $, alert */

$(document).ready( function() {
"use strict";

// These variable track the state of this "game"
var streak = 0;
var points = 0;
var lives = 10;

// Send score to service.
function gameOver() {
    var msg = {
        "messageType": "SCORE",
        "score": parseFloat(points)
    };
    window.parent.postMessage(msg, "*");

    $("#over").show();
    $("#over > p").text( "Game Over, Your Points: " + points );

    streak = 0;
    points = 0;
    lives = 10;
};

// Sends this game's state to the service.
// The format of the game state is decided
// by the game
function saveStatus() {
    var msg = {
        "messageType": "SAVE",
        "gameState": {
            "streak": streak,
            "lives": lives,
            "score": points
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
    if(evt.data.messageType === "LOAD")
    {
        streak = evt.data.gameState.streak ? evt.data.gameState.streak : streak;
        $("#streak").text(streak);
        lives = evt.data.gameState.lives ? evt.data.gameState.lives : lives;
        showLives();
        points = evt.data.gameState.score ? evt.data.gameState.score : points;
        $("#score").text(points);
    }
    else if(evt.data.messageType === "ERROR")
    {
        alert(evt.data.info);
    }
});

// This is part of the mechanics of the "game"
// it does not relate to the messaging with the
// service.
$(".playerButton").click( function() {
    
    // Rock wins Scissors wins Paper wins Rock
    var comp = Math.floor((Math.random() * 3));
    
    clearColors();
    $(this).addClass("btn-info");
    $("#Comp" + comp).addClass("blue");

    var resultText = "";
    if( ( comp + 1 ) % 3 == parseInt( this.id ) )
    {
        streak = 0;
        lives--;
        $("#result").addClass("red");
        resultText = "YOU LOST";
    }
    else if( ( parseInt( this.id ) + 1 ) % 3 == comp )
    {
        $("#result").addClass("green");
        resultText = "YOU WON";
        streak++;
        points += streak;
    }
    else
    {
        resultText = "TIE";
        $("#result").addClass("yellow");
    }
    
    if( lives <= 0 )
        gameOver();
    else
        updateStatus(resultText);
});

$("#close").click( function() {
    $("#over").hide();
    clearColors();
    updateStatus("Result");
});

function updateStatus(resultText) {
    $("#streak").text(streak);
    $("#score").text(points);
    $("#result").text(resultText);
    showLives();
    saveStatus();
}

function clearColors() {
    $(".playerButton").removeClass("btn-info");
    $(".compSelection").removeClass("blue");
    $("#result").removeClass("red green yellow");
}

function showLives() {
    var img = $("<img/>");
    img.attr("src", "heart.png");
    img.attr("width", "25");
    img.attr("height", "25");
    img.attr("alt", "Lives left");
    var livesElem =  $("#lives");
    livesElem.html("");
    for( var i = 0; i < lives ; i++ )
    {
        livesElem.append( img.clone() );
    }
}

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
showLives();

$('#popover').popover({
    trigger: 'click',
    content: '<p class="guide">Click Player\'s Rock/Paper/Scissors. ' +
            'You get points when you win a round against computer. Points are increased by streak amount. ' +
            'Streak increases when you win. Streak is cleared when you lose. ' + 
            'You lose life when you lose a round. Game ends when all lives are gone.</p>' +
            '<p class="guide">Game is saved automatically after each round and loaded when you launch the game. ' +
            'Score is updated to the game service when game ends.</p>',
    placement: 'top',
    html: true
  });

});
