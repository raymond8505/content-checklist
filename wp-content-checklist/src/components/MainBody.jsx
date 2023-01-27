const MainBody = () => {
  
    const posts = useStore(state => state.posts)
    const setPosts = useStore(state => state.setPosts)
  
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