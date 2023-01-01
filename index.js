/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// make string with currency symbol and comma-separated digits
function makeCurrencyStr(amount) {
    return amount.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:0, currencyDisplay:"code"});
}

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    var pledges =  new Array(games.length);
    var goals =  new Array(games.length);

    // loop over each item in the data
    for (let i = 0; i < games.length; ++i) {

        // create a new div element, which will become the game card
        const element = document.createElement("div");

        // add the class game-card to the list
        element.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        var progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");
        progressBar.innerHTML = `&nbsp;${Math.round(games[i].pledged / games[i].goal * 100)}%`;
        progressBar.style.width = `${Math.min(100, games[i].pledged / games[i].goal * 100)}%`;

        var amountString = document.createElement("p");
        amountString.classList.add("amt-counter");
        amountString.innerHTML = `Raised ${makeCurrencyStr(games[i].pledged)} out of ${makeCurrencyStr(games[i].goal)}`;

        const display = `
            <img class="game-img" src = ${games[i].img} width=100%>
            <h2> <span class="bound">${games[i].name} </h2>
            ${amountString.outerHTML}
            ${progressBar.outerHTML}
            <p> <span class="bound">${games[i].description} </p>
        `;
        element.innerHTML = display;

        // append the game to the games-container
        gamesContainer.append(element);

        pledges[i] = games[i].pledged;
        goals[i] = games[i].goal;
    }

    return [pledges, goals];
}

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalBackers = GAMES_JSON.reduce((acc, game) => acc + game.backers, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<h3> ${totalBackers.toLocaleString('en-US')} </h3>`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalAmount = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `<h3> ${makeCurrencyStr(totalAmount)} </h3>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `<h3> ${GAMES_JSON.length} </h3>`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// animate progress bar
var mouseLeft = new Array(GAMES_JSON.length).fill(false);
var progressComplete = new Array(GAMES_JSON.length).fill(false);
var gameCards = document.querySelectorAll(".game-card");
var progressBars = document.querySelectorAll(".progress-bar");
var amountStrings = document.querySelectorAll(".amt-counter");

function animateProgress(pledges, goals) {
    for (let i = 0; i < gameCards.length; i++) {
        gameCards[i].addEventListener("mouseenter", function() {
            var progress = 0, progress100 = 0;
            var percent = pledges[i] / goals[i] * 100;
            var percent100 = Math.min(100, percent);
            var pledge = 0, goal = 0;
            var interval = setInterval(function() {
                if (mouseLeft[i] == false) {
                    if (progress100 >= percent100) {
                        progressBars[i].style.width = percent100 + "%";
                        progressBars[i].innerHTML = `&nbsp;${Math.round(percent)}%`;
                        amountStrings[i].innerHTML = `Raised ${makeCurrencyStr(pledges[i])} out of ${makeCurrencyStr(goals[i])}`;
                        clearInterval(interval);
                        progressComplete[i] = true;
                    }
                    else {
                        progressBars[i].style.width = progress100 + "%";
                        progressBars[i].innerHTML = `&nbsp;${Math.round(progress)}%`;
                        amountStrings[i].innerHTML = `Raised ${makeCurrencyStr(pledge)} out of ${makeCurrencyStr(goal)}`;
                        progress100 += percent100 / 80;
                        progress += percent / 80;
                        pledge += pledges[i] / 80;
                        goal += goals[i] / 80;
                    }
                }
                else {
                    clearInterval(interval);
                    mouseLeft[i] = false;
                }
            }, 10);
        });
        gameCards[i].addEventListener("mouseleave", function() {
            mouseLeft[i] = true;
            var percent = pledges[i] / goals[i] * 100;
            progressBars[i].style.width = Math.min(100, percent) + "%";
            progressBars[i].innerHTML = `&nbsp;${Math.round(percent)}%`;
            amountStrings[i].innerHTML = `Raised ${makeCurrencyStr(pledges[i])} out of ${makeCurrencyStr(goals[i])}`;
            if ((mouseLeft[i] == true) && (progressComplete[i] == true)) {
                mouseLeft[i] = false;
                progressComplete[i] = false;
            }
        });
    }
}

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let underfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    let [pledges, goals] = addGamesToPage(underfundedGames);

    mouseLeft = new Array(underfundedGames.length).fill(false);
    progressComplete = new Array(underfundedGames.length).fill(false);
    gameCards = document.querySelectorAll(".game-card");
    progressBars = document.querySelectorAll(".progress-bar");
    amountStrings = document.querySelectorAll(".amt-counter");
    animateProgress(pledges, goals);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fullyFundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    let [pledges, goals] = addGamesToPage(fullyFundedGames);

    mouseLeft = new Array(fullyFundedGames.length).fill(false);
    progressComplete = new Array(fullyFundedGames.length).fill(false);
    gameCards = document.querySelectorAll(".game-card");
    progressBars = document.querySelectorAll(".progress-bar");
    amountStrings = document.querySelectorAll(".amt-counter");
    animateProgress(pledges, goals);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    let [pledges, goals] = addGamesToPage(GAMES_JSON);

    mouseLeft = new Array(GAMES_JSON.length).fill(false);
    progressComplete = new Array(GAMES_JSON.length).fill(false);
    gameCards = document.querySelectorAll(".game-card");
    progressBars = document.querySelectorAll(".progress-bar");
    amountStrings = document.querySelectorAll(".amt-counter");
    animateProgress(pledges, goals);
}

// show all games when page loads
allBtn.classList.add('highlighted');
showAllGames();

// add event listeners with the correct functions to each button
const buttons = document.querySelectorAll('.button-highlight');
unfundedBtn.addEventListener("click", event => {
    buttons.forEach(b => b.classList.remove('highlighted'));
    event.target.classList.add('highlighted');
    filterUnfundedOnly();
});
fundedBtn.addEventListener("click", event => {
    buttons.forEach(b => b.classList.remove('highlighted'));
    event.target.classList.add('highlighted');
    filterFundedOnly();
});
allBtn.addEventListener("click", event => {
    buttons.forEach(b => b.classList.remove('highlighted'));
    event.target.classList.add('highlighted');
    showAllGames();
});

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const underfundedCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// create a string that explains the number of unfunded games using the ternary operator
const statusStr = `A total of ${makeCurrencyStr(totalAmount)} has been raised for ${GAMES_JSON.length} games. 
                   Currently, ${underfundedCount} game${underfundedCount == 1? " remains" : "s remain"} underfunded. 
                   We need your help funding these amazing games!`

// create a new DOM element containing the template string and append it to the description container
descriptionContainer.append(statusStr);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = [...GAMES_JSON].sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [firstGame, secondGame] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGame = document.createElement("div");
topGame.innerHTML = firstGame.name;
firstGameContainer.append(topGame);

// do the same for the runner up item
const runnerUpGame = document.createElement("div");
runnerUpGame.innerHTML = secondGame.name;
secondGameContainer.append(runnerUpGame);
