import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Modal } from "antd";
import React from "react";
import { useStore } from "../../store";

const Table = styled.table`
  width: 100%;
  text-align: left;
`;
const ColumnToolsModal = ({ open, onClose }) => {
  const { columns } = useStore();
  return (
    <Modal
      open={open}
      title={"Column Tools"}
      onCancel={onClose}
      width="90vw"
      onOk={onClose}
    >
      <Table>
        <thead>
          <tr>
            <th>Column</th>
            <th>Search</th>
            <th>Filter</th>
            <th>Check</th>
            <th>Handle</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </Modal>
  );
};

export default ColumnToolsModal;
