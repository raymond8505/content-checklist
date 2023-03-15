import React, { useEffect, useState } from "react";
import { useStore, Store } from "../store";
import Spreadsheet, {
  CellBase,
  DataEditorComponent,
  DataEditorProps,
  Matrix,
} from "react-spreadsheet";
import { columnVal, getColumnVal, valueToClassName } from "../helpers";
import styled from "@emotion/styled";

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
const Editor: DataEditorComponent = ({ cell, onChange }) => {
  console.log(props);

  return <div>poops</div>;
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
        onChange={onSheetChange}
      />
    </Wrapper>
  );
};
