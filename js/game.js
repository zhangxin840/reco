//Author: Zhang Xin
//R-ECO 2.0
//Mail: 116943915@qq.com
//

//Game mode
var mode = "normal";

//Score stack
var easyScores = [-2, -2, 2, 3, 3, 4, 4];
var normalScores = [-2, -2, 3, 3, 4, 4, 5, 5];

var colors = ["red", "blue", "yellow", "green"];
var shortColors = ["r", "b", "y", "g"];

var totalScore = 0;
var highScore = 0;
var factoryValue = {
	red : 0,
	blue : 0,
	yellow : 0,
	green : 0,
};

var choosenColor = "unknown";

var tweenObjsCount = 0;

var iconMoveSpeed = 0.5;
var iconFadeSpeed = 0.5;

function getIcon() {
	var result = "";
	result = colors[Math.floor(Math.random() * 4)];
	//3 in 25 have double value
	if (Math.floor(Math.random() * 25) < 3) {
		result += "2";
	}
	return result;
}

function theMansWord() {

	var result = Math.floor(Math.random() * 11) + 1;
	var words = ""
	switch(result) {
		case 1:
			if (mode == "easy") {
				words = "I can take 6 most in hand";
			} else {
				words = "I can take 5 most in hand";
			}
			break;
		case 2:
			words = "High score is " + highScore + ", carry on";
			break;
		case 3:
			words = "Want more? Contact me";
			break;
		case 4:
			words = "I look best in Webkit browsers";
			break;
		case 5:
			words = "Waste separation is important";
			break;
		case 6:
			words = "I don't need Flash plugin";
			break;
		case 7:
			words = "Do you find best strategy?";
			break;
		case 8:
			words = "Strategy is important";
			break;
		case 9:
			words = "Avoid -2 scores";
			break;
		case 10:
			words = "Best players can score 90+";
			break;
		case 11:
			words = "You can press F5 to restart";
			break;
	}
	return words;
}

function shuffle(array) {
	var i;
	var a;
	var b;
	var temp;
	var length = array.length;

	//Swap 3*(deck.length) times
	for ( i = 0; i < 3 * length; i++) {
		a = Math.floor(Math.random() * length);
		b = Math.floor(Math.random() * length);
		temp = array[a];
		array[a] = array[b];
		array[b] = temp;
	}
}

//Not used
function sleep(naptime) {
	var sleeping = true;
	var startingMSeconds = (new Date()).getTime();
	while (sleeping) {
		nowMSeconds = (new Date()).getTime();
		if (nowMSeconds - startingMSeconds > naptime) {
			sleeping = false;
		}
	}
}

function waitAnimationDone(functionName, args) {
	var wait = setInterval(function() {
		if (tweenObjsCount == 0) {
			clearInterval(wait);
			window[functionName].apply(this, args);
		}
	}, 300);
}

function addTotalScore() {

	var name = $("#scores img:last").attr("src").split("/")[1].split(".")[0];
	var value = name.slice(6, name.length);
	totalScore = totalScore + parseInt(value);

	return window.totalScore;
}

function subTotalScore(value) {
	totalScore = totalScore - value;
	$("#totalScore").html("Score: " + totalScore);
}

function checkFactory(color, value) {
	if (factoryValue[color] + value > 3) {
		factoryValue[color] = 0;
		return true;
	} else {
		factoryValue[color] = value + factoryValue[color];
		return false;
	}
}

