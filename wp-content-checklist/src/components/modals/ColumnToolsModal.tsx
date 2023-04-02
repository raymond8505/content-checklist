import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Modal, Radio } from "antd";
import React, { SyntheticEvent } from "react";
import { FilterInclusivity, useStore } from "../../store";
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ColumnValueSelect } from "../common/ColumnValueSelect";

const Table = styled.table`
  width: 100%;

  td,
  th {
    text-align: center;
    padding: 0.2em 0.4em;
  }
  td:first-child,
  th:first-child,
  td:nth-child(2) {
    text-align: left;
  }

  thead tr > * {
    background: #eee;
  }
`;
const ColumnToolsModal = ({ open, onClose }) => {
  const { columns, filters, setFilters } = useStore();
  return (
    <Modal
      open={open}
      title={"Column Tools"}
      onCancel={onClose}
      width="50vw"
      onOk={onClose}
    >
      <Table>
        <thead>
          <tr>
            <th>Column</th>
            {/* <th>Search</th> */}
            <th
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                columnGap: "5px",
              }}
            >
              <Button icon={<ReloadOutlined />} title="Clear Filters" />
              <span>Filter</span>
            </th>
            <th>Check</th>
            <th>Handle</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((column) => {
            const filter = filters.find(
              (filter) => filter.column.slug === column.slug
            );
            return (
              <tr key={column.slug}>
                <th>{column.name}</th>
                {/* <td>TBD</td> */}
                <td>
                  <ColumnValueSelect
                    value={filter?.value}
                    onChange={(val) => {
                      setFilters(
                        filters.map((f) => {
                          if (f.column.slug !== column.slug) return f;

                          const newF = { ...f };
                          newF.value = val;

                          return newF;
                        })
                      );
                    }}
                  />
                  <Radio.Group
                    options={[
                      {
                        label: "AND",
                        value: "and",
                      },
                      {
                        label: "OR",
                        value: "or",
                      },
                      {
                        label: "NONE",
                        value: "none",
                      },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                    defaultValue={filter?.inclusivity}
                    onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                      console.log({ e });
                      setFilters(
                        filters.map((f) => {
                          if (f.column.slug !== column.slug) return f;

                          const newF = { ...f };
                          newF.inclusivity = (e.target as HTMLInputElement)
                            .value as FilterInclusivity;
                          return newF;
                        })
                      );
                    }}
                  />
                </td>
                <td>
                  <Button type="primary" icon={<SearchOutlined />} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Modal>
  );
};

export default ColumnToolsModal;
