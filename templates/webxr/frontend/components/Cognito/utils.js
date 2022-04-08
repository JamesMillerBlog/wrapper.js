import Amplify, { Auth } from 'aws-amplify';

export function setupAmplify() {
    Amplify.configure({
        Auth: {
    
            // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
            identityPoolId: process.env.cognito_identity_pool_id,
            
            // REQUIRED - Amazon Cognito Region
            region: process.env.region,
    
            // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
            // Required only if it's different from Amazon Cognito Region
            identityPoolRegion: process.env.region,
    
            // OPTIONAL - Amazon Cognito User Pool ID
            userPoolId: process.env.cognito_user_pool_id,
            userPoolWebClientId: process.env.cognito_user_pool_client_id
        }
    });
}