function setup() {

	var scorePile = easyScores;

	if (mode == "easy") {
		scorePile = easyScores;
	} else {
		scorePile = normalScores;
	}

	$("#instruction").fadeIn("normal");

	var length = scorePile.length;

	var shortColor = "";
	var color = "";
	var scorePileSelecter = "";
	var dumpPileSelecter = "";
	var theNumber = -1;
	var iconName = "";

	//4 color area
	for (var a = 0; a < 4; a++) {
		shortColor = shortColors[a];
		color = colors[a];
		scorePileSelecter = "#" + color + " " + "div.scorePile";
		dumpPileSelecter = "#" + color + " " + "div.dump.iconPile"

		//Score Pile
		shuffle(scorePile);
		theNumber = -1;
		for (var i = 0; i < length; i++) {
			theNumber = scorePile[i];
			position = $(scorePileSelecter + " " + "img").length + 1;
			$("<img/>", {
				"class" : "icon" + " " + "round",
				src : "images/score" + shortColor + theNumber + ".gif",
			}).css("left", position * 10 + "px").appendTo(scorePileSelecter);
		}

		$(scorePileSelecter + " " + "img:last").addClass("lastScore").click(function() {
			if (tweenObjsCount == 0) {
				$(this).attr("src", "images/scorec1.gif");
				takeScore($(this).parent().parent().attr("id"));
			}
		});
		//Dump Pile
		iconName = getIcon();
		$("<img/>", {
			"class" : "icon" + " " + "slot1",
			src : "images/" + iconName + ".gif",
		}).appendTo(dumpPileSelecter);
	}

	//Setup hand
	for (var b = 0; b < 3; b++) {
		iconName = getIcon();
		$("<img/>", {
			"class" : "icon" + " " + "hand",
			src : "images/" + iconName + ".gif",
		}).appendTo("#handIcons");
	}
	$(".hand").click(function() {
		preparePlay(this);
	});
}

function takeScore(color) {
	var scorePileSelecter = "#" + color + " " + "div.scorePile";
	var pileOffset = $(scorePileSelecter).offset();
	var scoresOffset = $("#scores").offset();

	// $(scorePileSelecter + " " + "img:last").animate({
	// top : scoresOffset.top - pileOffset.top - 50 + "px",
	// left : scoresOffset.left - pileOffset.left + 50 + "px"
	// }, "normal");
	tweenObjsCount++;
	TweenLite.to($(scorePileSelecter + " " + "img:last"), iconMoveSpeed, {
		css : {
			top : scoresOffset.top - pileOffset.top - 50 + "px",
			left : scoresOffset.left - pileOffset.left + 50 + "px"
		},
		onComplete : function() {
			tweenObjsCount--;
		}
	});

	// $(scorePileSelecter + " " + "img:last").animate({
		// opacity : "0"
	// }, "normal", function() {
		// //var position = $(factoryPileSelecter + " " + "img").length + 1;
		// var top = -Math.floor(($("#scores img").length / 10)) * 50;
		// var left = ($("#scores img").length % 10) * 15;
		// $(scorePileSelecter + " " + "img:last").removeClass().addClass("icon" + " " + "round").appendTo("#scores");
// 
		// $("#scores" + " " + "img:last").removeAttr("style");
		// $("#scores" + " " + "img:last").css("left", left + "px").css("top", top + "px").addClass("front");
// 
		// //Update score
		// var total = addTotalScore();
		// $("#totalScore").html("Score: " + total);
// 
		// $(scorePileSelecter + " " + "img:last").addClass("lastScore").click(function() {
			// if (tweenObjsCount == 0) {
				// $(this).attr("src", "images/scorec1.gif");
				// takeScore($(this).parent().parent().attr("id"));
			// }
		// });
		// //Next step
		// waitAnimationDone("collect", [color]);
	// });

	tweenObjsCount++;
	TweenLite.to($(scorePileSelecter + " " + "img:last"), iconFadeSpeed, {
		delay : iconMoveSpeed,
		css : {
			opacity : "0"
		},
		onComplete : function() {
			//var position = $(factoryPileSelecter + " " + "img").length + 1;
			var top = -Math.floor(($("#scores img").length / 10)) * 50;
			var left = ($("#scores img").length % 10) * 15;
			$(scorePileSelecter + " " + "img:last").removeClass().addClass("icon" + " " + "round").appendTo("#scores");

			$("#scores" + " " + "img:last").removeAttr("style");
			$("#scores" + " " + "img:last").css("left", left + "px").css("top", top + "px").addClass("front");

			//Update score
			var total = addTotalScore();
			$("#totalScore").html("Score: " + total);

			$(scorePileSelecter + " " + "img:last").addClass("lastScore").click(function() {
				if (tweenObjsCount == 0) {
					$(this).attr("src", "images/scorec1.gif");
					takeScore($(this).parent().parent().attr("id"));
				}
			});
			//Next step
			waitAnimationDone("collect", [color]);

			tweenObjsCount--;
		}
	});
}

