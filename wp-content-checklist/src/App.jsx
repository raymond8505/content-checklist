import { useEffect } from 'react';
import { MainBody } from './components/MainBody';
import { useStore } from './store';

function App() {

  const {setPosts,setColumns} = useStore()

  useEffect(()=>{
    fetch('http://localhost/raymondsfood/wp-admin/admin-ajax.php?action=wpcc_init').then(resp => {
      resp.json().then(json => {
        setPosts(json.posts)
        setColumns(json.columns)
      })
    })
  },[]);

  return (
    
      <div className="App">
        <MainBody />
      </div>
    
  )
}

export default App
