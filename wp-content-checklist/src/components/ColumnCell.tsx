import styled from "@emotion/styled";
import { Post, Column } from "../store";
import React, {
  LegacyRef,
  MutableRefObject,
  SyntheticEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { columnVal, valueToClassName } from "../helpers";
import { Spinner } from "./common/Spinner";

interface CCProps {
  post: Post;
  column: Column;
  onMouseOver: (e: SyntheticEvent) => void;
  onChange: (
    column: Column,
    post: Post,
    newVal: number | undefined,
    cb: () => void
  ) => void;
  children?: any;
}
export const ColumnCell = React.forwardRef(
  ({ post, column, onChange, onMouseOver }: CCProps, ref) => {
    const [showSelect, setShowSelect] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const ColumnCellTD = styled.td<{ value: number | undefined }>`
      position: relative;

      &:hover {
        ${(props) => {
          // @ts-ignore
          switch (props.value) {
            case -1:
              return "background: rgb(0 0 0 / 50%) !important;";
            case 0:
              return "background: rgb(153 0 0 / 50%) !important;";
            case 1:
              return "background: rgb(0 153 0 / 50%) !important;";
            default:
              return "background: #999;";
          }
        }};
      }
    `;

    const InnerSelect = styled.select`
      width: 100%;
      background: none;
      border: none;
      padding: none;
    `;

    const Select = ({ defaultValue }) => {
      const selectRef = useRef<HTMLSelectElement | null>(null);

      useLayoutEffect(() => {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      }, [selectRef]);

      return (
        <InnerSelect
          ref={selectRef}
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
        onMouseOver={onMouseOver}
        role="button"
      >
        {showSelect ? (
          <Select defaultValue={post.columns[column.slug]}></Select>
        ) : (
          columnVal(post, column)
        )}
        {showSpinner && <Spinner />}
      </ColumnCellTD>
    );
  }
);
