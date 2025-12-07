import "./Boost.css";
import { useEffect } from "react";
import Upgrade from "./subComponents/Upgrade/Upgrade";
import Bot from "./subComponents/Bot/Bot";
import BoostPage from "./subComponents/BoostPage/BoostPage";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateSelectedTab } from "../../../Store/Slices/boostsSlice";
import { useNavigate, useParams } from "react-router-dom";

const Boost = () => {
  const { tab } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedTab = useSelector((state) => state?.boosts?.selectedTab || "");
  const homeData = useSelector((state) => state?.homePage?.homeData);

  useEffect(() => {
    const validTabs = ["upgrade", "bot", "boosts"];
    const actualTab = validTabs.includes(tab) ? tab : navigate("/");
    if (actualTab !== selectedTab) {
      dispatch(setUpdateSelectedTab(actualTab));
    }
  }, [tab, dispatch, selectedTab]);

  const handleTabChange = (newTab) => {
    dispatch(setUpdateSelectedTab(newTab));
    navigate(`/${newTab}`);
  };

  return (
    <div className="boost">
      <h2>Boost Your CP</h2>

      <nav>
        <ul>
          <li
            className={selectedTab === "upgrade" ? "activePage" : ""}
            onClick={() => handleTabChange("upgrade")}
          >
            Upgrade
          </li>
          <li
            className={selectedTab === "bot" ? "activePage" : ""}
            onClick={() => handleTabChange("bot")}
          >
            Bot
          </li>
          <li
            className={selectedTab === "boosts" ? "activePage" : ""}
            onClick={() => handleTabChange("boosts")}
          >
            Boosts
          </li>
        </ul>
      </nav>

      {selectedTab === "upgrade" && (
        <Upgrade data={homeData?.booster?.upgrades} />
      )}
      {selectedTab === "bot" && <Bot data={homeData?.booster?.bot} />}
      {selectedTab === "boosts" && (
        <BoostPage data={homeData?.booster?.boosts} />
      )}
    </div>
  );
};

export default Boost;
