import { css } from "@emotion/react";
import { Alert, Modal } from "antd";
import React, { useState } from "react";
import copy from "copy-to-clipboard";

interface Props {
  functionName: string;
  onClose: () => void;
  open: boolean;
}
const CopyFunctionModal = ({ functionName, onClose, open }: Props) => {
  const [copied, setCopied] = useState(false);
  const code = `function ${functionName} ($slug){
    
        //get all posts you want to check
        $query = new WP_Query([
            'post_type'=>'post',
            'posts_per_page'=>-1
        ]);
        
        foreach($query->posts as $post)
        {
            /**
             * Put logic here that checks whether each post is unknown,N/A,no,yes
             * -2 = unknown
             * -1   = N/A
             * 0    = No
             * 1    = Yes
             */
            $result = -2;
    
            //set that value for the post and column
            wpcc_set_column(
                $slug,
                $post->ID,
                $result
            );
        }
    }`;
  return (
    <Modal
      onCancel={onClose}
      onOk={() => {
        copy(code);
        setCopied(true);

        setTimeout(() => {
          onClose();
          setCopied(false);
        }, 500);
      }}
      okText="Copy Function"
      title={`${functionName} does not exist`}
      open={open}
    >
      <Alert
        message="Add this function definition to your Wordpress theme"
        type="info"
      />
      <textarea
        css={css`
          width: 100%;
          height: 18em;
          font-family: Courier New;
          background: #333;
          color: #fff;
          padding: 1em;
          border-radius: 4px;
        `}
        value={code}
      ></textarea>
      {copied && <Alert message="Function Copied" type="success" />}
    </Modal>
  );
};

export default CopyFunctionModal;
