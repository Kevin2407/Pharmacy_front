import './App.css';
import { PrimeReactProvider } from 'primereact/api';
import Header from './layout/Header';
import ListaProductosComponent from './components/ListaProductosComponent'
import ListaCategoriaComponent from './components/ListaCategoriaComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <PrimeReactProvider>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Welcome to the App</h1>} />
          <Route path="/productos" element={<ListaProductosComponent />} />
          <Route path="/categorias" element={<ListaCategoriaComponent />} />
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  )
}

export default App
