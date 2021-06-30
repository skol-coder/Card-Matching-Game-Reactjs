import React from "react";
import "./styles.scss";
import classnames from "classnames";
const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled }) => {
  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index);
  };

  return (
    <div
      className={classnames("card", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive
      })}
      onClick={handleClick}
    >
      <div className="card-face card-font-face">
        <img
          src="https://s6.gifyu.com/images/111110a166f7b57d22c19.jpg"
          alt=" "
        />
      </div>
      <div className="card-face card-back-face">
        <img src={card.image} alt="Intresting meme here" />
      </div>
    </div>
  );
};

export default Card;
