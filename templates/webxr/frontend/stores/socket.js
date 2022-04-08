import create from 'zustand';

const socketStore = create(set => ({
    sendJsonMessage: null, 
    lastJsonMessage: null,
    setSendJsonMessage: (prop) => set(state => ({
        sendJsonMessage: prop
    })),
    setLastJsonMessage: (prop) => set(state => ({
        lastJsonMessage: prop
    })),
}))

export default socketStore;