import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";
import Home from "./Components/Home";
import Room from "./Components/Room";
import "./App.css";

const socket = io(`http://localhost:8000`, { transports: [`websocket`] });
function App() {
  //* Put in reducer [username, personalId, hostState, callerInfo, callAccepted, recievingCall, videoStream]
  const [username, setUsername] = useState<string>("");
  const [personalId, setPersonalId] = useState<string>("");

  useEffect(() => {
    if (!personalId) {
      socket.on(`personalId`, (id) => {
        console.log(`id`, id);
        setPersonalId(id);
      });
    }
  }, [personalId]);

  return (
    <div className="App">
      <Switch>
        <Route path="/room/:roomId">
          <Room
            setPersonalId={setPersonalId}
            personalId={personalId}
            username={username}
            setUsername={setUsername}
            socket={socket}
          />
        </Route>
        <Route path="/">
          <Home
            personalId={personalId}
            username={username}
            setUsername={setUsername}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
