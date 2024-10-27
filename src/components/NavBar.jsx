import { Link } from 'react-router-dom';

export default function NavBar() {

    return (
        <>
            <nav className="navbar">
                <ul className="navbar-links">
                    <li>
                        <div className="navbar-brand">
                            <Link to="/">Logo</Link></div>
                    </li>
                    <li>
                        <Link to="/tadron-es-teatro">TADRON <br />ES TEATRO</Link>
                    </li>
                    <li>
                        <Link to="/espectaculos">ESPECTÁCULOS</Link>
                    </li>
                    <li>
                        <Link to="/cursosytalleres">CURSOS Y <br />TALLERES</Link>
                    </li>
                    <li>
                        <Link to="/programa-tu-espectaculo">PROGRAMÁ<br /> TU ESPECTÁCULO</Link>
                    </li>
                    <li>
                        <Link to="/nuestro-espacio">NUESTRO <br />ESPACIO</Link>
                    </li>
                    <li>
                        <Link to="/ciclo-teatro-justicia">CICLO<br /> TEATRO X LA JUSTICIA</Link>
                    </li>
                    <li>
                        <Link to="/gaston-breyer">GASTÓN<br /> BREYER</Link>
                    </li>
                    <li>
                        <Link to="/contacto">CONTÁCTO</Link>
                    </li>

                </ul>
            </nav>

        </>
    )
}