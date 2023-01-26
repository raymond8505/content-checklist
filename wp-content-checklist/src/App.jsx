import { createContext, useContext } from 'react'
import { createStore, useStore } from 'zustand'

const store = createStore({
  posts : []
})

const StoreContext = createContext()

function App() {
  const [count, setCount] = useState(0)

  return (
    <StoreContext.Provider value={store}>
    <div className="App">
      
    </div>
    </StoreContext.Provider>
  )
}

export default App
