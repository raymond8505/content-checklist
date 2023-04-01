import { Select } from "antd";
import React from "react";

export const ColumnValueSelect = ({ value, onChange }) => {
  return (
    <Select
      style={{
        width: "5em",
        marginRight: "3px",
      }}
      defaultValue={-2}
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
