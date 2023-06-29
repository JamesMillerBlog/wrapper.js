import create from "zustand";

const movementStore = create((set) => ({
  movement: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  },
  setMovement: (direction, state) =>
    set((m) => ({
      movement: { ...m.movement, [direction]: state },
    })),
}));

export default movementStore;
