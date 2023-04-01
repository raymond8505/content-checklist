import { create, StoreApi, UseBoundStore } from "zustand";

export interface Post {
  ID: number;
  columns: Record<string, number>;
  urls: {
    edit: string;
    view: string;
  };
  title: string;
  status: string;
  posted: Date;
}

export interface Column {
  name: string;
  slug: string;
}
export interface Store {
  posts: Post[];
  setPosts: (newPosts: Post[]) => void;
  columns: Column[];
  setColumns: (newColumns: Column[]) => void;
  modals: Record<string, boolean>;
  openModal: (string) => void;
}
export const useStore = create<Store>(
  (set, get): Store => ({
    posts: [],
    modals: {
      delete: false,
      code: false,
    },
    openModal: (modal: string) =>
      set({
        modals: {
          ...get().modals,
          [modal]: true,
        },
      }),
    setPosts: (newPosts) =>
      set({
        posts: [...newPosts],
      }),

    columns: [],
    setColumns: (newColumns) =>
      set({
        columns: [...newColumns],
      }),
  })
);
