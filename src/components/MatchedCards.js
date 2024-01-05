import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: grab;
  overflow: hidden;
  position: relative;
  margin: 10px;
  border-radius: 25px;
  border: 6px solid brown;
  display: flex;
  max-width: 300px;
  height: calc(100vh - 22vh); /* Adjusted to use the full height of the screen */
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
  const { index, players, card } = props;

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
