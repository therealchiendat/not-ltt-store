import './Profile.css';
import profile from '../../assets/profile-picture.png';

export default function Profile() {
    return (
        <div className="Profile">
            <div className="header">
                <img src={profile} alt="profile"/>
                <h1>Hey! It's Dat here!</h1>
            </div>
            <hr />
            <div>
                <div>
                    This website was built using coffee
                </div>
                <div>
                    <h2>FAQ:</h2>
                    <ul>
                        <li>Q:Who built this website?</li>
                        A: Me!
                        <li>Q:Is this for real?</li>
                        A: Bahaha, NOOOOOO!
                        <li>Q: Why?</li>
                        A: Why not! Actually so you can see what I can do :)
                        <li>Q: But I want this to be real!!!</li>
                        A: That's not a question but contact Linus for that :P
                    </ul>
                </div>
            </div>
        </div>
    )
}