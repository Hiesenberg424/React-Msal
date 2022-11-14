import "./App.css";
import { config } from "./config/Config";
import { PublicClientApplication } from "@azure/msal-browser";
// import { MsalProvider } from "@azure/msal-react";
import { useState } from "react";
import styled from "styled-components";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const publicClientApp = new PublicClientApplication({
    auth: {
      clientId: config.appId,
      redirectUri: config.redirectUri,
      authotity: config.authority,
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
    },
  });

  async function logout() {
    await publicClientApp.logoutRedirect();
  }

  async function login() {
    try {
      var auth = await publicClientApp.loginPopup({
        scopes: config.scopes,
        prompt: "select_account",
      });
      sessionStorage.setItem("accessToken_token", auth.accessToken);
      setIsAuthenticated(true);
      setUser(auth);
      console.log(user);
    } catch (err) {
      console.log(err);
      setIsAuthenticated(false);
    }
  }

  const Button = styled.button`
    background-color: white;
    color: black;
    font-size: 20px;
    padding: 10px 60px;
    border-radius: 5px;
    margin: 10px 0px;
    cursor: pointer;
    &:disabled {
      color: grey;
      opacity: 0.7;
      cursor: default;
    }
  `;

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {!isAuthenticated ? (
            <Button onClick={() => login()}>Login</Button>
          ) : (
            <Button onClick={() => logout()}>Logout</Button>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
