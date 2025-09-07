import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FruitRecipeWithSave from './FruitsRecieps'
import FruitSelector from './componenets/Fruitselect'
import FruitList from './componenets/Fruitselect'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <FruitList />
     

    </>
  )
}

export default App
