import React, { useState, useEffect } from "react";
import { getUserData } from "./utils";
import Avatar from "./Avatar";
import cognitoStore from "./../../../stores/cognito";

const AvatarList = (props) => {
  const { cognito } = cognitoStore();
  const [getUserAvatars, setUserAvatars] = useState();
  const { socketData, httpData } = props;

  useEffect(() => {
    const filteredSocketData = socketData.filter(
      (data) => data.type === "users"
    );
    const avatars = filteredSocketData.map((message) => {
      const { userImage, userAvatar } = getUserData(message.uid, httpData);
      return {
        username: message.uid,
        image: userImage,
        avatar: userAvatar,
        userMode: message.data.userMode,
        movement: message.data.movement,
        body: message.data.body,
        leftHand: message.data.leftHand,
        rightHand: message.data.rightHand,
      };
    });

    const userAvatars = avatars.filter(
      (avatar) => avatar.username != cognito.username
    );

    setUserAvatars(userAvatars);
  }, [socketData]);

  return (
    <>
      {getUserAvatars &&
        getUserAvatars.length > 0 &&
        getUserAvatars.map((avatar) => (
          <Avatar
            body={avatar.body}
            leftHand={avatar.leftHand}
            rightHand={avatar.rightHand}
            key={avatar.username}
            image={avatar.image}
            avatar={avatar.avatar}
            userMode={avatar.userMode}
            movement={avatar.movement}
            activeUser={false}
          />
        ))}
    </>
  );
};

export default AvatarList;
