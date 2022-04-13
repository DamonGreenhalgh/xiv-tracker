import './Settings.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Button from '../components/utility/Button';
import Banner from '../components/Banner';
import Divider from '../components/utility/Divider';
import Loading from '../components/utility/Loading';
import Checkbox from '../components/utility/Checkbox';

const splashName = [
    'None',
    'A Realm Reborn',
    'Heavensward',
    'Stormblood',
    'Shadowbringers',
    'Endwalker'
]

const storyBreakpointsId = [
    1129,    // Heavensward
    1691,    // Stormblood
    2233,    // Shadowbringers
    2851     // Endwalker
]

const Settings = (props) => {

    const [displayDropdown, setDisplayDropdown] = useState(-1);
    const [safeMode, setSafeMode] = useState(true);
    const [referenceBanner, setReferenceBanner] = useState(null);
    const [useRefForBackground, setUseRefForBackground] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [statusText, setStatusText] = useState("");
    const navigate = useNavigate();

    // Mount
    useEffect(() => {

        // Set new content width
        document.documentElement.style.setProperty('--content-width', '70rem');
        props.setShowSearchbar(false);
        document.title = "XIV Tracker | Settings";

        // Load reference character if it exists.
        if (props.referenceCharacter !== null) {
            if (props.referenceCharacter.Character.ID !== null && useRefForBackground) {
                requestData(props.referenceCharacter.Character.ID);
            }
        }

    }, [useRefForBackground])

    const requestData = async(id) => {

        setIsSearching(true);

        await fetch("https://xivapi.com/character/" + id + "?extended=1&data=AC", {mode: 'cors'})
            .then(response => response.json())
            .then(data => {
                if (data !== undefined) {

                    // Save id to local storage.
                    localStorage.setItem('id', data.Character.ID)
                    
                    // Update reference character.
                    props.setReferenceCharacter(data);
                    
                    // Set banner.
                    setReferenceBanner(() => 
                        <Banner 
                            type='reference'
                            avatar={<img src={data.Character.Avatar} className='rounded' />}
                            name={data.Character.Name}
                            title={data.Character.Title.Name}
                            misc={data.Character.Server}
                            link={"/" + id}
                        />
                    )
        
                    // Set background splash according to reference character.
                    if (useRefForBackground) {
                        let breakpoint = 0;
                        for (let i = 0; i < data.Achievements.List.length; i++) {
                            if (storyBreakpointsId.includes(data.Achievements.List[i].ID)) {
                                breakpoint++;
                            }
                        }
                        props.setSplash(breakpoint + 1)
                    }
                    setStatusText("");
                } else {
                    setStatusText("Character with ID: " + id + " does not exist.");
                }  
            })
        setIsSearching(false);
    }

    return(
        <div className="settings">
            <div className="settings__form">
                <h1>Settings</h1>
                <Divider />
                <div className='settings__row'>

                    <div className='col gap max-width'>
                        <h2>Appearance</h2>
                        <h3>Theme</h3>
                        <p>Sets the visual theme of <b>XIV Tracker</b></p>
                        <div 
                            className="select"
                            onClick={() => setDisplayDropdown(displayDropdown == 0 ? -1 : 0)}
                        >
                            {props.theme}
                            {displayDropdown == 0 ? <BsChevronUp /> : <BsChevronDown />}
                            <div 
                                className={displayDropdown == 0 ? "options" : "disabled"} 
                                onClick={(e) => props.setTheme(e.target.innerText)}
                            >
                                <div>light</div>
                                <div>dark</div>
                            </div>
                        </div>
                        <h3>Splash</h3>
                        <p>Select the background splash art to display.</p>
                        <div 
                            className={"select" + (useRefForBackground ? ' select--disabled' : '')}
                            onClick={() => 
                                useRefForBackground
                                ? null
                                : setDisplayDropdown(displayDropdown == 1 ? -1 : 1)
                            }
                        >
                            {splashName[props.splash]}
                            {displayDropdown == 1 ? <BsChevronUp /> : <BsChevronDown />}
                            <div 
                                className={displayDropdown == 1 ? "options" : "disabled"}
                                onClick={(e) => 
                                    useRefForBackground
                                    ? null
                                    : props.setSplash(Array.from(e.target.parentNode.children).indexOf(e.target))
                                }
                            >
                                <div>None</div>
                                <div>A Realm Reborn</div>
                                <div>Heavensward</div>
                                <div>Stormblood</div>
                                <div>Shadowbringers</div>
                                <div>Endwalker</div>
                            </div>
                        </div>
                        <div className='row align-center gap'>
                            <Checkbox condition={useRefForBackground} update={setUseRefForBackground} />
                            <p>Use reference character to determine splash</p>
                        </div>
                    </div>

                    <div className='col gap max-width'>
                        <h2>Experience</h2>
                        <h3>Reference</h3>
                        <p>Select a character to reference. XIV Tracker uses this character's data to improve the user experience.</p>
                        {
                            isSearching ?
                            <Loading /> :
                            <div className='row'>
                                <input style={{flex: '3'}} type='text' placeholder="Lodestone ID e.g. 38592216" />
                                <Button style={{flex: '1'}} onClick={(e) => requestData((e.target.parentNode.firstChild.value))} content="Search"/>

                            </div>

                        }
                        {referenceBanner}
                        <p>{statusText}</p>
                        <h3>Spoilers</h3>
                        <div className='row align-center gap'>
                            <Checkbox condition={safeMode} update={setSafeMode} />
                            <p>Enable spoiler safe mode</p>
                        </div>
                        
                    </div>
                </div>       
            </div>
            <Button content="Save" onClick={() => navigate(-1)} style={{width: "5rem"}} />
        </div>
    );
}

export default Settings;