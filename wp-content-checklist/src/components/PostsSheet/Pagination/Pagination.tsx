import React from "react";
import { Nav } from "./Pagination.styles";

const Pagination = ({ curPage, perPage, total, onChange }) => {
  const totPages = Math.ceil(total / perPage);
  console.log({ curPage });

  return (
    <Nav>
      <button
        onClick={() => {
          const newPage = curPage - 1;

          console.log({ curPage, newPage });
          if (newPage >= 0) {
            onChange(newPage);
          }
        }}
      >
        &lt;
      </button>
      <span>
        page {curPage + 1}/{totPages}
      </span>
      <button
        onClick={() => {
          const newPage = curPage + 1;

          if (newPage < totPages) {
            onChange(newPage);
          }
        }}
      >
        &gt;
      </button>
    </Nav>
  );
};

export default Pagination;
