const baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';
const random = 'random.php';
const byLetter = 'search.php?f='; // plus a letter
const byIngredient = 'filter.php?i='; // plus an ingredient
const drinkDetails = 'lookup.php?i='; // plus the id number of a drink

// Called by other functions - the main api call to get one or more drinks
function getMeADrink(qStr, id = '') {
  let searchStr = id ? `${baseUrl}${qStr}${id}` : `${baseUrl}${qStr}`;
  return fetch(searchStr)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
}

let randomButton = document.querySelector('#random-button');
if (randomButton) {
  randomButton.addEventListener('click', mixMeARandomDrink);
}

// Called on index.html for the main display
function mixMeARandomDrink() {
  getMeADrink(random).then((data) => {
    drinkData = data.drinks[0];
    document.querySelector('#beverage-name').innerHTML = drinkData.strDrink;
    let photo = document.querySelector('#beverage-photo');
    photo.src = drinkData.strDrinkThumb;
    photo.alt = `A photo of the drink ${drinkData.strDrink}`;
  });
}

// Makes the letter buttons for display in footer
function makeButtons() {
  const letters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'v',
    'w',
    'y',
    'z',
  ];
  let letterStr = '';
  letters.forEach((l) => {
    letterStr += `
    <div class="letter-square" onclick="navTo('list', '${l}')">
      <span class="letter" aria-label="button for ${l}">${l}</span>
    </div>
    `;
  });
  document.querySelector('#letter-bar').innerHTML = letterStr;
}

function parseList(drink, type = 'strIngredient') {
  let list = [];
  for (let i in drink) {
    if (i.includes(type) && drink[i]) {
      list.push(drink[i]);
    }
  }
  return list;
}

function navTo(page, param) {
  window.location.href = `./${page}.html?item=${param}`;
}

// Fill in the 'list by letter' page
function getList() {
  let l = window.location.search.split('=')[1];
  getMeADrink(byLetter, l).then((drinkList) => {
    let drinkStr = '';
    drinkList.drinks.forEach((drink) => {
      let ingredients = parseList(drink);
      drinkStr += `
      <div class="drink-list-item" onclick="navTo('details', ${drink.idDrink})">
          <div>
              <img src="${drink.strDrinkThumb}" alt="Picture of ${drink.name}">
          </div>
          <div class="drink-list-label">
              <div class="drink-list-name">
                      ${drink['strDrink']}
              </div>
              <div class="drink-list-ingredients">Ingredients: ${ingredients.join(
                ', '
              )}</div>
          </div>
      </div>
      `;
    });

    document.querySelector('#drink-list').innerHTML += drinkStr;
  });
}

// Fill in the drink details page
function getDetails() {
  let id = window.location.search.split('=')[1];
  getMeADrink(drinkDetails, id).then((d) => {
    let drink = d.drinks[0];
    let ingredientsList = '';
    let ingredients = parseList(drink);
    let amounts = parseList(drink, 'strMeasure');
    // List ingredients and (if any) anmounts together
    for (let i of ingredients) {
      let amount = amounts[ingredients.indexOf(i)];
      ingredientsList += `
        <li>${i} ${amount ? amount : ''}</li>
      `;
    }
    drinkStr = `
      <div class="details-drink">
        <h1>${drink['strDrink']}</h1>
        <div>
            <img src="${drink.strDrinkThumb}" alt="Picture of ${drink.strDrink}">
        </div>
        <div class="info">
            <ul>
                ${ingredientsList}
            </ul>
        <div class="instructions">${drink.strInstructions}</div>
        <div>Serve in: ${drink.strGlass}</div>
        </div>
    </div>
    `;
    document.querySelector('#details-wrapper').innerHTML += drinkStr;
  });
}

window.onload = makeButtons();
