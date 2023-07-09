import create from "zustand";

const userStore = create((set) => ({
  user: "",
  setUser: (prop) =>
    set((state) => ({
      user: prop,
    })),
}));

export default userStore;
