import { Select } from "antd";
import React from "react";

interface Props {
  value: number | undefined;
  onChange: (id: number | undefined) => void;
}
export const ColumnValueSelect = ({ value, onChange }: Props) => {
  const $value = value === undefined ? -2 : value;
  return (
    <Select
      style={{
        width: "5em",
        marginRight: "3px",
      }}
      defaultValue={$value}
      options={[
        {
          label: "--",
          value: -2,
        },
        {
          label: "N/A",
          value: -1,
        },
        {
          label: "No",
          value: 0,
        },
        {
          label: "Yes",
          value: 1,
        },
      ]}
    />
  );
};
