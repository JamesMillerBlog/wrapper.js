import create from 'zustand';

const deviceStore = create(set => ({
    device: '',
    setDevice: (prop) => set(state => ({
        device: prop
    })),
}))

export default deviceStore;