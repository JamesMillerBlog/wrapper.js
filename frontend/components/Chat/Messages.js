import styled from 'styled-components';
import { imageUrl } from '../../utils'

const Message = (props) => {
    const { author, message, updateTime, role, key } = props.data;
  
    const MessageList = document.getElementById('MessageList');
    setTimeout(function() {
        MessageList.scrollTop = MessageList.scrollHeight;
    }, 1);

    let backgroundColor = (role.includes('admin') ? 'green': 'orange');
    let textColor = (role.includes('admin') ? '#ffffff': '#ffffff');
    let leftMargin = (role.includes('admin') ? '13%': '65px');
    let ImagePosition = (role.includes('admin') ? '94%': '0%');
    let userRole = (role.includes('admin')) ? 'Admin' : 'Customer';
    return (
        <MessageLI key={key}>
            <FullMessageContent
                marginLeft={leftMargin}
            >
                <UserAvatar
                    loader="imgix"
                    src={`${imageUrl('/assets/UserIcon.svg')}`}
                    alt="User Avatar"
                    layout="fill" 
                    ImagesPosition={ImagePosition}
                />
                <RoleTitle>{userRole}</RoleTitle>
                <MessageBubble 
                    messageColour={backgroundColor}
                    textColour={textColor}
                >
                    {message}
                    <MessageTimer>
                        {String(updateTime).replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")} 
                    </MessageTimer>
                </MessageBubble>
            </FullMessageContent>
        </MessageLI>
    )
}

export default Message;

const MessageLI = styled('li')`
    display:block;
    position: relative;
`;

const FullMessageContent = styled('div')`
    background-color: ${props => props.messageColour};
    margin-left: ${props => props.marginLeft};
    width: 80%;
`;

const UserAvatar = styled('img')`
    position: absolute;
    bottom: 0;
    left:${props => props.ImagesPosition};
    width: 50px;
    height: 50px;
`;

const MessageBubble = styled('div')`
    background-color: ${props => props.messageColour};
    color: ${props => props.textColour};
    padding: 10px 18px ;
    border-radius: 10px;
    font-size: 14px;
    line-height:20px;
    white-space: normal;
`;

const MessageTimer = styled('p')`
    margin: 5px 5px;
    text-align: end;
    font-size:10px;
`;

const RoleTitle = styled('p')`
    margin: 5px 5px;
    text-align: start;
    font-size:10px;
    color: #9DA0A8;
`;