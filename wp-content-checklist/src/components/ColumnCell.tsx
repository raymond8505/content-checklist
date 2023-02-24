import styled from "@emotion/styled";
import { Post, Column } from "../store";
import React, { useState } from "react";
import { columnVal, valueToClassName } from "../helpers";
import { Spinner } from "./common/Spinner";

interface CCProps {
  post: Post;
  column: Column;
  onChange: (
    column: Column,
    post: Post,
    newVal: number | undefined,
    cb: () => void
  ) => void;
  children?: any;
}
export const ColumnCell = ({ post, column, onChange }: CCProps) => {
  const [showSelect, setShowSelect] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const ColumnCellTD = styled.td<{ value: number | undefined }>`
    position: relative;
    ${(props) => {
      // @ts-ignore
      switch (props.value) {
        case -1:
          return "background: rgb(0 0 0 / 20%) !important; color:;";
        case 0:
          return "background: rgb(153 0 0 / 20%) !important;";
        case 1:
          return "background: rgb(0 153 0 / 20%) !important;";
        default:
          return "background: white;";
      }
    }};
  `;

  const Select = ({ defaultValue }) => {
    const InnerSelect = styled.select`
      width: 100%;
      background: none;
      border: none;
      padding: none;
    `;

    return (
      <InnerSelect
        value={defaultValue}
        onChange={(e) => {
          const rawVal = e.currentTarget.value;
          const val = Number(rawVal) === -2 ? undefined : Number(rawVal);

          setShowSpinner(true);

          onChange(column, post, val, () => {
            setShowSelect(false);
            setShowSpinner(false);
          });
        }}
      >
        <option value={-2}>None</option>
        <option value={-1}>N/A</option>
        <option value={0}>No</option>
        <option value={1}>Yes</option>
      </InnerSelect>
    );
  };

  return (
    <ColumnCellTD
      value={post.columns[column.slug]}
      className={valueToClassName(post.columns[column.slug])}
      onClick={() => {
        if (!showSelect) {
          setShowSelect(true);
        }
      }}
    >
      {showSelect ? (
        <Select defaultValue={post.columns[column.slug]}></Select>
      ) : (
        columnVal(post, column)
      )}
      {showSpinner && <Spinner />}
    </ColumnCellTD>
  );
};
