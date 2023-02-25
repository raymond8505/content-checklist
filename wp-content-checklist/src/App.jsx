import { useEffect } from 'react';
import { useServerUpdate } from './api';
import { MainBody } from './components/MainBody';



function App() {

  const updateFromServer = useServerUpdate()
  
  useEffect(()=>{
    updateFromServer()
  },[]);

  return (
    
      <div className="App">
        <MainBody />
      </div>
    
  )
}

export default App
