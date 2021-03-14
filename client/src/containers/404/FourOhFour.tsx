import './FourOhFour.css';
import lostBoyIMG from '../../assets/404.jpg'

export default function FourOhFour() {
    return (
        <div className="FourOhFour">
            <img src={lostBoyIMG} alt="Lost Boy" />
            <p>
                Not all those who wander are lost. But you, yes you! Did you get lost in the eyes of one of those LTT employees?
            </p>
            <p>
                Click the LTT logo to go Home and find them :)
            </p>
        </div>
    )
}