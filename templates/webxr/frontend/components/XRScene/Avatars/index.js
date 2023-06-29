import React, { useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import ActiveUser from "./ActiveUser";
import cognitoStore from "./../../../stores/cognito";
import avatarStore from "./../../../stores/avatar";
import movementStore from "./../../../stores/movement";
import socketStore from "./../../../stores/socket";
import { getUserData, requestUserData } from "./utils";
import AvatarList from "./AvatarList";

const Avatars = () => {
  const { cognito } = cognitoStore();
  const { userMode, avatar } = avatarStore();
  const { movement } = movementStore();
  const [activeUserAvatar, setActiveUserAvatar] = useState();
  const { lastJsonMessage } = socketStore();
  const [httpData, setHttpData] = useState();

  useEffect(() => {
    const fetchData = async () => setHttpData(await requestUserData(cognito));
    fetchData();
  }, []);

  useEffect(() => {
    if (cognito && userMode && httpData) {
      const activeUserAvatar = {
        username: cognito.username,
        image: getUserData(cognito.username, httpData).userImage,
        avatar,
        userMode: userMode,
        movement,
      };

      setActiveUserAvatar(activeUserAvatar);
    }
  }, [cognito, userMode, httpData, avatar]);

  return (
    <>
      <>
        {lastJsonMessage && lastJsonMessage.length > 0 && httpData && (
          <AvatarList socketData={lastJsonMessage} httpData={httpData} />
        )}
      </>
      <>
        {activeUserAvatar != null && (
          <ActiveUser
            username={cognito.username}
            image={activeUserAvatar.image}
            userMode={activeUserAvatar.userMode}
            avatar={activeUserAvatar.avatar}
            movement={activeUserAvatar.movement}
          />
        )}
      </>
    </>
  );
};

export default Avatars;
