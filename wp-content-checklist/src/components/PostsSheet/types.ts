import { CellBase } from "react-spreadsheet";
import { Column, Post } from "../../store";

export type CellWithMeta = CellBase & { post?: Post; column?: Column };

export enum CellValue {
  UNSET = -2,
  NA = -1,
  NO = 0,
  YES = 1,
}
