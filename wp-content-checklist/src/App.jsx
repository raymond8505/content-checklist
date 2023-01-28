import { useEffect } from 'react';
import { MainBody } from './components/MainBody';

function App() {

  useEffect(()=>{
    fetch('http://localhost/raymondsfood/wp-admin/admin-ajax.php?action=get_posts').then(resp => {
      resp.text().then(txt => {
        console.log(txt);
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
