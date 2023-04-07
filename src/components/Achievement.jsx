import { useFetchData } from "../hooks/useFetchData";
import Item from "./Item";

/**
 * @name Achievement
 * @description The achievement component to be displayed.
 * @param {*} props
 * @returns
 */
const Achievement = (props) => {
  const { name, icon, points, id } = props;
  const { data, loading } = useFetchData(
    "https://xivapi.com/achievement/" + id
  );
  return loading || data === null ? null : (
    <li className="achievement">
      <Item icon={"https://xivapi.com" + icon} />
      <div className="col gap-sm">
        <div className="achievement__header">
          <h4>{name}</h4>
          <p style={{ color: "var(--color-experience)" }}>
            {data.AchievementCategory.Name}
          </p>
        </div>
        <p>{data.Description}</p>
      </div>
      <h3 style={{ marginLeft: "auto", color: "var(--color-completed)" }}>
        {points}
      </h3>
    </li>
  );
};

export default Achievement;
