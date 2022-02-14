import React, {  useEffect } from 'react';
import styled from 'styled-components';
import Messages from './Messages'
import { imageUrl } from '../../utils'

export default function MessageList(props) {    
    const {messageHistory} = props;

    return (
        <MessageBox>  
            <UserListing>
                <UserListingP>  
                    <UserListAvatar
                            loader="imgix"
                            src={`${imageUrl('/assets/UserIcon.svg')}`}
                            alt="User Avatar"
                            layout="fill" 
                    />      
                        Customer 
                </UserListingP>
            </UserListing>
            <MessagesContainer id='MessageList'>
                { 
                    renderMessages(messageHistory)
                }
            </MessagesContainer>  
        </MessageBox>
    )
};

const renderMessages = (messages) => {
    let messageArray = [];

    for(let x = 0; x< messages.length; x++) {
        messageArray.push(<Messages key ={x} data={messages[x]} />)
    }
    return messageArray;
}

const MessageBox = styled('div')`
    position: relative;
    width: 100vw;
    display: block;
`;


const UserListing = styled('div')`
    height: 100vh;
    width: 270px;
    border-right:1px solid #F2F2F2;
    display: inline-block;
    position: absolute;
`;

const UserListingP = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 20px;
    position: static;
    width: auto;
    height: 70px;
    left: 0px;
    top: 0px;
    background: lightgreen;
    margin: 0;
    font-size:14px;
    cursor: pointer;
`;

const MessagesContainer = styled('ul')`
    overflow: scroll;
    height: 70vh;
    list-style-type: none;
    display: inline-block;
    margin: 0px 0px 0px 260px;
    width: 60vw;
    overflow-x: hidden;
`;

const UserListAvatar = styled('img')`
    width: 50px;
    height: 50px;
`;