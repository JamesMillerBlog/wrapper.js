import React, { useState, useEffect } from "react";
import socketStore from "./../../../stores/socket";
import Avatar from "./Avatar";
import cognitoStore from "./../../../stores/cognito";
import userStore from "./../../../stores/user";
import { getData } from "../../Cognito/utils";
const Avatars = () => {
  const { cognito } = cognitoStore();
  const { user } = userStore();
  const { lastJsonMessage } = socketStore();
  const [getUserImages, setUserImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let allData = await getData(cognito, user);
      let userImages = {};
      if (allData != undefined) {
        for (let x = 0; x < allData.Items.length; x++) {
          userImages[allData.Items[x].address] = allData.Items[x].image;
        }
      }
      setUserImages(userImages);
    };
    fetchData();
  }, [cognito]);

  return (
    <>
      {lastJsonMessage != null && (
        <AvatarList
          list={lastJsonMessage}
          user={user}
          userImages={getUserImages}
        />
      )}
    </>
  );
};

const AvatarList = (props) => {
  const { list, user, userImages } = props;

  const avatars = [];
  for (let x = 0; x < list.length; x++) {
    if (list[x].uid != user) {
      if (list[x].type == "users") {
        list[x].image = userImages[list[x].uid];
        avatars.push(list[x]);
      }
    }
  }

  return (
    <>
      {avatars.map((avatar) => (
        <Avatar
          position={avatar.data.position}
          rotation={avatar.data.rotation}
          key={avatar.uid}
          image={avatar.image}
        />
      ))}
    </>
  );
};

export default Avatars;
