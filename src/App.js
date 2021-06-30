import { useState, useRef, useEffect } from "react";
import "./styles.scss";
import Card from "./Card.js";

const CardsArray = [
  {
    type: 1,
    image: "https://s6.gifyu.com/images/2f9bcc06413d6bcfa.jpg"
  },
  {
    type: 2,
    image: "https://s6.gifyu.com/images/36992c317e30788d6.jpg"
  },
  {
    type: 3,
    image: "https://s6.gifyu.com/images/468606fba478cb4f6.jpg"
  },
  {
    type: 4,
    image: "https://s6.gifyu.com/images/5a778c75209f1b078.jpg"
  },
  {
    type: 5,
    image: "https://s6.gifyu.com/images/620bb4993452c17bb.jpg"
  },
  {
    type: 6,
    image: "https://s6.gifyu.com/images/8278affcd12dd125b.jpg"
  }
];

function shuffleCards(array) {
  //Fisher–Yates shuffle Algorithm
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}
export default function App() {
  const [cards, setCards] = useState(() =>
    shuffleCards(CardsArray.concat(CardsArray))
  );
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
  );
  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === CardsArray.length) {
      setShowModal(true);
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem("bestScore", highScore);
    }
  };

  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].type === cards[second].type) {
      setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };
  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);
  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.type]);
  };

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    // set a shuffled deck of cards
    setCards(shuffleCards(CardsArray.concat(CardsArray)));
  };

  return (
    <div className="App">
      <header>
        <h3>Card Matching Game</h3>
      </header>
      <div className="container">
        {cards.map((card, index) => {
          return (
            <Card
              key={index}
              card={card}
              index={index}
              isDisabled={shouldDisableAllCards}
              isInactive={checkIsInactive(card)}
              isFlipped={checkIsFlipped(index)}
              onClick={handleCardClick}
            />
          );
        })}
      </div>
      <footer>
        <div className="score">
          <div className="moves">
            <span className="bold">Moves:</span> {moves}
          </div>
          {localStorage.getItem("bestScore") && (
            <div className="high-score">
              <span className="bold">Best Score:</span> {bestScore}
            </div>
          )}
          <div className="restart">
            <button onClick={handleRestart} color="primary" variant="contained">
              Restart Button
            </button>
          </div>
        </div>
      </footer>
      <dialog
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <dialogTitle id="alert-dialog-title">
          Hurray!!! You completed the challenge
        </dialogTitle>
        <dialogContent>
          <dialogContentText id="alert-dialog-description">
            You completed the game in {moves} moves. Your best score is{" "}
            {bestScore} moves.
          </dialogContentText>
        </dialogContent>
        <dialogActions>
          <button onClick={handleRestart} color="primary">
            Restart
          </button>
        </dialogActions>
      </dialog>
    </div>
  );
}
