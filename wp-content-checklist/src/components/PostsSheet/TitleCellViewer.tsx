import { DataViewerComponent } from "react-spreadsheet";
import { htmlDecode } from "../../helpers";
import { ControlsWrapper, NameCellWrapper } from "./PostsSheet.styles";
import { CellWithMeta } from "./types";
import React from "react";
import { UnstyledButton } from "../common/Button";
import { LinkOutlined, SearchOutlined } from "@ant-design/icons";

export const TitleCellViewer: DataViewerComponent = ({ cell }) => {
  const { post } = cell as CellWithMeta;

  return post ? (
    <NameCellWrapper>
      <ControlsWrapper>
        <UnstyledButton onClick={() => {}} title="Check Post">
          <SearchOutlined />
        </UnstyledButton>
        <a href={htmlDecode(post.urls.view)} target="_blank">
          <LinkOutlined />
        </a>
      </ControlsWrapper>
      <a href={htmlDecode(post.urls.edit)} target="_blank">
        <span>{htmlDecode(post.title)}</span>
      </a>
    </NameCellWrapper>
  ) : null;
};
