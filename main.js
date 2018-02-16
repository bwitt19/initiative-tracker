
/* Constants: */
// Indexing for player characteristics
var NAME       = 0;
var DEX_MOD    = 1;
var INITIATIVE = 2;

// In duplicate name checker
var ASCII_UPPER_A = 65;


// addToInit() - Prec: Event - Add to Initiative button pressed
function addToInit() {
    var newRow = "<tr class=\"character\">";
    var charInfo = [$("#newName").val(), $("#newDex").val(), $("#newInit").val()];
    var $output = $("#test");

    if (charInfo[NAME] === "")
        charInfo[NAME] = "Personman";

    // Format dexterity modifier
    if (charInfo[DEX_MOD] === "")
        charInfo[DEX_MOD] = "0";

    // If no value for initiative, randomize
    if (charInfo[INITIATIVE] === "")
        charInfo[INITIATIVE] = Math.floor(Math.random() * 20) + 1;

    // Format and append new data into row
    newRow += "<td class=\"name\">" + charInfo[NAME] + "</td>";
    newRow += "<td class=\"dex\">" + charInfo[DEX_MOD] + "</td>";
    newRow += "<td class=\"init\">" + charInfo[INITIATIVE] + "</td>";

    newRow += "</tr>";
    $("#initTable > tbody:last-child").append(newRow);
}


// startBattle() -- Prec: Event - Start the Encounter button pressed
function startBattle() {
    sortByInitiative();
    $("#unsortedTable").slideUp(500);
    $(".newChar").slideUp(500);
    // todo: Implement stuff here
    // Start doing things (turn display, waiting in initiative, delete from tbl)
    // Maybe change button characteristics to a next turn button
    //   with diff. functionality (unhide, and hide start battle btn)
}


// sortByInitiative() -- Prec: Called by startBattle()
function sortByInitiative() {
    var playerNames = $(".name");
    var playerDex   = $(".dex");
    var playerInits = $(".init");
    var players = [];

    // var mark = jQuery.text(playerNames[0]);

    for (var i = 0; i < playerNames.length; i++) {
        var stats = [];
        stats.push( jQuery.text(playerNames[i]) );
        stats.push( Number(jQuery.text(playerDex[i])) );
        stats.push( Number(jQuery.text(playerInits[i])) );
        players.push(stats)
    }

    // Test log
    for (i = 0; i < players.length; i++) {
        console.log(i + 1);
        for (var j = 0; j < 3; j++) {
            console.log("   " + players[i][j]);
        }
    }
    // End Test

    // Implement sorting algorithm here!
    // Selection sort (because who needs big O)
    for (i = 0; i < players.length - 1; i++) {
        var max = i;
        for (var j = i + 1; j < players.length; j++)
            if (players[j][INITIATIVE] > players[max][INITIATIVE]) max = j;
        var temp = players[i];
        players[i] = players[max];
        players[max] = temp;
    }

    // Check for initiative ties and sort on dex. mod
    //   (or coin toss on double tie)
    var rando = Math.random();
    for (i = 0; i < players.length - 1; i++) {
        if (players[i][INITIATIVE] === players[i + 1][INITIATIVE]) {
            // If dex. of i < dex. of i+1 [OR] If dexs tie, flip a coin
            if (players[i][DEX_MOD] < players[i + 1][DEX_MOD] ||
                (players[i][DEX_MOD] === players[i + 1][DEX_MOD] &&
                rando >= 0.5)) {

                var temp = players[i];
                players[i] = players[i + 1];
                players[i + 1] = temp;
            }
        }
    }

    // Identify and mark duplicate character names
    for (i = 0; i < players.length - 1; i++) {
        var sameNames = [i];
        for (j = 0; j < players.length; j++) {
            if (players[i][NAME] === players[j][NAME] && i !== j)
                sameNames.push(j);
        }
        if (sameNames.length !== 1) {
            var m = 0;
            for (var k = 0; k < sameNames.length; k++) {
                players[sameNames[k]][NAME] = players[sameNames[k]][NAME] + " "
                    + String.fromCharCode(ASCII_UPPER_A + m++);
            }
        }
    }

    // Test log
    console.log("Sorted:");
    for (i = 0; i < players.length; i++) {
        console.log(i + 1);
        for (var j = 0; j < 3; j++) {
            console.log("   " + players[i][j]);
        }
    }
    // End Test

    // Test table (the following line is the table head a la first table displayed)
    var sortedTable = "<hr><div class=\"container\" id=\"sortedTable\"><table class=\"table\"><thead><tr><th scope=\"col\">Name</th><th scope=\"col\">Dex. Mod</th><th scope=\"col\">Initiative</th></tr></thead><tbody>";

    // Format and append new data into row
    for (i = 0; i < players.length; i++) {
        sortedTable += "<tr>";
        sortedTable += "<td class=\"name\">" + players[i][NAME] + "</td>";
        sortedTable += "<td class=\"dex\">" + players[i][DEX_MOD].toString() + "</td>";
        sortedTable += "<td class=\"init\">" + players[i][INITIATIVE].toString() + "</td>";
        sortedTable += "</tr>";
    }

    sortedTable += "</tbody></table></div>"
    $("body").append(sortedTable);
    // End test
}
