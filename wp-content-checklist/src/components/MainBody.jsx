import {css} from '@emotion/css'
import { useEffect, useState } from 'react';
import {PostsTable} from './PostsTable/PostsTable';
import CreateColumnModal from './modals/CreateColumnModal';
import { useCallback } from 'react';
import { GlobalStyles } from './common/GlobalStyles';
import styled from '@emotion/styled';
import { PostsSheet } from './PostsSheet';

const Header = styled.header`
    width: 100%;
    height: 2em;
    background: white;
    position: fixed;
    top: 0;
    z-index: 9;
`
export const MainBody = () => {

    const [showCreateColumn,setShowCreateColumn] = useState(false)
    console.log('main body');
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
        <PostsSheet />
        {showCreateColumn && <CreateColumnModal onClose={onCloseCreateColumnClick} />}
    </div>
    </>
  }