import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Redes({ icon, link, children, color }) {
    return (
        <>
            <a href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    alignItems: 'center',
                    color: color,
                }}
            >
                {icon &&
                    <span style={{
                        color: color, // Fix: Directly use color value here
                        marginRight: '0.5em',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <FontAwesomeIcon icon={icon} size='2x' />
                        {children}
                    </span>}
            </a>
        </>
    )
}
