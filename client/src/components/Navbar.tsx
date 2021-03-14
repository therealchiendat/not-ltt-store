import "./Navbar.css";
import { useHistory } from 'react-router-dom';
import { CSSProperties } from "react";

export const Navbar = ({ transparent, position }: { transparent: boolean, position: string }) => {
    const history = useHistory();

    function Style(): CSSProperties {
        const returnParam: any = {};
        if (position === 'fixed-top') {
            returnParam.position = 'fixed';
            returnParam.top = '0';
        }
        if (transparent) {
            returnParam.backgroundColor = 'transparent';
        } else {
            returnParam.backgroundColor = 'white';
        }

        return returnParam;
    }

    function handleNavClick(location: string) {
        history.push('/' + location);
    }

    return (
        <div className="nav-bar" style={Style()}>
            <div className="section menu-button float-left">
                <svg className="Icon pointer" role="presentation" viewBox="0 0 24 16">
                    <path d="M0 15.985v-2h24v2H0zm0-9h24v2H0v-2zm0-7h24v2H0v-2z" fill="black"></path>
                </svg>
            </div>
            <div className="section pointer" onClick={() => handleNavClick('')}>
                <img className="logo" src="//cdn.shopify.com/s/files/1/0058/4538/5314/files/New-LTT-logo1080_50x.png?v=1539646406" height="50" width="50" alt="Definitely not Linus Tech Tips Store" />
            </div>
            <div className="section float-right">
                <div className="menu-button pointer" onClick={() => handleNavClick('profile')}>
                    <svg role="presentation" viewBox="0 0 20 20">
                        <g transform="translate(1 1)" stroke="black" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="square">
                            <path d="M0 18c0-4.5188182 3.663-8.18181818 8.18181818-8.18181818h1.63636364C14.337 9.81818182 18 13.4811818 18 18"></path>
                            <circle cx="9" cy="4.90909091" r="4.90909091"></circle>
                        </g>
                    </svg>
                </div>
                <div className="menu-button pointer">
                    <svg role="presentation" viewBox="0 0 21 21">
                        <g transform="translate(1 1)" stroke="black" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="square">
                            <path d="M18 18l-5.7096-5.7096"></path>
                            <circle cx="7.2" cy="7.2" r="7.2"></circle>
                        </g>
                    </svg>
                </div>
                <div className="menu-button pointer">
                    <svg role="presentation" viewBox="0 0 19 23">
                        <path d="M0 22.985V5.995L2 6v.03l17-.014v16.968H0zm17-15H2v13h15v-13zm-5-2.882c0-2.04-.493-3.203-2.5-3.203-2 0-2.5 1.164-2.5 3.203v.912H5V4.647C5 1.19 7.274 0 9.5 0 11.517 0 14 1.354 14 4.647v1.368h-2v-.912z" fill="black"></path>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Navbar;