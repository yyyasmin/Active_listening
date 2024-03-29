import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const NameFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;

`;

const NameInput = styled.input`
  font-size: 2rem;
  font-weight: 600;
`;

const SubmitButton = styled.button`
  background-color: #fbbe01;
  color: #000;
  text-transform: uppercase;
  font-size:  2rem;
  font-weight: 600;
  border: 3px solid transparent;
  outline: none;
  cursor: pointer;
  transition: all 290ms ease-in-out;
  border-radius: 8px;
  

  &:hover {
    background-color: transparent;
    color: #fff;
    border: 3px solid #fbbe01;
  }
`;

function NameForm({ setUserName }) {
  const [name, setName] = useState("");
  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserName(name); // Set the user name
    navigate("/rooms"); // Redirect to the rooms page
  };

  return (
    <NameFormContainer>
      <h2>Enter your username:</h2>
      <form onSubmit={handleSubmit}>
        <NameInput
          type="text"
          placeholder="הכנס כתובת אימייל"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </NameFormContainer>
  );
}

export default NameForm;
