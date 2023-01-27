import { create } from "zustand";

export const useStore = create((set, get) => ({
  posts: ["test"],
  setPosts: (newPosts) => {
    return set({
      posts: newPosts,
    });
  },
}));
