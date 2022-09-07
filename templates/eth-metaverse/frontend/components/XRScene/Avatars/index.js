import React, { useRef, useState, useEffect, Suspense, lazy } from 'react'
import socketStore from '../../stores/socket';
import Avatar from './Avatar';
import axios from 'axios';
import { httpApiURL } from '../../utils';
import cognitoStore from '../../stores/cognito';

const Avatars = () => {
  const { cognito } = cognitoStore();
  const { lastJsonMessage } = socketStore();
  const [getUserImages, setUserImages] = useState([]);
  
  useEffect(() => {
    console.log(cognito)
    const fetchData = async() => {
      let allData = await getUserData(cognito, 'returnAll');
      let userImages ={};
      for(let x = 0; x<allData.Items.length; x++) {
        userImages[allData.Items[x].username] =allData.Items[x].image
      }
      setUserImages(userImages)
    }
    fetchData();
  }, [cognito])

  return (
    <>
      {
        lastJsonMessage != null &&
        <AvatarList list={lastJsonMessage} cognito={cognito} userImages={getUserImages}/>
      }
    </>
  )
}

const AvatarList = (props) => {
  const { list, cognito, userImages } = props;
  const avatars = [];
  for(let x=0; x<list.length; x++) {
    if(list[x].uid != cognito.username) {
      if(list[x].type == 'users') {
        list[x].image = userImages[list[x].uid];
        avatars.push(list[x]);
      }
    }
  }
  
  return (
    <>
      {avatars.map(avatar => (
        <Avatar 
            position={avatar.data.position}
            rotation={avatar.data.rotation}
            key={avatar.uid}
            image={avatar.image}
        />
      ))}
    </>
  )
};

const getUserData = (cognito, all) => axios({
  method: 'post',
  url: `${httpApiURL}/users/data`,
  data: {
    cognito: all
  },
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cognito.jwt}`
  } 
}).then((res) => {
  const data = JSON.parse(res.data.body);
  return data;
}, (error) => {
  console.log(error);
})
  

  export default Avatars;