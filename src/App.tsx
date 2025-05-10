import './App.css';
import { PrimeReactProvider } from 'primereact/api';
import ListaProductosComponent from './components/ListaProductosComponent'
import ListaCategoriaComponent from './components/ListaCategoriaComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ListaUsuarios from './components/ListaUsuarios';
import ListaRolesComponent from './components/ListaRolesComponent';
import { CustomSidebar } from './layout/CustomSidebar';


function App() {

  return (
    <PrimeReactProvider>
      <CustomSidebar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Welcome to the App</h1>} />
          <Route path="/productos" element={<ListaProductosComponent />} />
          <Route path="/categorias" element={<ListaCategoriaComponent />} />
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/roles" element={<ListaRolesComponent />} />
        </Routes>
      </BrowserRouter>
      </CustomSidebar>
    </PrimeReactProvider>
  )
}

export default App
