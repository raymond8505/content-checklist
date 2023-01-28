import { useStore } from '../store';
import {css} from '@emotion/css'
import { useEffect } from 'react';
import PostsTable from './PostsTable';

export const MainBody = () => {
    
    return <div className={css`
        background: white;
        width: 100vw;
        height: 100vh;
    `}>
        <header>
            <button>Create Column</button>
        </header>
        <PostsTable />
    </div>
  }