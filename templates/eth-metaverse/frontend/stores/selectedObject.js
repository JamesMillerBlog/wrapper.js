import create from 'zustand';

const selectedObjectStore = create(set => ({
    selectedObject: {},
    setSelectedObject: (prop) => set(state => ({
        selectedObject: prop
    })),
}))

export default selectedObjectStore;