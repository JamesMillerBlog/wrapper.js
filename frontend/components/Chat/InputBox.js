import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { imageUrl, emitAnalytics } from '../../utils'

export default function InputBox(props) {
    const [message, setMessage] = useState("");
    const { readyState, ReadyState } = props;
    return (
        <SendMessageForm 
            disabled={readyState !== ReadyState.OPEN}
            onSubmit = {(e) => handleSubmit(e, message, props, setMessage, emitAnalytics)}
        >
            <InnerMessageBox 
                type = "text"
                value = {message}
                onChange = {(e) => setMessage(e.target.value)} 
            />
            <SendAirplane 
                type="submit" 
                value="Submit"
                onMouseEnter={()=> emitAnalytics('Mouse Over Send Message')} 
                onMouseLeave={()=> emitAnalytics('Mouse Out Send Message')}
            >
                <img
                    loader="imgix"
                    src={`${imageUrl('/assets/Send.svg')}`} 
                    alt="Send icon"
                    layout="fill" 
                />      
            </SendAirplane>
        </SendMessageForm>
    )
    
};

const handleSubmit = (event, message, props, setMessage, emitAnalytics) => {
    const { sendJsonMessage, author, role, roomId } = props;
    event.preventDefault();
    let data = {
      roomId: roomId,
      updateTime: new Date(),
      author: author,
      message: message,
      role: role
    }
    sendJsonMessage({
      action: 'chat',
      data: JSON.stringify(data)
    }); 
    setMessage('')
    emitAnalytics('Sent chat message')
}


const SendMessageForm = styled('form')`
    width: 68vw;
    height: 63px;
    border-top: 1px solid #F2F2F2;
    position: absolute;
    bottom: 14px;
    background: #fff;
    z-index:999;
    margin-left: 271px;
`
const InnerMessageBox = styled('input')`
    height: 99%;
    width: 99%;
    border:none;
    &:focus{
        border:none;
        outline: none;
    }
`
const SendAirplane = styled('button')`
    display: block;
    position: absolute;
    top: 0px;
    width: 40px;
    height: 100%;
    right: 0;
    border: none;
    background: #ffffff;
`