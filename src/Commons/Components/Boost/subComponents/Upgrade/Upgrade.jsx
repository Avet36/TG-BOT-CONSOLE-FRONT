import "./Upgrade.css";
import upgrade1 from "../../../../../Assets/Home/Upgrade/upgrade-1.svg";
import upgradeLogoIcon from "../../../../../Assets/Home/Upgrade/upgrade-logo.svg";
import upgradeTonIcon from "../../../../../Assets/Home/Upgrade/upgrade-ton.svg";
import upgradeSuccessIcon from "../../../../../Assets/Home/Upgrade/upgrade-success.svg";
import { useEffect, useState } from "react";
import UpgradePopUp from "./UpgradePopUp/UpgradePopUp";
import { useDispatch, useSelector } from "react-redux";
import { getHomePageDataThunk } from "../../../../../Store/Middlewares/homePageData";
import { resetIsSuccess } from "../../../../../Store/Slices/telegramLoginSLice";
import { formatLargeNumber } from "./../../../../../utils/index";

const Upgrade = ({ data }) => {
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const token = useSelector((state) => state?.telegramLogin?.token);
  const isSuccess = useSelector((state) => state?.telegramLogin?.isSuccess);
  const dispatch = useDispatch();
  const handleOPenPopUp = (item) => {
    setShow(true);
    setSelectedItem(item);
  };

  // need optimizate get

  useEffect(() => {
    if (isSuccess) {
      dispatch(getHomePageDataThunk({ token }));
      dispatch(resetIsSuccess(false));
    }
  }, [dispatch, isSuccess, token]);

  // for when user open modal  can't scroll
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };

    if (show) {
      document.body.style.overflow = "hidden";
      document.body.addEventListener("touchmove", preventScroll, {
        passive: false
      });
    } else {
      document.body.style.overflow = "";
      document.body.removeEventListener("touchmove", preventScroll);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, [show]);

  return (
    <div className="upgrade">
      <div className="upgradeText">
        <img src={upgradeSuccessIcon} alt="upgradeSuccessIcon" />
        <p>Upgrading these blocks will apply the selected option permanently</p>
      </div>
      {Array.isArray(data) &&
        data.map((i, index) => {
          return (
            <>
              <div
                key={index}
                className={`freeItem ${i.border ? "border" : ""}`}
              >
                <div className="upgradeBonus">
                  <img src={upgrade1} alt="bonus" />
                  {i?.speed > 1 && <h3>X {i?.speed}</h3>}
                </div>
                <div className="freeItemText">
                  <h2>Block Upgrade</h2>
                  <p>
                    For each block, you will receive{" "}
                    {formatLargeNumber(+i.point)} points.
                  </p>
                </div>

                <div className="buy">
                  <div className="upgradeIcons">
                    <img src={upgradeLogoIcon} alt="logo" />
                    <img src={upgradeTonIcon} alt="Ton" />
                  </div>
                  <button
                    disabled={i?.is_active}
                    onClick={() => handleOPenPopUp(i)}
                    style={{
                      color: i?.is_active ? "#FFF" : "",
                      backgroundColor: i?.is_active ? "gray" : ""
                    }}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </>
          );
        })}
      {show && <UpgradePopUp setShow={setShow} data={selectedItem} />}
    </div>
  );
};
export default Upgrade;
