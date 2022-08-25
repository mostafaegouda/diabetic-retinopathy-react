import "./App.css";
import styled from "styled-components";
import UniLogo from "./assets/uni_logo.png";
import RetinoLogo from "./assets/retinopathy_logo.png";
import ToolStepper from "./components/ToolStepper";
import auth from "./firebaseAuth";
import { createContext } from "react";
import { useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "@mui/material";
import Login from "./components/Login";

const Container = styled.div`
  width: 80%;
  max-width: 1920px;
  margin-inline: auto;
  padding-block: 1.5rem;
  @media (max-width: 768px) {
    width: 95%;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4rem;
`;

const Header = styled(Container)`
  padding: 2rem 0 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  img {
    width: 170px;
    @media (max-width: 768px) {
      width: 120px;
    }
  }
`;

const VerticalRuler = styled.span`
  height: 3rem;
  width: 2px;
  border-radius: 1rem;
  background-color: #d8d8d8;
`;

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
  const handleSignOut = () => {
    signOut(auth);
  };

  let CurrentContainer = user ? Container : LoginContainer;
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header>
        <img src={UniLogo} alt="" />
        <VerticalRuler />
        <img src={RetinoLogo} alt="" />
        {user && <Button onClick={handleSignOut}>Logout</Button>}
      </Header>
      <CurrentContainer>{user ? <ToolStepper /> : <Login />}</CurrentContainer>
    </UserContext.Provider>
  );
}

export default App;
