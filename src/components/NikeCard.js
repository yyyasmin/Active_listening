import React from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";

// const catImage = require("../assets/textures/catImage.png");
const yasminLogo = require("../assets/textures/yasminLogo.PNG");


const computeCardSize = (cardSize) => {
  
  //console.log("IN computeCardSize -- Card Size: ", cardSize); // Log the cardSize

  let cWidth = `${cardSize.card.width}px`;
  let cHeight = `${cardSize.card.height}px`;

  let gWidth = `${cardSize.gap.width}px`;
  gWidth = gWidth ? gWidth : "100px";

  let gHeight = `${cardSize.card.height}px`;
  gHeight = gHeight ? gHeight : "100px";

  let resCardSize = {
    width: cWidth,
    height: cHeight,
    gap: `${gHeight} ${gWidth}`, // Adjusted gap style attribute here
  };

  return resCardSize;
};


const CardContainer = styled.div`
  ${({ cardSize }) => computeCardSize(cardSize)}

  display: flex;
  flex-direction: column;
  cursor: grab;
  overflow: hidden;
  position: relative;
  border-radius: 25px;
  border: 6
  px solid brown;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  object-fit: fill;
  resizeMode:'contain'
`;

const NikeCard =  ( props ) =>  {
  
  let { card, cardSize, isFlipped, toggleCardFlip } = props;
  
  const handleCardClick = () => {
    if ( toggleCardFlip != null )  {
      toggleCardFlip(card.id);
    }
  };

  return (
    <ReactCardFlip isFlipped={isFlipped}>

      <CardContainer cardSize={cardSize} onClick={handleCardClick}>
        <CardImage src={card.imageImportName} alt={card.name} />
      </CardContainer>

      <CardContainer cardSize={cardSize} onClick={handleCardClick}>
          <CardImage src={yasminLogo} alt={card.name} />
      </CardContainer>

    </ReactCardFlip>
  );
};

export default NikeCard;
