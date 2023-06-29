import create from "zustand";

const socketStore = create((set) => ({
  socketUpdate: false,
  sendJsonMessage: null,
  lastJsonMessage: null,
  setSocketUpdate: (prop) =>
    set((state) => ({
      socketUpdate: prop,
    })),
  setSendJsonMessage: (prop) =>
    set((state) => ({
      sendJsonMessage: prop,
    })),
  setLastJsonMessage: (prop) =>
    set((state) => ({
      lastJsonMessage: prop,
    })),
}));

export default socketStore;
