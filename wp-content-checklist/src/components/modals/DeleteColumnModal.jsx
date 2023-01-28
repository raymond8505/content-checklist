import { deleteColumn, useServerUpdate } from "../../api";
import { Button } from "../common/Button";
import Modal from "./Modal";

export const DeleteColumnModal = ({column,onClose}) => {
    const updateFromServer = useServerUpdate()

    return (
        <Modal title={`Are you sure you want to delete the column "${column.name}"?`} onClose={onClose}>
            <Button onClick={()=>{
                deleteColumn(column.slug).then(resp=>{
                    updateFromServer()
                    onClose()
                });
            }}>Yes</Button>
        </Modal>
    );
}