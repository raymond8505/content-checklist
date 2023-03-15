import React, { SyntheticEvent, useEffect, useState } from "react";
import { useStore, Store, Column, Post } from "../store";
import Spreadsheet, {
  CellBase,
  DataEditorComponent,
  DataEditorProps,
  Matrix,
} from "react-spreadsheet";
import {
  columnLabel,
  columnVal,
  getColumnVal,
  valueToClassName,
} from "../helpers";
import styled from "@emotion/styled";
import { Spinner } from "./common/Spinner";
import { updatePostOnServer } from "../api";

const Wrapper = styled.div`
  .column-cell--na {
    background: rgb(0 0 0 / 20%) !important;
  }
  .column-cell--yes {
    background: rgb(0 153 0 / 25%) !important;
  }
  .column-cell--no {
    background: rgb(153 0 0 / 18%) !important;
  }

  tr:first-child {
    position: sticky;
    top: 2em;
    background: white;
    z-index: 3;
  }

  th:nth-child(1),
  td:nth-child(2),
  th:nth-child(2) {
    position: sticky;
    z-index: 2;
    background: white;
  }
  th:nth-child(1) {
    left: 0;
    width: 72px;
  }
  td:nth-child(2),
  th:nth-child(2) {
    left: 72px;
  }
`;

const InnerSelect = styled.select`
  width: 100%;
`;
type CellWithMeta = CellBase & { post: Post; column: Column };

const Editor: DataEditorComponent = ({ cell, onChange }) => {
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
export const PostsSheet = ({}) => {
  const { posts, columns, setPosts } = useStore() as any as Store; //todo do this the right way)
  const [data, setData] = useState<Matrix<CellBase<any>>>([]);
  const [columnLabels, setColumnLabels] = useState<string[]>([]);
  const [rowLabels, setRowLabels] = useState<string[]>([]);

  const onSheetChange = (data) => {
    console.log(data);
  };
  useEffect(() => {
    const titleRow: CellBase<any>[] = [
      {
        value: "ID",
      },
      {
        value: "Post Name",
      },
    ];
    const emptyRow = new Array(columns.length + 1);

    emptyRow.fill(
      {
        value: "",
      },
      columns.length + 1
    );
    const rows: Matrix<CellBase<any>> = [emptyRow];

    setColumnLabels(columns.map((c) => c.name));

    setRowLabels(posts.map((p) => String(p.ID)));

    posts.forEach((post) => {
      const postRow: CellBase<any>[] = [];

      postRow.push({
        value: post.title,
      });

      columns.forEach((column) => {
        const value = columnVal(post, column);

        postRow.push({
          //@ts-expect-error
          post,
          column,
          value,
          className: valueToClassName(getColumnVal(column, post)),
          DataEditor: Editor,
        });
      });

      rows.push(postRow);
    });

    setData(rows);
  }, [posts, columns]);
  return (
    <Wrapper>
      <Spreadsheet
        data={data}
        columnLabels={columnLabels}
        rowLabels={rowLabels}
      />
    </Wrapper>
  );
};
