import { DataViewerComponent } from "react-spreadsheet";
import { htmlDecode } from "../../helpers";
import { NameCellWrapper } from "./PostsSheet.styles";
import { CellWithMeta } from "./types";
import React from "react";
import { UnstyledButton } from "../common/Button";
import { LinkOutlined, SearchOutlined } from "@ant-design/icons";

export const TitleCellViewer: DataViewerComponent = ({ cell }) => {
  const { post } = cell as CellWithMeta;

  return post ? (
    <NameCellWrapper>
      <UnstyledButton onClick={() => {}} title="Check Post">
        <SearchOutlined />
      </UnstyledButton>
      <a href={htmlDecode(post.urls.view)} target="_blank">
        <LinkOutlined />
      </a>
      <a href={htmlDecode(post.urls.edit)} target="_blank">
        {htmlDecode(post.title)}
      </a>
    </NameCellWrapper>
  ) : null;
};
