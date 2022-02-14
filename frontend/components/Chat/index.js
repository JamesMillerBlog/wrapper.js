import styled, { StyledComponent } from 'styled-components';
import React, { useState, useEffect, useCallback } from 'react';
import useSocketIO, {ReadyState} from 'react-use-websocket';

import { wsApiURL } from './../../utils'

import cognitoStore from './../../stores/cognito'

import MessageList from './MessageList'
import InputBox from './InputBox'

const Chatbox = (props) => {
  const { cognito } = props;
  const [socketUrl, setSocketUrl] = useState(`${wsApiURL}?token=${cognito.jwt}`)
  const [messageHistory, setMessageHistory] = useState([]);
  const userRole = cognito.role;
  const username = cognito.username;
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useSocketIO(socketUrl);

  useEffect(() => {
    // if database connection is achieved, but no data in database    
    if (lastJsonMessage !==null && messageHistory.length == 0) {
      setMessageHistory(lastJsonMessage)
    // once new json message is received
    } else if (lastJsonMessage !== null) {
      setMessageHistory(prev => {
        return prev.concat(lastJsonMessage.slice(-1))
      });
    // if connection has not yet been made to the database
    } else if (lastJsonMessage == null && messageHistory.length == 0) {
      let data = {
        roomId: 0,
        author: username,
        role: userRole
      }
      sendJsonMessage({
        action: 'chat',
        data: data
      }); 
    }
    
  }, [lastJsonMessage, setMessageHistory]);

  return (
    <Container>
        <MessageList 
          messageHistory={messageHistory} 
        />
        <InputBox 
          readyState={readyState}
          ReadyState={ReadyState}
          sendJsonMessage={sendJsonMessage}
          author={username}
          role={userRole}
          roomId={0}
        />
    </Container>  
  )
};

const Container = styled('pre')`
  height: 90vh;
  position: absolute;
  width: 100vw;
  padding: 0px 10%;
`;


export default Chatbox;