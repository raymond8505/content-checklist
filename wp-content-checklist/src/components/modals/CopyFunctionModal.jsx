import { css } from "@emotion/react";
import { deleteColumn, useServerUpdate } from "../../api";
import { Button } from "../common/Button";
import Modal, { ModalHint } from "./Modal";

export const CopyFunctionModal = ({functionName,onClose}) => {
    return (
        <Modal title={`Check Function Does Not Exist`} onClose={onClose}>
            <textarea readOnly="readonly" css={css`
                width: 100%;
                height: 18em;
                font-family: Courier New;
                background: #333;
                color: #fff;
                padding: 1em;
                border-radius: 4px;
            `} value={
`function ${functionName} ($post_id){
    /**
     * check or fix logic here
     * 
     * check functions return
     *  - null (Unknown)
     *  - -1 (N/A)
     *  - 0 (No)
     *  - 1 (Yes)
     * 
     * fix functions return true or false
     * 
     */
}`
            }></textarea>
            <ModalHint>Function does not exist, add the above code to your theme's functions.php</ModalHint>
        </Modal>
    );
}