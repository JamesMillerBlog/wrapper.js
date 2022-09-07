import styled, { StyledComponent } from 'styled-components';
import React, { useState, useEffect, useCallback } from 'react';
import useSocketIO, {ReadyState} from 'react-use-websocket';
import { wsApiURL } from './../../utils'
import socketStore from './../../stores/socket';
import cognitoStore from './../../stores/cognito';


const Sockets = (props) => {
    const { children } = props;
    const { cognito } = cognitoStore();
    const [socketUrl] = useState(`${wsApiURL}?token=${cognito.jwt}`)
    const { setSendJsonMessage, setLastJsonMessage } = socketStore();
    const {
        sendJsonMessage,
        lastJsonMessage,
    } = useSocketIO(socketUrl);

    
    useEffect(() => {
        setSendJsonMessage(sendJsonMessage);
        setLastJsonMessage(lastJsonMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastJsonMessage]);

    return (
        <>
            { children }
        </>
    );
}

export default Sockets;