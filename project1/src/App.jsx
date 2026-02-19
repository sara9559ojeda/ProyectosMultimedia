import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Inicio from "./pages/Inicio";
import Proyectos from "./pages/Proyectos";
import Contacto from "./pages/Contacto";
import Ejercicio1 from "./pages/Ejercicio1";

function App() {
  return (
    <Router>
      <Routes>
        {/* Definimos el layout principal que envuelve todas las rutas */}
        <Route path="/" element={<Layout />}>
          {/* Página de inicio */}
          <Route index element={<Inicio />} />
          
          {/* Otras páginas */}
          <Route path="proyectos" element={<Proyectos />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="ejercicio1" element={<Ejercicio1 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;