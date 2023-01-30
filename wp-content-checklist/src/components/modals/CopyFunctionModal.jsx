import { css } from "@emotion/react";
import { deleteColumn, useServerUpdate } from "../../api";
import { Button } from "../common/Button";
import Modal, { ModalHint } from "./Modal";

export const CopyFunctionModal = ({functionName,onClose}) => {
    return (
        <Modal title={`${functionName} Does Not Exist`} onClose={onClose}>
            <textarea css={css`
                width: 100%;
                height: 18em;
                font-family: Courier New;
                background: #333;
                color: #fff;
                padding: 1em;
                border-radius: 4px;
            `} value={
`function ${functionName} ($slug){
    
    //get all posts you want to check
    $query = new WP_Query([
        'post_type'=>'post',
        'posts_per_page'=>-1
    ]);
    
    foreach($query->posts as $post)
    {
        /**
         * Put logic here that checks whether each post is unknown,N/A,no,yes
         * null = unknown
         * -1   = N/A
         * 0    = No
         * 1    = Yes
         */
        $result = null;

        //set that value for the post and column
        wpcc_set_column(
            $slug,
            $post->ID,
            $result
        );
    }
}`
            }></textarea>
            <ModalHint>Function does not exist, add the above code to your theme's functions.php</ModalHint>
        </Modal>
    );
}