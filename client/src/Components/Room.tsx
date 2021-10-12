import e from "cors";
import React, { FC, useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CallerForm from "./CallerForm";
import Peer from "simple-peer";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { Socket } from "socket.io-client";

interface Props {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPersonalId: React.Dispatch<React.SetStateAction<string>>;
  personalId: string;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

interface IHostState {
  receivingCall?: boolean;
  hostSignal?: Peer.SignalData | string;
}

interface ICallerInfo {
  callerId: string;
  callerName: string;
  callerSignal: Peer.SignalData | string;
}

const Room: FC<Props> = ({
  username,
  setUsername,
  personalId,
  setPersonalId,
  socket,
}) => {
  const { roomId } = useParams<{ roomId: string }>();

  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [videoStream, setVideoStream] = useState<MediaStream | undefined>();
  const [hostState, setHostState] = useState<IHostState | undefined>();
  const [callerInfo, setCallerInfo] = useState<ICallerInfo | undefined>();
  const connectionRef = useRef<Peer.Instance | null>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setVideoStream(stream);
        if (myVideo.current) myVideo.current.srcObject = stream;
      });

    console.log("personalId", personalId);
    if (!personalId) {
      console.log("personalId", personalId);
      socket.on(`personalId`, (id) => {
        console.log(`id`, id);
        setPersonalId(id);
      });
    }

    //* ONLY HOST WILL HAVE THIS
    socket.on(`request-approval`, (data) => {
      setReceivingCall(true);
      console.log("data", data);
      setCallerInfo({
        callerId: data.userId,
        callerName: data.name,
        callerSignal: data.signal,
      });
    });
  }, []);

  const callUser = (idToCall: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: videoStream,
    });
    peer.on(`signal`, (data) => {
      socket.emit(`request-join`, {
        userToCall: idToCall,
        signalData: data,
        from: personalId,
        name: username,
      });
    });
    peer.on(`stream`, (stream) => {
      if (userVideo.current) userVideo.current.srcObject = stream;
    });
    socket.on(`request-accepted`, (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: videoStream,
    });
    peer.on(`signal`, (data) => {
      socket.emit(`accept-request`, {
        signal: data,
        callerId: callerInfo?.callerId,
      });
    });
    //* Emitted when a remote peer adds a stream
    peer.on(`stream`, (stream) => {
      if (userVideo.current) userVideo.current.srcObject = stream;
    });

    if (callerInfo) peer.signal(callerInfo.callerSignal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    if (connectionRef.current) connectionRef.current.destroy();
  };

  const display = () => {
    if (callAccepted) return <button onClick={endCall}>End Call</button>;
    else if (personalId === roomId) {
      if (receivingCall)
        return <button onClick={answerCall}>Answer Call</button>;
      else return <p>Waiting for caller...</p>;
    } else
      return (
        <CallerForm
          username={username}
          setUsername={setUsername}
          callUser={callUser}
          roomId={roomId}
        />
      );
  };

  return (
    <div>
      <video
        playsInline
        muted
        ref={myVideo}
        autoPlay
        style={{ width: "300px" }}
      />
      {callAccepted && (
        <video
          playsInline
          ref={userVideo}
          autoPlay
          style={{ width: "300px" }}
        />
      )}
      {display()}
    </div>
  );
};

export default Room;
