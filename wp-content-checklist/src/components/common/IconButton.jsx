import styled from "@emotion/styled";
import { Icon } from "./Icon";

const Button = styled.button`
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
    height: 1.5em;
    
    img
    {
        height: 100%;
    }
`

const IconButton = ({src,alt}) => {

    return (<Button title={alt}>
        <Icon src={src} role="presentation" />
    </Button>);
}

export default IconButton;