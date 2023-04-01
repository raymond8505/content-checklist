import React from "react";
import { Nav } from "./Pagination.styles";
import { UnstyledButton } from "../../common/Button";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Pagination = ({ curPage, perPage, total, onChange }) => {
  const totPages = Math.ceil(total / perPage);
  console.log({ curPage });

  return (
    <Nav>
      <UnstyledButton
        onClick={() => {
          const newPage = curPage - 1;

          console.log({ curPage, newPage });
          if (newPage >= 0) {
            onChange(newPage);
          }
        }}
      >
        <LeftOutlined />
      </UnstyledButton>
      <span>
        page {curPage + 1}/{totPages}
      </span>
      <UnstyledButton
        onClick={() => {
          const newPage = curPage + 1;

          if (newPage < totPages) {
            onChange(newPage);
          }
        }}
      >
        <RightOutlined />
      </UnstyledButton>
    </Nav>
  );
};

export default Pagination;
