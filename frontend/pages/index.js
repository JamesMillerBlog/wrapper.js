import mixpanel from 'mixpanel-browser';

import Cognito from '../components/Cognito'
import Chat from '../components/Chat'
import ERC20 from '../components/ERC20'

import cognitoStore from '../stores/cognito'

export default function Messages() {
    const { cognito } = cognitoStore();
    mixpanel.init(process.env.mixpanel_project_token, {debug: true}); 
    mixpanel.track("Index Page View")

    return (
        <Cognito> 
            <ERC20 />
            {cognito != '' &&
                <Chat cognito={cognito} />
            }
        </Cognito>
    )
};