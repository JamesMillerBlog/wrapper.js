import create from "zustand";

const positionsStore = create((set) => ({
  positions: {
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  setPositions: (prop) =>
    set((state) => ({
      positions: prop,
    })),
}));

export default positionsStore;
