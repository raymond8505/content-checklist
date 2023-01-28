import { useStore } from '../store';
import {css} from '@emotion/css'

export const MainBody = () => {
  
    const posts = useStore(state => state.posts)
    const setPosts = useStore(state => state.setPosts)
  
    return <div css={css`
        width: 500px;
        height: 500px;
        background: white;
        
        `}>
    </div>
  }