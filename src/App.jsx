import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/FirebaseConfig"; // Adjust the import path to your firebase config
import NavBar from "./components/NavBar";
import Contacto from "./pages/Contacto";
import Foot from "./components/Foot";
import PrimeraPagina from "./pages/PrimeraPagina";
import TadronEsTeatro from "./pages/TadronEsTeatro";
import GastonBreyer from "./pages/GastonBreyer";
import CicloTxJ from "./pages/CicloTxJ";
import NuestroEspacio from "./pages/NuestroEspacio";
import Actividades from "./pages/Actividades";
import ProgramaTuEspectaculo from "./pages/ProgramaTuEspectaculo";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";

function App() {
  // Get the user's authentication state
  const [user, loading] = useAuthState(auth);

  // Show a loading screen while checking the user's auth status
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Router>
        <div>
          {/* Show the NavBar only if the user is authenticated */}
          {user && <NavBar />}

          <Routes>
            {/* Public Route: Login */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes: Only accessible if the user is authenticated */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<PrimeraPagina />} />
              <Route path="/tadron-es-teatro" element={<TadronEsTeatro />} />
              <Route
                path="/programa-tu-espectaculo"
                element={<ProgramaTuEspectaculo />}
              />
              <Route path="/nuestro-espacio" element={<NuestroEspacio />} />
              <Route path="/ciclo-teatro-justicia" element={<CicloTxJ />} />
              <Route path="/gaston-breyer" element={<GastonBreyer />} />
              <Route
                path="/espectaculos"
                element={
                  <Actividades
                    key="cartelera"
                    actividad="cartelera"
                    datos="datosEspectaculos"
                  />
                }
              />
              <Route
                path="/cursosytalleres"
                element={
                  <Actividades
                    key="cursos"
                    actividad="cursos"
                    datos="datosCursos"
                  />
                }
              />
              <Route path="/contacto" element={<Contacto />} />
            </Route>
          </Routes>

          {/* Show the Foot only if the user is authenticated */}
          {user && <Foot />}
        </div>
      </Router>
    </>
  );
}

export default App;
