import {css} from '@emotion/css'
import { useEffect, useState } from 'react';
import PostsTable from './PostsTable';
import CreateColumnModal from './modals/CreateColumnModal';
import { useCallback } from 'react';
import { GlobalStyles } from './common/GlobalStyles';


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
        <header>
            <button onClick={onCreateColumnClick}>Create Column</button>
        </header>
        <PostsTable />
        {showCreateColumn && <CreateColumnModal onClose={onCloseCreateColumnClick} />}
    </div>
    </>
  }