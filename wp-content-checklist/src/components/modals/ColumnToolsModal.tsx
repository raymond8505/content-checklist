import { Modal } from "antd";
import React from "react";

const ColumnToolsModal = ({ open, onClose }) => {
  return <Modal open={open} title={"Column Tools"} onCancel={onClose} />;
};

export default ColumnToolsModal;
