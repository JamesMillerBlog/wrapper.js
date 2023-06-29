import create from "zustand";

const framesStore = create((set) => ({
  frames: 0,
  setFrames: (prop) =>
    set((state) => ({
      frames: prop,
    })),
}));

export default framesStore;
