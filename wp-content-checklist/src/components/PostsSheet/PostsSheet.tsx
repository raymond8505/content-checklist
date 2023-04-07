import React, { useEffect, useLayoutEffect, useState } from "react";
import { useStore, Store, FilterInclusivity } from "../../store";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import { columnVal, getColumnVal, valueToClassName } from "../../helpers";
// import Pagination from "./Pagination/Pagination";
import { Wrapper } from "./PostsSheet.styles";
import { CellWithMeta } from "./types";
import { TitleCellViewer } from "./TitleCellViewer";
import { ColumnCellEditor } from "./ColumnCellEditor";
import { Pagination } from "antd";

export const PostsSheet = ({ style = {} }: { style? }) => {
  const { posts, columns, modals, filters } = useStore();
  const [data, setData] = useState<Matrix<CellBase<any>>>([]);
  const [columnLabels, setColumnLabels] = useState<string[]>([]);
  const [rowLabels, setRowLabels] = useState<string[]>([]);
  const perPage = 49;
  const [curPage, setCurPage] = useState(0);
  const [contentLeft, setContentLeft] = useState(0);
  const [postsToShow, setPostsToShow] = useState(posts);

  useEffect(() => {
    const activeFilters = filters.filter(
      (filter) => filter.inclusivity !== FilterInclusivity.NONE
    );

    setPostsToShow(
      posts.filter((post) => {
        const matchResults: boolean[] = [];
        let shouldShow = true;

        for (const filter of activeFilters) {
          const matches = post.columns[filter.column.slug] === filter.value;

          console.log({ matches, post: post.title, filter });

          //filter is AND and it doesn't match, so hide regardless of other filters
          if (filter.inclusivity === FilterInclusivity.AND) {
            shouldShow = matches;
          }

          if (filter.inclusivity === FilterInclusivity.OR && matches) {
            shouldShow = true;
          }

          matchResults.push(shouldShow);
        }

        return !matchResults.includes(false);
      })
    );

    setCurPage(1);
  }, [posts, filters]);

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
  }, [postsToShow, columns, curPage, perPage]);

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
      ...postsToShow
        .slice(curPage * perPage, curPage * perPage + perPage)
        .map((p) => String(p.ID)),
    ]);

    postsToShow
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
  }, [postsToShow, columns, curPage, perPage]);

  useEffect(() => {
    console.log(modals);
  }, [modals]);

  return (
    <Wrapper contentLeft={contentLeft} style={style}>
      <Spreadsheet
        data={data}
        columnLabels={columnLabels}
        rowLabels={rowLabels}
      />

      {/* <Pagination
        perPage={perPage}
        curPage={curPage}
        total={posts.length}
        onChange={setCurPage}
      /> */}
      <Pagination
        current={curPage}
        pageSize={perPage}
        total={postsToShow.length}
        onChange={setCurPage}
        showSizeChanger={false}
        simple={true}
        style={{
          display: "flex",
          justifyContent: "center",
          padding: ".5em 0",
        }}
      />
    </Wrapper>
  );
};
