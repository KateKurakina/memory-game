const body = document.querySelector('body');

function shuffle(doubleCardsArr) {
    for (let i = doubleCardsArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [doubleCardsArr[i], doubleCardsArr[j]] = [doubleCardsArr[j], doubleCardsArr[i]];
    }
    return doubleCardsArr;
}

function createDoubleCards(cards) {
    return [...cards, ...cards];
}

async function getCards(cardsContainer) {
    try {
        const response = await fetch('./cards.json');
        const cardsData = await response.json();

        const doubleCards = createDoubleCards(cardsData);
        const shuffledCards = shuffle(doubleCards);

        renderCards(shuffledCards, cardsContainer);
    } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
}

let countersTries, countersScore;
let cards;

function renderHtml() {
    const header = document.createElement('header');
    header.classList.add('header');

    const containerHeader = document.createElement('div');
    containerHeader.classList.add('container', 'header__container');

    const headerButtonNewGame = document.createElement('button');
    headerButtonNewGame.classList.add('header__button', 'header__button-new-game');
    headerButtonNewGame.textContent = 'New Game';

    headerButtonNewGame.addEventListener('click', startNewGame);

    const headerButtonLeaders = document.createElement('button');
    headerButtonLeaders.classList.add('header__button', 'header__button-leaders');
    headerButtonLeaders.textContent = 'Leaders';

    containerHeader.append(headerButtonNewGame, headerButtonLeaders);
    header.append(containerHeader);
    body.append(header);


    const main = document.createElement('main');
    main.classList.add('main');

    const containerMain = document.createElement('div');
    containerMain.classList.add('container', 'main__container');

    const counters = document.createElement('div');
    counters.classList.add('counters');

    countersTries = document.createElement('p');
    countersTries.classList.add('counters__tries');
    countersTries.textContent = `Tries: 0`;

    countersScore = document.createElement('p');
    countersScore.classList.add('counters__score');
    countersScore.textContent = 'Score: 0';

    cards = document.createElement('div');
    cards.classList.add('cards');

    counters.append(countersTries, countersScore);
    containerMain.append(cards, counters);
    main.append(containerMain);
    body.append(main);

    getCards(cards);
}

function updateTriesDisplay(tries) {
  if (countersTries) {
    countersTries.textContent = `Tries: ${tries}`;
  } 
}

function updateCountersDisplay(score) {
  if (countersScore) {
    countersScore.textContent = `Score: ${score}`;
  } 
}

function cardDisabled() {
  cardsArray.forEach((cardEl) => {
    if (!cardEl.classList.contains('opened')) {
      cardEl.disabled = true;
    }
  })
}

function cardEnabled() {
  cardsArray.forEach((cardEl) => {
    if (!cardEl.classList.contains('opened')) {
      cardEl.disabled = false;
    }
  })
}

function resetCounters() {
  tries = 0;
  score = 0;

  updateTriesDisplay(tries);
  updateCountersDisplay(score);
}

function shuffleCardsOnBoard() {
  const shuffledCards = [...cardsArray];

  shuffle(shuffledCards);

  shuffledCards.forEach((card) => {
    cards.append(card);
  });
}

function closeAllCards() {
  cardsArray.forEach((card) => {
    card.classList.remove('is-open');
    card.classList.remove('opened');
    card.disabled = false;
  });
}

function startNewGame() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }

  firstEl = null;
  firstCardId = null;

  closeAllCards()

  shuffleCardsOnBoard()

  resetCounters();
}

let firstEl = null;
let firstCardId = null;

let closeTimer = null;

let tries = 0;
let score = 0;

const cardsArray = []; 

function renderCards(data, cardsContainer) {
  data.forEach((el) => {
    const card = document.createElement('button');
    card.classList.add('card');
    card.dataset.id = el.pairId;
    cardsArray.push(card);

    card.addEventListener('click', () => {
      card.classList.add('is-open');
      card.disabled = true;

      if (firstCardId) {
        cardDisabled();
      
        if (firstCardId === card.dataset.id) {
          firstEl.classList.add('opened');
          card.classList.add('opened');

          firstCardId = 0;
          firstEl = null;

          tries++;
          updateTriesDisplay(tries);
          score++;
          updateCountersDisplay(score);

          cardEnabled();

          closeTimer = null;
        } else {
          closeTimer = setTimeout(() => {
            card.classList.remove('is-open');
            firstEl.classList.remove('is-open');

            firstCardId = 0;
            firstEl = null;
            tries++;
            updateTriesDisplay(tries);

            cardEnabled()
          }, 1500); 
        }
      } else {
        firstCardId = card.dataset.id;
        firstEl = card;
      }
    });

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(el.svg, "image/svg+xml");
    const svgElement = xmlDoc.documentElement;
    svgElement.classList.add('card__image');

    const cardPar = document.createElement('p');
    cardPar.classList.add('card__par');
    cardPar.textContent = "?";

    card.append(svgElement, cardPar);
    cardsContainer.append(card);
  });
}

renderHtml();