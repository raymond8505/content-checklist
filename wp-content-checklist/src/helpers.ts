import { Post, Column } from "./store";

export const columnVal = (post: Post, column: Column) => {
  switch (post.columns[column.slug]) {
    case -1:
      return "N/A";
    case 0:
      return "No";
    case 1:
      return "Yes";
    default:
      return "";
  }
};

export const valueToClassName = (val) => {
  const prefix = "column-cell--";

  switch (val) {
    case -1:
      return `${prefix}na`;
    case 0:
      return `${prefix}no`;
    case 1:
      return `${prefix}yes`;
    default:
      return "";
  }
};

export const getColumnVal = (column: Column, post: Post) =>
  post.columns[column.slug];

export const nextVal = (curVal: number): number => {
  if (curVal === 1) return -1;

  return ++curVal;
};

export const nextColumnVal = (column: Column, post: Post) =>
  nextVal(getColumnVal(column, post));
