import { DataViewerComponent } from "react-spreadsheet";
import React from "react";
import { CellWithMeta } from "./types";
import { Column, Store, useStore } from "../../store";
import IconButton from "../common/IconButton";
import { checkColumn, useServerUpdate } from "../../api";
import deleteIcon from "../../assets/icons/delete.svg";
import fixIcon from "../../assets/icons/fix.svg";
import checkIcon from "../../assets/icons/check.svg";
import filterIcon from "../../assets/icons/filter.svg";

export const FooterCellViewer: DataViewerComponent = ({ cell }) => {
  const { column } = cell as CellWithMeta;
  const { openModal } = useStore() as any as Store;
  const updateFromServer = useServerUpdate();

  return column ? (
    <>
      <IconButton
        src={checkIcon}
        alt="Check Column"
        onClick={() => {
          debugger;
          //   checkColumn(column.slug)
          //     .then((resp) => {
          //       updateFromServer();
          //     })
          //     .catch((e) => {
          //       console.log(e);
          //       openModal("code");
          //     });
          openModal("code");
          console.log("test");
        }}
      />
    </>
  ) : null;
};
