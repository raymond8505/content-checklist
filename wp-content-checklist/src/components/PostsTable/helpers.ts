import { Column, Post } from "../../store";

export const updateCell = (
  post: Post | null | undefined,
  column: Column | undefined,
  newVal: number | undefined = undefined
): Post | null => {
  if (!post) return null;
  if (!column) return null;

  const newPost = { ...post };

  if (newVal !== undefined) {
    newPost.columns[column.slug] = newVal;
  } else {
    delete newPost.columns[column.slug];
  }

  return newPost;
};