function collect(color) {
	var pileSelecter = "#" + color + " " + "div.dump.iconPile";
	var factoryPileSelecter = "#" + color + " " + "div.factory.iconPile";
	var pileOffset = $(pileSelecter).offset();
	var manOffset = $("#man").offset();

	var icons = $(pileSelecter + " " + "img");
	var lastIcon = $(pileSelecter + " " + "img:last");

	// icons.animate({
	// top : manOffset.top - pileOffset.top + 40 + "px",
	// left : manOffset.left - pileOffset.left + 30 + "px"
	// }, "normal");	tweenObjsCount++;
	TweenLite.to(icons, iconMoveSpeed, {
		css : {
			top : manOffset.top - pileOffset.top + 40 + "px",
			left : manOffset.left - pileOffset.left + 30 + "px"
		},
		onComplete : function() {
			tweenObjsCount--;
		}
	});

	// icons.not(":last").animate({
	// opacity : "0"
	// }, "normal", function() {
	// $(this).click(function() {
	// preparePlay(this);
	// });
	// $(this).removeClass().addClass("icon").addClass("hand").appendTo("#handIcons");
	// //Clear style after animation
	// $(this).removeAttr("style");
	// });
	var iconsNotLast = icons.not(":last");
	tweenObjsCount++;
	TweenLite.to(iconsNotLast, iconFadeSpeed, {
		delay : iconMoveSpeed,
		css : {
			opacity : "0"
		},
		onComplete : function() {
			$(this.target).click(function() {
				preparePlay(this);
			});
			$(this.target).removeClass().addClass("icon").addClass("hand").appendTo("#handIcons");
			//Clear style after animation
			$(this.target).removeAttr("style");

			tweenObjsCount--;
		}
	});

	// lastIcon.animate({
	// opacity : "0"
	// }, "normal", function() {
	// $(this).click(function() {
	// preparePlay(this);
	// });
	// $(this).removeClass().addClass("icon").addClass("hand").appendTo("#handIcons");
	// //Clear style after animation
	// $(this).removeAttr("style");
	//
	// waitAnimationDone("dump", [color, $(factoryPileSelecter + " " + "img").length + 1]);
	// });
	tweenObjsCount++;
	TweenLite.to(lastIcon, iconFadeSpeed, {
		delay : iconMoveSpeed,
		css : {
			opacity : "0"
		},
		onComplete : function() {
			$(this.target).click(function() {
				preparePlay(this);
			});
			$(this.target).removeClass().addClass("icon").addClass("hand").appendTo("#handIcons");
			//Clear style after animation
			$(this.target).removeAttr("style");

			waitAnimationDone("dump", [color, $(factoryPileSelecter + " " + "img").length + 1]);

			tweenObjsCount--;
		}
	});
}

function dump(color, number) {
	var pileSelecter = "#" + color + " " + "div.dump.iconPile";
	var i = 0;
	var position = 0;
	var iconName = "";
	for ( i = 0; i < number; i++) {
		iconName = getIcon()
		position = $(pileSelecter + " " + "img").length + 1;
		if (position > 4) {
			return;
		}
		$("<img/>", {
			"class" : "icon" + " " + "slot" + position,
			src : "images/" + iconName + ".gif",
		}).appendTo(pileSelecter).hide().fadeIn("slow");
	}
	waitAnimationDone("checkGameover", []);
}

