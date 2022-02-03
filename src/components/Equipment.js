import './Equipment.css';
import Item from './Item';

const Equipment = (props) => {

    const equipmentNames = Object.keys(props.gear);

    return (
        <div className="equipment">
            <div style={{backgroundImage: "url('" + props.portrait + "')"}} className="equipment__portrait">
                <h3 className="equipment__level">{"Lv. " + props.level}</h3>
            </div>
            {Object.values(props.gear).map((item, index) => 
                <Item 
                gridArea={equipmentNames[index]}
                name={item.Item.Name}
                icon={("https://xivapi.com" + item.Item.Icon).slice(0, -4) + "_hr1.png"}
                key={item.Item.ID} 
                />
            )}
        </div>
    );
}

export default Equipment;