import create from "zustand";

const avatarStore = create((set) => ({
  userMode: "image",
  avatar: "",
  showIFrame: false,
  setShowIFrame: (prop) =>
    set((state) => ({
      showIFrame: prop,
    })),
  setAvatar: (prop) =>
    set((state) => ({
      avatar: prop,
    })),
  setUserMode: (prop) =>
    set((state) => ({
      userMode: prop,
    })),
}));

export default avatarStore;
