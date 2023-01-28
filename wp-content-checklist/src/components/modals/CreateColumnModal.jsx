import React, { useCallback, useRef, useState } from "react";
import { createColumn, useServerUpdate } from "../../api";
import { Button } from "../common/Button";
import { Error } from "../common/Error";
import { Input } from "../common/Input";
import Modal from "./Modal";

const CreateColumnModal = ({onClose}) => {

    const nameField = useRef(null)
    const [error,setError] = useState(null)
    const closeModal = useCallback(()=>{
        setError(null)
        onClose()
    },[setError])

    const updateFromServer = useServerUpdate()

    const onCreateClick = useCallback(()=>{
        const name = nameField?.current.value;

        createColumn(name).then(resp => {
            console.log('success');
            updateFromServer()
            onClose()
        }).catch(resp => {
            setError(resp.error);
        })
    },[])
    return (<Modal title="Create Column" onClose={closeModal}>
        <Input placeholder="Column Name" aria-label="Column Name" ref={nameField} />
        <Button onClick={onCreateClick}>Create</Button>
        {error && <Error>{error}</Error>}
    </Modal>);
}

export default CreateColumnModal;