import create from 'zustand';

const cognitoStore = create(set => ({
    cognito: '',
    setCognito: (prop) => set(state => ({
        cognito: prop
    })),
    signInState: 'signedOut',
    setSignInState: (prop) => set(state => ({
        signInState: prop
    }))
}))

export default cognitoStore;