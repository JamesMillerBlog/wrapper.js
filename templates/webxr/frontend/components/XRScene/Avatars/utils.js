import axios from "axios";
import { httpApiURL } from "./../../../utils";

export const updateGlobalPositions = (updatedPositions) => {
  const { xPos, yPos, zPos, xRotation, yRotation, zRotation } =
    updatedPositions;
  let position = {
    x: xPos,
    y: yPos,
    z: zPos,
  };

  let rotation = {
    x: xRotation,
    y: yRotation,
    z: zRotation,
  };

  return {
    position,
    rotation,
  };
};

export const getUserData = (source, data) => {
  const { image, avatar } = data.Items.find(
    ({ username }) => username === source
  );
  return {
    userImage: image,
    userAvatar: avatar,
  };
};

export const requestUserData = (cognito) =>
  axios({
    method: "get",
    url: `${httpApiURL}/users/data`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cognito.jwt}`,
    },
  }).then(
    (res) => {
      const data = JSON.parse(res.data.body);
      return data;
    },
    (error) => {
      console.log(error);
    }
  );
