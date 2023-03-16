import React, { useEffect, useLayoutEffect, useState } from "react";
import { useStore, Store } from "../../store";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import { columnVal, getColumnVal, valueToClassName } from "../../helpers";
import Pagination from "./Pagination/Pagination";
import { Wrapper } from "./PostsSheet.styles";
import { CellWithMeta } from "./types";
import { TitleCellViewer } from "./TitleCellViewer";
import { ColumnCellEditor } from "./ColumnCellEditor";

export const PostsSheet = ({}) => {
  const { posts, columns } = useStore() as any as Store; //todo do this the right way)
  const [data, setData] = useState<Matrix<CellBase<any>>>([]);
  const [columnLabels, setColumnLabels] = useState<string[]>([]);
  const [rowLabels, setRowLabels] = useState<string[]>([]);
  const perPage = 48;
  const [curPage, setCurPage] = useState(0);
  const [contentLeft, setContentLeft] = useState(0);

  useLayoutEffect(() => {
    //adminmenuwrap
    const wpContent = document.querySelector("#wpcontent") as HTMLDivElement;

    if (wpContent) {
      const contentRect = wpContent.getBoundingClientRect();

      const paddingLeft = parseInt(
        getComputedStyle(wpContent)
          .getPropertyValue("padding-left")
          .replace("px", "")
      );

      setContentLeft(paddingLeft + contentRect.left);
    }
  }, [posts, columns, curPage, perPage]);

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
    <Wrapper contentLeft={contentLeft}>
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
