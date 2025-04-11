import './App.css';
import { PrimeReactProvider } from 'primereact/api';
import ListaProductosComponent from './components/ListaProductosComponent'

function App() {

  return (
    <PrimeReactProvider>
      <ListaProductosComponent/>
    </PrimeReactProvider>
  )
}

export default App
