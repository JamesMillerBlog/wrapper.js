import create from "zustand";

const socketStore = create((set) => ({
  sendJsonMessage: null,
  lastJsonMessage: null,
  socketUrl: "",
  setSendJsonMessage: (prop) =>
    set((state) => ({
      sendJsonMessage: prop,
    })),
  setLastJsonMessage: (prop) =>
    set((state) => ({
      lastJsonMessage: prop,
    })),
  setSocketUrl: (prop) =>
    set((state) => ({
      socketUrl: prop,
    })),
}));

export default socketStore;
