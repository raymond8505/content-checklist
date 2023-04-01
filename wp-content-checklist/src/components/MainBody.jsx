import {css} from '@emotion/css'
import {  useState } from 'react';
import CreateColumnModal from './modals/CreateColumnModal';
import { useCallback } from 'react';
import { GlobalStyles } from './common/GlobalStyles';
import styled from '@emotion/styled';
import { PostsSheet } from './PostsSheet/PostsSheet';
import {PlusCircleOutlined, ToolOutlined} from '@ant-design/icons'
import { UnstyledButton } from './common/Button';
import {ConfigProvider, Modal} from 'antd'
import ColumnToolsModal from './modals/ColumnToolsModal';

const Header = styled.header`
    width: 100%;
    height: 3em;
    background: white;
    position: fixed;
    top: 0;
    z-index: 9;
    display: flex;
    justify-content: flex-start;
    padding: .5em 1vw;
    column-gap: 1em;

    button
    {
        height: 100%;
    }

    svg {
        width:2em;
        height:2em;
        }
`
export const MainBody = () => {

    const [showCreateColumn,setShowCreateColumn] = useState(false)
    const [showTools,setShowTools] = useState(false)

    console.log('main body');
    const onCreateColumnClick = useCallback(()=>{
        setShowCreateColumn(true)
    })
    const onCloseCreateColumnClick = useCallback(()=>{
        setShowCreateColumn(false)
    })
    return <ConfigProvider theme={{
        token : {
            colorPrimary : "#333"
        }
    }}>
        <GlobalStyles />
    <div className={css`
        background: white;
        width: 100vw;
        height: 100vh;
        padding-top: 3.5em;
    `}>
        <Header>
            <UnstyledButton onClick={onCreateColumnClick} title="Add Column">
                <PlusCircleOutlined />
            </UnstyledButton>
            <UnstyledButton onClick={()=>{
                setShowTools(true)
            }}>
                <ToolOutlined />
            </UnstyledButton>
        </Header>
        <PostsSheet />
        {showCreateColumn && <CreateColumnModal onClose={onCloseCreateColumnClick} />}
        <ColumnToolsModal onClose={()=>{
            setShowTools(false)
        }} open={showTools}>
            test
        </ColumnToolsModal>
    </div>
    </ConfigProvider>
  }