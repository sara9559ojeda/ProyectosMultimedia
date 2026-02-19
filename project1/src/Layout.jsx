import { Outlet, useLocation } from "react-router-dom";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";

function Layout() {
  const location = useLocation();

  return (
    <div className="d-flex flex-column vh-100">
      {/* 🔹 Cabecera fija con Bootstrap */}
      <Navbar expand="lg" bg="light" variant="light">
        <Container fluid>
          <Navbar.Brand href="#">Portafolio</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent" />
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="me-auto">
              <Nav.Link href="/">Inicio</Nav.Link>
              <Nav.Link href="/proyectos">Proyectos</Nav.Link>

              {/* 🔹 Menú desplegable de prácticas */}
              <Dropdown>
                <Dropdown.Toggle as={Nav.Link} id="dropdown-custom">
                  Prácticas
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/ejercicio1">Práctica 1</Dropdown.Item>
                  <Dropdown.Item href="#">Práctica 2</Dropdown.Item>
                  <Dropdown.Item href="#">Práctica 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Nav.Link href="/contacto">Contacto</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔹 Contenedor de las páginas con animaciones suaves */}
      <Container fluid className="flex-grow-1 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* 🔹 Pie de página fijo */}
      <footer className="text-center py-3 bg-dark text-white w-100"></footer>
    </div>
  );
}

export default Layout;