function checkGameover() {
	//Check win
	var win = false;
	$(".scorePile").each(function() {
		if ($(this).children().length < 1) {
			win = true;
		}
	});
	if (win) {
		gameOver("win");
		return;
	}

	//Check lose
	if (mode == "easy") {
		if ($("#handIcons img").length > 6) {
			gameOver("lose");
		}
	} else {
		if ($("#handIcons img").length > 5) {
			gameOver("lose");
		}
	}
}

function gameOver(state) {

	if (state == "lose")
		$("#state").html("Game Over");
	else {
		$("#state").html("You Win");

		//Add 4 point if you win
		totalScore = totalScore + 4;
	}

	var highScore = 0;

	if (window.localStorage) {
		var storage = window.localStorage;

		if (!storage.getItem("highScore")) {
			storage.setItem("highScore", 0);
		}

		//Get high score
		highScore = parseInt(storage.getItem("highScore"));

		//Store new high score
		if (totalScore > highScore) {
			storage.setItem("highScore", totalScore);
		}
	}

	//Update high score
	if (totalScore > highScore) {
		highScore = totalScore;
		$("#state").html("New Record");
	}

	$("#endScore").html("Score: " + totalScore);
	$("#highScore").html("High Score: " + highScore);

	$("#gameOver").fadeIn("normal");
}

function preparePlay(theIcon) {
	//Get the color
	var color = $(theIcon).attr("src").split("/")[1].split(".")[0];
	if (color[color.length - 1] == "2") {
		color = color.slice(0, color.length - 1);
	}

	if (choosenColor == "unknown" || choosenColor == color) {
		$(theIcon).toggleClass("prepare");
		if (choosenColor == "unknown") {
			$("#manSay").fadeOut("normal", function() {
				$("#manSay").html("OK");
				$("#manSay").addClass("ok");
				$("#manSay").fadeIn("normal");
			});
		}
		choosenColor = color;
		if ($(".hand.prepare").length == 0) {
			choosenColor = "unknown"
			$("#manSay").fadeOut("normal", function() {
				$("#manSay").html(theMansWord());
				$("#manSay").removeClass("ok");
				$("#manSay").fadeIn("normal");
			});
		}
	} else {
		$(".prepare").removeClass("prepare");
		$(theIcon).toggleClass("prepare");
		choosenColor = color;
	}
}

