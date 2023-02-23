import {css} from '@emotion/css'
import { useEffect, useState } from 'react';
import PostsTable from './PostsTable';
import CreateColumnModal from './modals/CreateColumnModal';
import { useCallback } from 'react';
import { GlobalStyles } from './common/GlobalStyles';
import styled from '@emotion/styled';

const Header = styled.header`
    width: 100%;
    height: 2em;
    background: white;
    position: sticky;
    top: 0;
    z-index: 9;
`
export const MainBody = () => {

    const [showCreateColumn,setShowCreateColumn] = useState(false)
    const onCreateColumnClick = useCallback(()=>{
        setShowCreateColumn(true)
    })
    const onCloseCreateColumnClick = useCallback(()=>{
        setShowCreateColumn(false)
    })
    return <>
        <GlobalStyles />
    <div className={css`
        background: white;
        width: 100vw;
        height: 100vh;
    `}>
        <Header>
            <button onClick={onCreateColumnClick}>Create Column</button>
        </Header>
        <PostsTable />
        {showCreateColumn && <CreateColumnModal onClose={onCloseCreateColumnClick} />}
    </div>
    </>
  }