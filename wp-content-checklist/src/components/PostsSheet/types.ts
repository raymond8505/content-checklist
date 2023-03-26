import { CellBase } from "react-spreadsheet";
import { Column, Post } from "../../store";

export type CellWithMeta = CellBase & { post?: Post; column?: Column };
