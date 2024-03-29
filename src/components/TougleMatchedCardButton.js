import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3px;

`;


const ReturnButton = styled.button`
  text-align: center;
  cursor: pointer;
  position: relative;
  border-radius: 25px;
  
  background-color: #808000;
  color: #fad5a5;

  border: none;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
  box-shadow: 0px 5px 0px 0px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  flex-direction: row-reverse;
  &:active {
    transform: translateY(5px);
    box-shadow: none;
  }
`;


const TougleMatchedCardButton = (props) => {
  let { isMatched, setIsMatched, setClearFlippedCards } = props;

  return (
    <Container>
        {isMatched && (
            <ReturnButton
              onClick={() => {
                setClearFlippedCards(true);
              }}
            >
              Back to game board
            </ReturnButton>
        )}
        {!isMatched && (
          <ReturnButton
            onClick={() => {
              setIsMatched(!isMatched);
              setClearFlippedCards(true);
            }}
          >
            Keep going!
          </ReturnButton>
        )}
    </Container>
  );
};

export default TougleMatchedCardButton;
