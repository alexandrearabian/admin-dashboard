import AdminDashboard from './AdminDashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Contacto from './pages/Contacto';
import Foot from './components/Foot';
import PrimeraPagina from './pages/PrimeraPagina';
import TadronEsTeatro from './pages/TadronEsTeatro';
import GastonBreyer from './pages/GastonBreyer';
import CicloTxJ from './pages/CicloTxJ';
import NuestroEspacio from './pages/NuestroEspacio';
import Espectaculos from './pages/Espectaculos';
import CursosYTalleres from './pages/CursosYTalleres';

function App() {

  return (
    <>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/" element={<PrimeraPagina />} />
            <Route path="/tadron-es-teatro" element={<TadronEsTeatro />} />
            {/* <Route path="/programa-tu-espectaculo" element={<ProgramaTuEspectaculo />} /> */}
            <Route path="/nuestro-espacio" element={<NuestroEspacio />} />
            <Route path="/ciclo-teatro-justicia" element={<CicloTxJ />} />
            <Route path="/gaston-breyer" element={<GastonBreyer />} />
            <Route path="/espectaculos" element={<Espectaculos />} />
            <Route path="/cursosytalleres" element={<CursosYTalleres />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
          <Foot />
        </div>
      </Router>
    </>
  )
}

export default App
