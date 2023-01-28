import React from "react";
import styled from '@emotion/styled'

const Dialog = styled.dialog`
    background: rgb(0 0 0 / 50%);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`

const DialogBody = styled.div`
    padding: 1em;
    background: white;
    min-width: 33vw;
`

const DialogHeader = styled.div`
    display: flex;
    justify-content: space-between;
`

const Modal = ({title,children,onClose = ()=>{}}) => {

    return (<Dialog>
        <DialogBody>
            <DialogHeader>
                <span>{title}</span>
                <button onClick={onClose}>&times;</button>
            </DialogHeader>
            <div>
                {children}
            </div>
        </DialogBody>
    </Dialog>);
}

export default Modal;