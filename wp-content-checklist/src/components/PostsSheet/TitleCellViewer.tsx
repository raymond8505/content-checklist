import { DataViewerComponent } from "react-spreadsheet";
import { htmlDecode } from "../../helpers";
import { NameCellWrapper } from "./PostsSheet.styles";
import { CellWithMeta } from "./types";
import React from "react";

export const TitleCellViewer: DataViewerComponent = ({ cell }) => {
  const { post } = cell as CellWithMeta;

  return post ? (
    <NameCellWrapper>
      <a href={htmlDecode(post.urls.edit)} target="_blank">
        {htmlDecode(post.title)}
      </a>{" "}
      <a href={htmlDecode(post.urls.view)} target="_blank">
        (view)
      </a>
    </NameCellWrapper>
  ) : null;
};
