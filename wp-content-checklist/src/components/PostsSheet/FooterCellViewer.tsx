import { DataViewerComponent } from "react-spreadsheet";
import React from "react";
import { CellWithMeta } from "./types";

export const FooterCellViewer: DataViewerComponent = ({ cell }) => {
  const { column } = cell as CellWithMeta;
  return <>{column?.name}</>;
};
