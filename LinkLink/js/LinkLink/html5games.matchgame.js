// A global object to hold all global variables related to the game.
var matchingGame = {};

// All possible values for each card in deck.
matchingGame.deck = [
	'cardAK','cardAK','cardAK','cardAK',  
	'cardAQ','cardAQ','cardAQ','cardAQ',
	'cardAJ','cardAJ','cardAJ','cardAJ',
	'cardBK','cardBK','cardBK','cardBK',
	'cardBQ','cardBQ','cardBQ','cardBQ',
	'cardBJ','cardBJ','cardBJ','cardBJ',
	'cardCJ','cardCJ','cardCJ','cardCJ',
	'cardCQ','cardCQ','cardCQ','cardCQ',
	'cardCK','cardCK','cardCK','cardCK',
	'cardDK','cardDK','cardDK','cardDK'
];

matchingGame.grid = 
[
	[-1,0,0,1,-1,0,0,-1],
	[1,-1,1,1,1,1,-1,1],
	[2,2,-2,2,2,-2,2,2],
	[3,3,3,-3,-3,3,3,3],
	[4,4,-4,4,4,-4,4,4],
	[5,-5,5,5,5,5,-5,5],
	[-6,6,6,-6,6,6,6,-6],
];

// Every code inside $(function(){}) will be run 
// after the DOM is loaded and ready.
$(function()
{
	matchingGame.deck.sort(shuffle);
	
	// Layout cards.
	var card;
	var spacingBetCards = 5;
	for (var i = 0; i < matchingGame.grid.length; i++)
	{
		for (var j = 0; j < matchingGame.grid[i].length; j++)
		{
			var cardId = matchingGame.grid[i][j];
			if (cardId >= 0)
			{
				card = $('<div class="card"></div>'); 
				$("#cardBoard").append (card);
				
                
				// Get a pattern from the shuffled deck.
				var pattern = matchingGame.deck.pop();
				
				// Visually apply the pattern on the card's back side.
				// the pattern value is actually a CSS class with the
				// corrisponding playing card graphic.
			    //card.find(".front").addClass(pattern);
				card.addClass(pattern);
				
				// Embed the pattern data into the DOM element.
				card.attr("data-pattern", pattern);
								
				// Listen the click event on each card DIV element.
				card.click(selectCard);
			}
		}
	}
});

function selectCard() 
{
	
}

// a function to return random number between -0.5 to 0.5
function shuffle()
{
	// Returning a random number in sort function.
	// the sort function determine by eiter possitive number and negative number.
	// Math.random() range from 0 - 1, 0.5 - Math.random() results eiter possitive or negative number.	
	return 0.5 - Math.random();
}

// a function to do action when both cards match
function checkPattern()
{
	if (isMatchPattern())
	{
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		
		// delete the card DOM node after the transition finished.
		$(".card-removed").bind("webkitTransitionEnd", removeTookCards);
	}
	else
	{
		$(".card-flipped").removeClass("card-flipped");
	}
}

// a function to delete all removed cards
function removeTookCards()
{
	$(".card-removed").remove();
}

// a function to check if the flipped card match the pattern.
function isMatchPattern()
{
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern == anotherPattern);
}

