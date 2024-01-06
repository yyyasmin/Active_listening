import React from "react";
import styled from "styled-components";
import { getInitialGallerySize, calculateCardSize } from "../helpers/init";


const cardsAreaHeight = getInitialGallerySize().height;
const cardHeight = calculateCardSize(2).card.height - 5
const cardWidth = calculateCardSize(2).card.width - 5

console.log("IN MATCH -- cardsAreaHeight: ", cardsAreaHeight)
console.log("IN MATCH -- cardHeight: ", cardHeight)

const CardContainer = styled.div`
  width: 300px;
  height: ${cardHeight}px; // Use the variable here
  width: ${cardHeight}px; // Use the variable here

  display: flex;
  flex-direction: column;
  cursor: grab;
  overflow: hidden;
  position: relative;
  margin: 10px;
  border-radius: 25px;
  border: 8px solid brown;
  display: flex;
`;


const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 25px;
  background-color: brown;
  flex: 1;
`;

const ImageWrapper = styled.div`
  object-fit: cover;
  justify-content: center;
  border-radius: 25px;
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: strech;
  border-radius: 25px;
`;


const MatchedCards = (props) => {
  const { players, card } = props;

  console.log("MatchCards -- props: ", props)

  let secondPlayerIndex = players.findIndex((player) => !player.isActive);
  if ( secondPlayerIndex===-1 || secondPlayerIndex===undefined )  {
    secondPlayerIndex = 0
  }

  return (
    <CardContainer>
      <ContentWrapper>
        <ImageWrapper>
          <Image src={card.imageImportName} alt={card.imageImportName} />
        </ImageWrapper>
      </ContentWrapper>
    </CardContainer>
  );
};

export default MatchedCards;
