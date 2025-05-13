import './App.css';
import { PrimeReactProvider } from 'primereact/api';
import ListaProductosComponent from './pages/Productos'
import ListaCategoriaComponent from './pages/Categoria';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ListaUsuarios from './pages/Usuarios';
import ListaRolesComponent from './pages/Roles';
import { CustomSidebar } from './layout/CustomSidebar';
import Inicio from './pages/Inicio';


function App() {

  return (
    <PrimeReactProvider>
      <CustomSidebar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio/>} />
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
