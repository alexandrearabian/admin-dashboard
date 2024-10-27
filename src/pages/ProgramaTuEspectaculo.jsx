import FotoPrincipal from '/Users/alex/Documents/MisProyectos/TadronWeb/tadron-web/src/assets/Sala-luces.jpg'

export default function ProgramaTuEspectaculo() {

    return (
        <>
            <img src={FotoPrincipal} className='foto-principal' />
            <h1>Programá tu espectáculo</h1>
            <div className='formato'>
                <div className='doble-division'>
                    <p style={{
                        textAlign: 'left'
                    }}>
                        La Sala Gastón Breyer de TADRON Teatro es un espacio versátil y rico en posibilidades.
                        Tiene una capacidad de cincuenta localidades con butacas dispuestas en graderías móviles. La disposición escénica puede ser diferente para cada espectáculo.

                    </p>
                    <p style={{
                        textAlign: 'left',
                        marginLeft: '5rem'
                    }}>
                        Si querés visitar la sala , comunicate en cualquier momento para coordinar con nosotros. También podés escribirnos por consultas para programar tu obra.
                        <br />
                        Nuestro correo electrónico es: <br />
                        <a
                            href='mailto:tadronteatro@hotmail.com'
                            target="_blank"
                            rel="noopener noreferrer"><strong>tadronteatro@hotmail.com</strong>
                        </a>
                    </p>
                </div>
            </div >
        </>
    )

}