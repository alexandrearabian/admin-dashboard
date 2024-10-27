import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Redes from './Redes';

export default function Foot() {

    const InstagramLink = 'https://www.instagram.com/tadronteatro?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';
    const FacebookLink = 'http://facebook.com/tadron.teatro.teatro/'
    const YoutubeLink = 'hhttp://www.youtube.com/@tadronteatro9598'
    const Hotmail = 'mailto:tadronteatro@hotmail.com'
    const Telefono = '47777976'
    const TelefonoLink = `tel:${Telefono}`


    return (
        <>
            <footer>
                <p style={{
                    textAlign: 'center',
                    fontFamily: 'Merriweather',
                    fontWeight: '200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    marginTop: '2.25rem'
                }}>
                    <span><strong>Tadron</strong> Teatro</span>
                    |
                    <span>Niceto Vega 4802 (esq. Armenia)</span>
                    |
                    <span>CABA - Tel: <strong>4777-7976</strong></span>
                </p>
                <div className='socials'>
                    <Redes icon={faInstagram} link={InstagramLink} color='#FFC1EE'>
                        Instagram
                    </Redes>
                    <Redes icon={faFacebook} link={FacebookLink} color='#ADD6FF'>
                        Facebook
                    </Redes>
                    <Redes icon={faYoutube} link={YoutubeLink} color='#FFB3A8'>
                        Youtube
                    </Redes>
                    <Redes icon={faEnvelope} link={Hotmail} color='#D0E1FF'>
                        Mail
                    </Redes>
                    <Redes icon={faPhone} link={TelefonoLink} color='#C0F9C5'>
                        Teléfono
                    </Redes>



                </div>
            </footer>
        </>
    );
}