import { create, StoreApi, UseBoundStore } from "zustand";

export interface Post {
  ID: number;
  columns: Record<string, number>;
  urls: {
    edit: string;
    view: string;
  };
  title: string;
}

export interface Column {
  name: string;
  slug: string;
}

export interface Store {
  posts: Post[];
  setPosts: (newPosts: Post[]) => Post[];
  columns: Column[];
  setColumns: (newColumns: Column[]) => Column[];
}
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
