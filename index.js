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
    return amount.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:0});
}

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

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
        const display = `
            <img src = ${games[i].img} width=100%>
            <h3> ${games[i].name} </h3>
            <p> Raised ${makeCurrencyStr(games[i].pledged)} out of ${makeCurrencyStr(games[i].goal)} </p>
            <progress id="progress" value="${games[i].pledged / games[i].goal * 100}" max="100"></progress>
            <p> ${games[i].description} </p>
        `;
        element.innerHTML = display;

        // append the game to the games-container
        gamesContainer.append(element);
    }
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

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let underfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(underfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fullyFundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fullyFundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// preselect allBtn when the page loads
allBtn.classList.add('highlighted');
addGamesToPage(GAMES_JSON);

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
