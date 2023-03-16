import { SyntheticEvent, useState } from "react";
import { CellBase, DataEditorComponent } from "react-spreadsheet";
import { updatePostOnServer } from "../../api";
import { columnLabel, getColumnVal, valueToClassName } from "../../helpers";
import { Post } from "../../store";
import { Spinner } from "../common/Spinner";
import { CellWithMeta } from "./types";
import React from "react";
import { InnerSelect } from "./PostsSheet.styles";

export const ColumnCellEditor: DataEditorComponent = ({
  cell,
  onChange,
  exitEditMode,
}) => {
  const { post, column } = cell as CellWithMeta;
  const [loading, setLoading] = useState(false);

  const onSelectChange = (e: SyntheticEvent) => {
    let value: string | undefined | number = (
      e.currentTarget as HTMLSelectElement
    ).value;

    if (value === "") {
      value = undefined;
    } else {
      value = Number(value);
    }

    const newPost: Post = {
      ID: 0,
      title: "",
      columns: {},
      urls: {
        edit: "",
        view: "",
      },
      status: "",
      posted: new Date(),
    };

    for (let i in post) {
      if (i === "columns") continue;
      newPost[i] = post[i];
    }

    for (let i in post.columns) {
      newPost.columns[i] = post.columns[i];
    }

    newPost.columns[column.slug] = value as number;

    setLoading(true);

    updatePostOnServer(newPost).then((resp) => {
      if (resp.success) {
        setLoading(false);
        exitEditMode();
        onChange({
          ...cell,
          post: newPost,
          value: columnLabel(value as number | undefined),
          className: valueToClassName(value),
        } as CellBase);
      }
    });
  };
  //TODO: make this the select box with spinner and wire up to API
  return loading ? (
    <Spinner />
  ) : (
    <InnerSelect
      defaultValue={getColumnVal(column, post)}
      onChange={onSelectChange}
    >
      <option value={undefined}></option>
      <option value={-1}>N/A</option>
      <option value={0}>No</option>
      <option value={1}>Yes</option>
    </InnerSelect>
  );
};
