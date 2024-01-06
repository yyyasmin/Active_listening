import React, { useEffect, useState } from "react";
import { navigate } from "@reach/router";
import styled from "styled-components";
import RoomCard from "./RoomCard";
import isEmpty from "../helpers/isEmpty";
import { updateCr, addNewActiveRoom, removeUpdatedRoomDataListener } from "../clientSocketServices";

const RoomsListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #fad5a5;
  border-radius: 25px;
  height: 100%;
`;

const RoomCreateButton = styled.button`
  background-color: #92ddea;
  border: none;
  color: brown;
  text-align: center;
  text-decoration: none;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
  padding: 10px;
  margin: 10px;
  &:hover {
    background-color: #fad5a5;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px;
  box-sizing: border-box;
  border: 2px solid #fad5a5;
  border-radius: 25px;
  font-size: 1rem;
`;

const RoomsList = ({ userName, roomsInitialData }) => {
  const [cr, setCr] = useState({});

  useEffect(() => {
    updateCr(setCr);
    return () => {
      removeUpdatedRoomDataListener();
    };
  }, []);

  const handleJoinRoomClick = async (room) => {
    console.log("handleJoinRoomClick -- room, userName: ", room, userName);
    if (!isEmpty(room) && !isEmpty(userName)) {
      navigate(`/game/${room.id}`, {
        state: { userName, currentRoom: room },
      });
    }
  };

  const handleCreateRoomClick = async () => {
    console.log("handleCreateRoomClick -- userName: ", userName);
    const newRoom = await addNewActiveRoom(userName);
    console.log("handleCreateRoomClick -- newRoom: ", newRoom);
    if (!isEmpty(newRoom)) {
      navigate(`/game/${newRoom.id}`, {
        state: { userName, currentRoom: newRoom },
      });
    }
  };

  return (
    <RoomsListContainer>
      {!isEmpty(roomsInitialData) &&
        roomsInitialData.map((room, index) => (
          <RoomCard
            key={index}
            room={room}
            onJoinRoomClick={handleJoinRoomClick}
          />
        ))}
      <StyledInput
        type="text"
        placeholder="Enter room name"
        // value={newRoomName}
        // onChange={(e) => setNewRoomName(e.target.value)}
      />
      <RoomCreateButton onClick={handleCreateRoomClick}>
        Create Room
      </RoomCreateButton>
    </RoomsListContainer>
  );
};

export default RoomsList;
