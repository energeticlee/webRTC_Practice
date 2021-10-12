import React, { FC } from "react";
import { useHistory } from "react-router-dom";

interface Props {
  personalId: string;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const Home: FC<Props> = ({ personalId, username, setUsername }) => {
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history.push(`/room/${personalId}`);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label>Name</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
      />
      <button type="submit">Create Room</button>
    </form>
  );
};

export default Home;
