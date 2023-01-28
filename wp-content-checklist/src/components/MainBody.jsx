import { useStore } from '../store';
import {css} from '@emotion/css'

export const MainBody = () => {
  
    // const posts = useStore(state => state.posts)
    // const setPosts = useStore(state => state.setPosts)

    const {posts,setPosts} = useStore()

    console.log({posts,setPosts});
  
    return <div className={css`
        width: 500px;
        height: 500px;
        background: white;`}>
    </div>
  }