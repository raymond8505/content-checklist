import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useStore, Store, Column, Post } from "../../store";
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
  htmlDecode,
  valueToClassName,
} from "../../helpers";
import styled from "@emotion/styled";
import { Spinner } from "../common/Spinner";
import { updatePostOnServer } from "../../api";
import Pagination from "./Pagination/Pagination";
import { InnerSelect, NameCellWrapper, Wrapper } from "./PostsSheet.styles";

type CellWithMeta = CellBase & { post: Post; column: Column };

const TitleCellViewer: DataViewerComponent = ({ cell }) => {
  const { post } = cell as CellWithMeta;

  return (
    <NameCellWrapper>
      <a href={htmlDecode(post.urls.edit)} target="_blank">
        {htmlDecode(post.title)}
      </a>{" "}
      <a href={htmlDecode(post.urls.view)} target="_blank">
        (view)
      </a>
    </NameCellWrapper>
  );
};

const Editor: DataEditorComponent = ({ cell, onChange, exitEditMode }) => {
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

export const PostsSheet = ({}) => {
  const { posts, columns, setPosts } = useStore() as any as Store; //todo do this the right way)
  const [data, setData] = useState<Matrix<CellBase<any>>>([]);
  const [columnLabels, setColumnLabels] = useState<string[]>([]);
  const [rowLabels, setRowLabels] = useState<string[]>([]);
  const [perPage, setPerPage] = useState(45);
  const [curPage, setCurPage] = useState(0);

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

    setRowLabels([
      "",
      ...posts
        .slice(curPage * perPage, curPage * perPage + perPage)
        .map((p) => String(p.ID)),
    ]);

    posts
      .slice(curPage * perPage, curPage * perPage + perPage)
      .forEach((post) => {
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
  }, [posts, columns, curPage, perPage]);
  return (
    <Wrapper>
      <Spreadsheet
        data={data}
        columnLabels={columnLabels}
        rowLabels={rowLabels}
      />

      <Pagination
        perPage={perPage}
        curPage={curPage}
        total={posts.length}
        onChange={setCurPage}
      />
    </Wrapper>
  );
};
