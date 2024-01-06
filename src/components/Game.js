import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NikeCard from "./NikeCard";
import Players from "./Players";
import isEmpty from "../helpers/isEmpty";
import MatchedCards from "./MatchedCards";
import TougleMatchedCardButton from "./TougleMatchedCardButton";
import { useLocation } from "react-router-dom";
import { calculateCardSize } from "../helpers/init";
import {
  updateCr,
  updateIsMatched,
  updatePlayerLeft,
  emitRemoveMemberFromRoom,
  emitRemoveRoomFromActiveRooms,
  emitCurentRoomChanged,
  emitCurentIsMatched,
} from "../clientSocketServices";

const GameContainer = styled.div`
  background-color: #fdf2e9;
  color: brown;
  border-radius: 25px;
  height: 100%;
`;

const Wellcome = styled.h1`
  font-size: 1rem;
  text-align: center;
  border-radius: 25px;
  margin: 1px;
`;

const CardGallery = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: #fad5a5;
  border-radius: 25px;
  height: 100%;
  justify-content: space-between;
`;

function Game() {
  const location = useLocation();
  const { userName, currentRoom } = location.state;

  console.log("IN GAME -- currentRoom: ", currentRoom);

  const [cr, setCr] = useState({});

  const [isMatched, setIsMatched] = useState(false);
  const [last2FlippedCards, setLast2FlippedCards] = useState([]);

  const [allFlippedCards, setAllFlippedCards] = useState([]);
  const [clearFlippedCards, setClearFlippedCards] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(null);

  const broadcastChangeCr = async (updatedCr) => {
    await console.log("broadcastChangeCr -- 1111 - updatedCr: ", updatedCr);
    if (!isEmpty(updatedCr)) {
      await emitCurentRoomChanged({ ...updatedCr });
    }
  };

  const broadcastChangeIsMatched = async (isMatched, last2FlippedCards) => {
    if (!isEmpty(cr) && !isEmpty(cr.currentPlayers))
      await emitCurentIsMatched(isMatched, last2FlippedCards);
  };

  const broadcastChangeCardSize = async (cr) => {
    let updateCrWithNewCardSize;
    if (!isEmpty(cr)) {
      console.log("IN broadcastChangeCardSize -- cr.cardsData: ", cr.cardsData);
      if (!isEmpty(cr.cardsData)) {
        let cardSize = calculateCardSize(cr.cardsData.length);
        updateCrWithNewCardSize = { ...cr, cardSize: cardSize };
      }
      broadcastChangeCr(updateCrWithNewCardSize);
    }
  };

  const resetPlayersFlippCount = () => {
    console.log("IN resetPlayersFlippCount -- cr: ", cr);
    let updatedCurrentPlayers;
    if (!isEmpty(cr.currentPlayers)) {
      updatedCurrentPlayers = cr.currentPlayers.map((player) => ({
        ...player,
        flippCount: 0,
      }));
    }
    const updatedCr = { ...cr, currentPlayers: updatedCurrentPlayers };
    broadcastChangeCr(updatedCr);
  };

  const handleResize = () => {
    broadcastChangeCardSize(cr);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    updateCr(setCr);
    broadcastChangeCr(currentRoom);
    updateIsMatched(setIsMatched, setLast2FlippedCards);
    if (!isEmpty(currentRoom) && !isEmpty(userName)) {
      broadcastChangeCardSize(currentRoom);
    }
  }, [currentRoom, userName]);

  window.onbeforeunload = async function (e) {
    await updatePlayerLeft(setPlayerLeft);
    await updateCr(setCr);
    if (!isEmpty(userName) && !isEmpty(cr)) {
      await emitRemoveMemberFromRoom({
        playerName: userName,
        chosenRoom: cr,
      });
      if (!isEmpty(cr) && isEmpty(cr.currentPlayers)) {
        emitRemoveRoomFromActiveRooms(cr.id);
      }
    }
    var dialogText = "Are you really sure you want to leave?";
    console.log("Game -- handleBeforeUnload -- dialogText: ", dialogText);
    e.returnValue = dialogText;
    return dialogText;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const asyncClear = async () => {
      if (clearFlippedCards) {
        await setAllFlippedCards([]);
        await broadcastChangeIsMatched(false, [], 0);
        await resetPlayersFlippCount();
        await setClearFlippedCards(false);
        console.log(
          "useEffect[clearFlippedCards] -- isMatched, cr.currentPlayers: ",
          isMatched,
          cr.currentPlayers
        );
      }
    };
    asyncClear();
  }, [clearFlippedCards, cr.currentPlayers, isMatched, resetPlayersFlippCount]);

  const togglePlayerTurn = () => {
    const updatedCurrentPlayers = cr.currentPlayers.map((player) => ({
      ...player,
      isActive: !player.isActive,
      flippCount: 0,
    }));
    const updatedRoom = { ...cr, currentPlayers: updatedCurrentPlayers };
    broadcastChangeCr(updatedRoom);
  };

  const checkForMatch = (updatedCard) => {
    const newAllFlippedCards = [...allFlippedCards, updatedCard];
    let tmpIsMatched = false;

    setAllFlippedCards(newAllFlippedCards);
    if (newAllFlippedCards.length % 2 === 0) {
      const last2FlippedCards = newAllFlippedCards.slice(-2);
      console.log(
        "IN checkForMatch -- last2FlippedCards: ",
        last2FlippedCards
      );
      if (last2FlippedCards[0].name === last2FlippedCards[1].name) {
        tmpIsMatched = true;
      }
      if (tmpIsMatched) {
        console.log("broadcasting -- ", true, last2FlippedCards);
        broadcastChangeIsMatched(true, last2FlippedCards);
      } else {
        broadcastChangeIsMatched(false, last2FlippedCards);
        // Handle non-matching cards here...
      }
    }
  };

  const getActivePlayer = () => {
    const activePlayer = cr.currentPlayers.find((player) => player.isActive);
    return { ...activePlayer };
  };

  const handleFlippCount = () => {
    let activePlayer = getActivePlayer();
    if (
      !isEmpty(activePlayer) &&
      cr.currentPlayers.length > 0 &&
      !isEmpty(userName) &&
      cr.id > -1
    ) {
      activePlayer.flippCount++;
      console.log("IN handleFlippCount -- activePlayer: ", activePlayer);
      const updatedCurrentPlayers = cr.currentPlayers.map((player) => {
        if (player.name === activePlayer.name) {
          return activePlayer;
        }
        return player;
      });
      const updatedCr = { ...cr, currentPlayers: updatedCurrentPlayers };
      console.log("IN handleFlippCount -- updatedCr: ", updatedCr);
      broadcastChangeCr(updatedCr);
    }
  };

  const flipCard = async (card) => {
    if (!isEmpty(cr) && !isEmpty(cr.currentPlayers)) {
      let activePlayer = getActivePlayer();
      if (activePlayer.flippCount < 2) {
        await handleFlippCount();
        checkForMatch(card);
      } else {
        console.log("ELSE handleFlippCount -- activePlayer: ", activePlayer);
        await togglePlayerTurn();
        handleFlippCount();
        checkForMatch(card);
      }
    }
  };

  const onToggleMatchedCardClick = () => {
    console.log("IN onToggleMatchedCardClick -- cr: ", cr);
    if (!isEmpty(cr)) {
      let updatedCr = { ...cr, showMatchedCards: !cr.showMatchedCards };
      console.log("IN onToggleMatchedCardClick -- updatedCr: ", updatedCr);
      broadcastChangeCr(updatedCr);
    }
  };

  const onLeaveRoomClick = () => {
    console.log("IN onLeaveRoomClick -- userName, cr: ", userName, cr);
    if (!isEmpty(userName) && !isEmpty(cr)) {
      updatePlayerLeft(setPlayerLeft);
      emitRemoveMemberFromRoom({
        playerName: userName,
        chosenRoom: cr,
      });
      if (!isEmpty(cr) && isEmpty(cr.currentPlayers)) {
        emitRemoveRoomFromActiveRooms(cr.id);
      }
    }
  };

  return (
    <GameContainer>
      <Wellcome>
        Wellcome {userName} to room number {cr.id}
      </Wellcome>
      <CardGallery>
        {!isEmpty(cr) &&
          !isEmpty(cr.cardsData) &&
          cr.cardsData.map((card, index) => (
            <NikeCard
              key={index}
              card={card}
              flipCard={flipCard}
              isFlipped={allFlippedCards.includes(card)}
              isMatched={
                cr.matchedCardsData.some(
                  (matchedCard) => matchedCard.name === card.name
                ) || cr.showMatchedCards
              }
            />
          ))}
      </CardGallery>
      <MatchedCards
        matchedCardsData={cr.matchedCardsData}
        showMatchedCards={cr.showMatchedCards}
        onToggleMatchedCardClick={onToggleMatchedCardClick}
      />
      <Players
        currentPlayers={cr.currentPlayers}
        playerLeft={playerLeft}
        onLeaveRoomClick={onLeaveRoomClick}
      />
      <TougleMatchedCardButton
        onToggleMatchedCardClick={onToggleMatchedCardClick}
      />
    </GameContainer>
  );
}

export default Game;
