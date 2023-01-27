
import { useEffect } from 'react';
import { useStore } from './store';

const MainBody = () => {
  
  const posts = useStore(state => state.posts)
  const setPosts = useStore(state => state.setPosts)

  console.log({posts,setPosts});

  useEffect(()=>{
    console.log({posts});
  },[posts])

  return <div>
    <button onClick={()=>{
      setPosts([
        ...posts,
        "another post"
      ])
  }}>more tests plz</button>
  <ul>
    {posts.map((post,i) => <li key={i}>{post}</li>)}
  </ul>
  </div>
}

function App() {

  return (
    
      <div className="App">
        <MainBody />
      </div>
    
  )
}

export default App
