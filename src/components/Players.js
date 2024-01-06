import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlayersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const Player = styled.div`
  font-size: 1rem;
  font-weight: ${(props) => (props.isPlayersTurn ? "650" : "500")};
  color: ${(props) => (props.isPlayersTurn ? "brown" : "lightbrown")};
`;

const PlayerName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #C4B454;
`;

const Turn = styled.div`
  font-size: 1rem;
  font-weight: 650;
  color: #808000;
`;

const Players = (props) => {
  const { players, playerName } = props

  const activePlayerIndex = players.findIndex((player) => player.isActive);
  const activePlayer = players[activePlayerIndex]

  return (
    <Container>
      <PlayersContainer>
        <PlayerName> 
          You are: {playerName}
        </PlayerName>

        <Turn> 
            It's {activePlayer ? activePlayer.name + "'s" : ""} turn
        </Turn>
      </PlayersContainer>
    </Container>
  );
};

export default Players;
