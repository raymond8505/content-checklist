import React, { SyntheticEvent, useEffect, useState } from "react";
import { useStore, Store, Column, Post } from "../store";
import Spreadsheet, {
  CellBase,
  DataEditorComponent,
  DataEditorProps,
  DataViewerComponent,
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

  tr:first-of-type {
    position: sticky;
    top: 2em;
    background: white;
    z-index: 3;
  }

  th:nth-of-type(1),
  td:nth-of-type(2),
  th:nth-of-type(2) {
    position: sticky;
    z-index: 2;
    background: white;
  }
  th:nth-of-type(1) {
    left: 0;
    width: 72px;
  }
  td:nth-of-type(2),
  th:nth-of-type(2) {
    left: 72px;
  }
  .Spreadsheet__header {
    color: black;
    font-weight: bold;
  }
  .Spreadsheet__cell--readonly {
    color: black;
  }
`;

const InnerSelect = styled.select`
  width: 100%;
`;
type CellWithMeta = CellBase & { post: Post; column: Column };

const TitleCellViewer: DataViewerComponent = ({ cell }) => {
  const { post } = cell as CellWithMeta;

  return (
    <NameCellWrapper>
      <a href={post.urls.edit} target="_blank">
        {post.title}
      </a>{" "}
      <a href={post.urls.view} target="_blank">
        (view)
      </a>
    </NameCellWrapper>
  );
};
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
      status: "",
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
const NameCellWrapper = styled.span`
  a:nth-of-type(2) {
    margin-left: 0.5em;
    padding-left: 0.5em;
    display: inline-block;
    border-left: 1px solid black;
  }
`;
export const PostsSheet = ({}) => {
  const { posts, columns, setPosts } = useStore() as any as Store; //todo do this the right way)
  const [data, setData] = useState<Matrix<CellBase<any>>>([]);
  const [columnLabels, setColumnLabels] = useState<string[]>([]);
  const [rowLabels, setRowLabels] = useState<string[]>([]);
  const limit = 50;

  const onSheetChange = (data) => {
    console.log(data);
  };
  useEffect(() => {
    const emptyRow = new Array(columns.length + 2);

    emptyRow.fill(
      {
        value: "",
      },
      columns.length + 2
    );
    const rows: Matrix<CellBase<any>> = [emptyRow];

    setColumnLabels(["Status", "Post", ...columns.map((c) => c.name)]);

    setRowLabels(["", ...posts.slice(0, limit).map((p) => String(p.ID))]);

    posts.slice(0, limit).forEach((post) => {
      const postRow: CellBase<any>[] = [];

      postRow.push({
        value: post.status,
        readOnly: true,
      });
      postRow.push({
        value: "",
        post,
        readOnly: true,
        DataViewer: TitleCellViewer,
      } as CellWithMeta);

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
