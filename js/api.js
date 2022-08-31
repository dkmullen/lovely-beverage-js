const baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';
const random = 'random.php';
const byLetter = 'search.php?f='; // plus a letter
const byIngredient = 'filter.php?i='; // plus an ingredient
const drinkDetails = 'lookup.php?i='; // plus the id number of a drink

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

function mixMeARandomDrink(e) {
  // e.preventDefault();
  getMeADrink(random).then((data) => {
    drinkData = data.drinks[0];
    document.querySelector('#beverage-name').innerHTML = drinkData.strDrink;
    let photo = document.querySelector('#beverage-photo');
    photo.src = drinkData.strDrinkThumb;
    photo.alt = `A photo of the drink ${drinkData.strDrink}`;
  });
}

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
    <div class="letter-square" onclick="check('${l}')">
      <span class="letter" aria-label="button for ${l}">${l}</span>
    </div>
    `;
  });
  document.querySelector('#letter-bar').innerHTML = letterStr;
}

function check(l) {
  console.log(l);
}

window.onload = makeButtons();
