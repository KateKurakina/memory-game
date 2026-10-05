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

    createModal();

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

  closeAllCards();

  shuffleCardsOnBoard();

  resetCounters();
}

let modal;
let modalContent;

function createModal() {
  modal = document.createElement('div');
  modal.classList.add('modal');

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  })

  const modalLayout = document.createElement('div');
  modalLayout.classList.add('modal__layout');

  modalLayout.addEventListener('click', closeModal);

  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal__container');

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal__close-button');

  closeBtn.addEventListener('click', closeModal);

  modalContent = document.createElement('div');
  modalContent.classList.add('modal__content');
  
  modalContainer.append(closeBtn, modalContent);
  modal.append(modalLayout, modalContainer);
  main.append(modal);
}

function openModal(content) {
    modalContent.replaceChildren(content);
    modal.style.display = 'block';

    document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function showWinModal() {
  const content = document.createElement('div');
  content.classList.add('win-modal__content');

  const winMessage = document.createElement('p');
  winMessage.classList.add('win-modal__message');
  winMessage.textContent = 'You win!!!';

  const winTries = document.createElement('p');
  winTries.classList.add('win-modal__tries');
  winTries.textContent = `Tries: ${tries}`;

  const winNewGame= document.createElement('button');
  winNewGame.classList.add('win-modal__new-game');
  winNewGame.textContent = 'New game';

  winNewGame.addEventListener('click', () => {
    closeModal()
    startNewGame();
  });

  content.append(winMessage, winTries, winNewGame);

  openModal(content);
}

function showLeaders() {
  const content = document.createElement('div');
  content.classList.add('leaders-modal__content');

  const title = document.createElement('h2');
  title.classList.add('leaders-modal__title');
  title.textContent = 'Leaders';

  content.append(title);

  const savedResults = JSON.parse(localStorage.getItem('memoryGameResults')) || [];

  if (savedResults.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.classList.add('leaders-modal__empty');
    emptyMessage.textContent = 'No results';

    content.append(emptyMessage);

    openModal(content);
    return;
  }

  const table = document.createElement('table');
  table.classList.add('leaders-modal__table');

  const thead = document.createElement('thead');

  const headerRow = document.createElement('tr');

  const placeHeader = document.createElement('th');
  placeHeader.textContent = 'Position';

  const triesHeader = document.createElement('th');
  triesHeader.textContent = 'Tries';

  const dateHeader = document.createElement('th');
  dateHeader.textContent = 'Date';

  headerRow.append(placeHeader, triesHeader, dateHeader);
  thead.append(headerRow);

  const tbody = document.createElement('tbody');

  savedResults.forEach((result, index) => {
    const row = document.createElement('tr');

    const place = document.createElement('td');
    place.textContent = index + 1;

    const resultTries = document.createElement('td');
    resultTries.textContent = result.tries;

    const date = document.createElement('td');
    date.textContent = new Date(result.date).toLocaleDateString('ru-RU');

    row.append(place, resultTries, date);
    tbody.append(row);
  });

  table.append(thead, tbody);
  content.append(table);

  openModal(content);
}

function saveResult() {
  const savedResults = JSON.parse(localStorage.getItem('memoryGameResults')) || [];

  const result = {
    tries: tries,
    date: new Date().toISOString()
  };

  savedResults.push(result);

  savedResults.sort((a, b) => {
    if (a.tries !== b.tries) {
      return a.tries - b.tries;
    }

    return new Date(a.date) - new Date(b.date);
  });

  const topResults = savedResults.slice(0, 10);

  localStorage.setItem('memoryGameResults', JSON.stringify(topResults));
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

          firstCardId = null;
          firstEl = null;

          tries++;
          updateTriesDisplay(tries);
          score++;
          updateCountersDisplay(score);
          if (score === 8) {
            saveResult();
            showWinModal();
          }
          cardEnabled();
        } else {
          closeTimer = setTimeout(() => {
            card.classList.remove('is-open');
            firstEl.classList.remove('is-open');

            firstCardId = null;
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