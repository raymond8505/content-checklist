import { create } from "zustand";

export const useStore = create((set, get) => ({
  posts: [],
  setPosts: (newPosts) =>
    set({
      posts: [...newPosts],
    }),

  columns: [],
  setColumns: (newColumns) =>
    set({
      columns: [...newColumns],
    }),
}));
