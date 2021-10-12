import React, { FC, useState } from "react";

interface Props {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  callUser: (idToCall: string) => void;
  roomId: string;
}

const Caller: FC<Props> = ({ username, setUsername, callUser, roomId }) => {
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const handleCallUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCalling(true);
    callUser(roomId);
  };

  return (
    <div>
      {isCalling ? (
        <p>Calling...</p>
      ) : (
        <form onSubmit={(e) => handleCallUser(e)}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <button type="submit">Call Host</button>
        </form>
      )}
    </div>
  );
};

export default Caller;
