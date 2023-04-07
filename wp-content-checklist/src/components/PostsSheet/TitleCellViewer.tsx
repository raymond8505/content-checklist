import { DataViewerComponent } from "react-spreadsheet";
import { htmlDecode } from "../../helpers";
import { ControlsWrapper, NameCellWrapper } from "./PostsSheet.styles";
import { CellWithMeta } from "./types";
import React from "react";
import { UnstyledButton } from "../common/Button";
import { LinkOutlined, SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

const EditLink = styled.a`
  span {
    max-width: 40ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
`;
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
      <EditLink href={htmlDecode(post.urls.edit)} target="_blank">
        <span>{htmlDecode(post.title)}</span>
      </EditLink>
    </NameCellWrapper>
  ) : null;
};
