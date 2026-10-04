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
let main;

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

    headerButtonLeaders.addEventListener('click', showLeaders);

    containerHeader.append(headerButtonNewGame, headerButtonLeaders);
    header.append(containerHeader);
    body.append(header);

    main = document.createElement('main');
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

function showLeaders() {

}

let winModal;
let winTries;

function createWinModal() {
  winModal = document.createElement('div');
  winModal.classList.add('win-modal');
  winModal.style.display = 'block';

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeWinModal();
    }
  })

  const winModalLayout = document.createElement('div');
  winModalLayout.classList.add('win-modal__layout');

  winModalLayout.addEventListener('click', () => {
    closeWinModal();
  })

  const winModalContainer = document.createElement('div');
  winModalContainer.classList.add('win-modal__container');

  const winCloseBtn = document.createElement('button');
  winCloseBtn.classList.add('win-modal__close-button');

  winCloseBtn.addEventListener('click', () => {
    closeWinModal();
  });

  const winMessage = document.createElement('p');
  winMessage.classList.add('win-modal__message');
  winMessage.textContent = 'You win!!!';

  winTries = document.createElement('p');
  winTries.classList.add('win-modal__tries');
  winTries.textContent = `Tries: ${tries}`;

  const winNewGame= document.createElement('button');
  winNewGame.classList.add('win-modal__new-game');
  winNewGame.textContent = 'New game';
  winNewGame.addEventListener('click', () => {
    closeWinModal()
    startNewGame();
  });

  winModalContainer.append(winCloseBtn, winMessage, winTries, winNewGame);
  winModal.append(winModalLayout, winModalContainer);
  main.append(winModal);
}

function closeWinModal() {
  winModal.style.display = 'none';
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
          if (score === 1) {
            if (winModal) {
              winTries.textContent = `Tries: ${tries}`;
              winModal.style.display = 'block';
            } else {
              createWinModal();
            }
          }

          cardEnabled();
        } else {
          closeTimer = setTimeout(() => {
            card.classList.remove('is-open');
            firstEl.classList.remove('is-open');

            firstCardId = 0;
            firstEl = null;
            tries++;
            updateTriesDisplay(tries);

            cardEnabled();

            closeTimer = null;
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