function playIcon() {
	//Get color and value
	var icons = $(".hand.prepare");

	var isEnough = "unknown";
	var color = "unknown";

	icons.each(function(index) {

		//If already enough
		if (isEnough != true) {
			color = $(this).attr("src").split("/")[1].split(".")[0];
			var value = 0;
			if (color[color.length - 1] == "2") {
				value = 2;
				color = color.slice(0, color.length - 1);
			} else {
				value = 1;
			}
			isEnough = checkFactory(color, value);
		};

	});

	icons.removeClass("prepare");

	var factoryPileSelecter = "#" + color + " " + "div.factory.iconPile";

	var pileOffset = $(factoryPileSelecter).offset();
	var iconOffset = 0;

	icons.each(function(index) {
		iconOffset = $(this).offset();

		// $(this).animate({
		// top : pileOffset.top - iconOffset.top + 100 + "px",
		// left : pileOffset.left - iconOffset.left + 30 + "px"
		// }, "normal");
		tweenObjsCount++;
		TweenLite.to($(this), iconMoveSpeed, {
			css : {
				top : pileOffset.top - iconOffset.top + 100 + "px",
				left : pileOffset.left - iconOffset.left + 30 + "px"
			},
			onComplete : function() {
				tweenObjsCount--;
			}
		});

	});

	icons.not(":last").each(function(index) {
		// $(this).animate({
		// opacity : "0"
		// }, "normal", function() {
		//
		// var position = $(factoryPileSelecter + " " + "img").length + 1;
		//
		// $(this).removeClass().addClass("icon" + " " + "slot" + position).appendTo(factoryPileSelecter);
		// $(this).removeAttr("style");
		// });
		tweenObjsCount++;
		TweenLite.to($(this), iconFadeSpeed, {
			delay : iconMoveSpeed,
			css : {
				opacity : "0"
			},
			onComplete : function() {
				var position = $(factoryPileSelecter + " " + "img").length + 1;
				$(this.target).removeClass().addClass("icon" + " " + "slot" + position).appendTo(factoryPileSelecter);
				$(this.target).removeAttr("style");

				tweenObjsCount--;
			}
		});

	});

	// icons.last().animate({
	// opacity : "0"
	// }, "normal", function() {
	//
	// var position = $(factoryPileSelecter + " " + "img").length + 1;
	//
	// $(this).removeClass().addClass("icon" + " " + "slot" + position).appendTo(factoryPileSelecter);
	// $(this).removeAttr("style");
	//
	// //Check enough and move next step
	// if (isEnough) {
	// icons.add(factoryPileSelecter + " " + "img").fadeOut("slow", function() {
	// $(this).remove();
	// });
	// waitAnimationDone("takeScore", [color]);
	// } else {
	// waitAnimationDone("collect", [color]);
	// }
	//
	// });
	tweenObjsCount++;
	TweenLite.to(icons.last(), iconFadeSpeed, {
		delay : iconMoveSpeed,
		css : {
			opacity : "0"
		},
		onComplete : function() {
			var position = $(factoryPileSelecter + " " + "img").length + 1;
			$(this.target).removeClass().addClass("icon" + " " + "slot" + position).appendTo(factoryPileSelecter);
			$(this.target).removeAttr("style");

			//Check enough and move next step
			if (isEnough) {
				icons.add(factoryPileSelecter + " " + "img").fadeOut("slow", function() {
					$(this).remove();
				});
				waitAnimationDone("takeScore", [color]);
			} else {
				waitAnimationDone("collect", [color]);
			}

			tweenObjsCount--;
		}
	});
}

function testTimerClicked() {
	var temp = "animating : " + tweenObjsCount;
	$("#testBlock5").html(temp);
	setTimeout("testTimerClicked()", 500);
}

$(function() {

	if (window.localStorage) {
		var storage = window.localStorage;
		if (!storage.getItem("highScore")) {
			storage.setItem("highScore", 0);
		}
		highScore = parseInt(storage.getItem("highScore"));
		$("#welcomeHighScore").html("High Score: " + highScore);
	}

	$("#instruction").hide();

	$("#easyButton").click(function() {
		mode = "easy";
		setup();
		$("#welcome").fadeOut("slow");
	});
	$("#normalButton").click(function() {
		mode = "normal";
		setup();
		$("#welcome").fadeOut("slow");
	});
	$("#howButton").click(function() {
		$("#helpPage").fadeIn("slow");
	});
	$("#helpPage").click(function() {
		$(this).fadeOut("slow");
	});
	$("#restart").click(function() {
		window.location.reload();
	});
	setTimeout("testTimerClicked()", 100);

	//Note:In $(function(){});, events are banded only once and only when page loaded.
	$("#manSay").click(function() {

		//Ignore click when animating
		if (tweenObjsCount != 0) {
			return;
		}

		//Check if have prepared icons
		if ($(".hand.prepare").length == 0 || $("#manSay").hasClass("ok") == false) {
			return;
		}

		//Play prepared icons
		playIcon();

		//Reset instruction
		choosenColor = "unknown"
		$("#manSay").fadeOut("normal", function() {

			$("#manSay").html(theMansWord());

			$("#manSay").removeClass("ok");
			$("#manSay").fadeIn("normal");
		});
	});
});
