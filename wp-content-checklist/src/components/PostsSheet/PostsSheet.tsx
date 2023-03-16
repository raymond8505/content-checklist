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
import { CellWithMeta } from "./types";
import { TitleCellViewer } from "./TitleCellViewer";
import { ColumnCellEditor } from "./ColumnCellEditor";

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
            DataEditor: ColumnCellEditor,
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
