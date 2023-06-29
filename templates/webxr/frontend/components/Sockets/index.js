import React, { useState, useEffect } from "react";
import useSocketIO from "react-use-websocket";
import { wsApiURL } from "./../../utils";
import socketStore from "./../../stores/socket";
import cognitoStore from "./../../stores/cognito";
import positionsStore from "../../stores/positions";
import avatarStore from "../../stores/avatar";
import movementStore from "../../stores/movement";
import framesStore from "../../stores/frames";
import deviceStore from "../../stores/device";

const Sockets = (props) => {
  const { children } = props;
  const { cognito } = cognitoStore();
  const [trigger, setTrigger] = useState(false);
  const [socketUrl] = useState(`${wsApiURL}?token=${cognito.jwt}`);
  const { setSendJsonMessage, setLastJsonMessage } = socketStore();
  const { sendJsonMessage, lastJsonMessage } = useSocketIO(socketUrl);
  const { positions } = positionsStore();
  const { movement } = movementStore();
  const { userMode } = avatarStore();
  const { frames, setFrames } = framesStore();
  const { socketUpdate, setSocketUpdate } = socketStore();

  useEffect(() => {
    if (frames > 15) {
      setTrigger(true);
      setFrames(0);
    }
  }, [frames, userMode]);

  useEffect(() => {
    let newData = {
      type: "users",
      uid: cognito.username,
      data: { ...positions, movement, userMode },
    };
    if (trigger) {
      if (socketUpdate == true) {
        sendJsonMessage({
          action: "positions",
          data: newData,
        });
        setSocketUpdate(false);
      }
      setTrigger(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, movement, userMode, positions, socketUpdate]);

  useEffect(() => {
    setSocketUpdate(true);
  }, [movement, positions]);

  useEffect(() => {
    setSendJsonMessage(sendJsonMessage);
    if (Array.isArray(lastJsonMessage)) setLastJsonMessage(lastJsonMessage);
    else setSocketUpdate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  return <>{children}</>;
};

export default Sockets;
