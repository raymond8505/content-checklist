import React from "react";
import { Nav } from "./Pagination.styles";

const Pagination = ({ curPage, perPage, total, onChange }) => {
  console.log({ curPage, perPage, total, onChange });
  return (
    <Nav>
      page {curPage + 1}/{Math.ceil(total / perPage)}
    </Nav>
  );
};

export default Pagination;
