import React, { useState, useEffect } from "react";
import useSocketIO from "react-use-websocket";
import socketStore from "./../../stores/socket";
const Sockets = (props) => {
  const { children, socketUrl } = props;
  const { setSendJsonMessage, setLastJsonMessage } = socketStore();

  const { sendJsonMessage, lastJsonMessage } = useSocketIO(socketUrl);
  useEffect(() => {
    setSendJsonMessage(sendJsonMessage);
    setLastJsonMessage(lastJsonMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  return <>{children}</>;
};

export default Sockets;
