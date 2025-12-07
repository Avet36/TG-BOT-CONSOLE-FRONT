import "./Bot.css";
import assistanIcon from "../../../../../Assets/Home/assistant-icon.svg";
import { useEffect, useState } from "react";
import BotModal from "./BotModal";
import BotFirstModal from "./botModal/BotFirstModal";
import { useDispatch, useSelector } from "react-redux";
import { getHomePageDataThunk } from "../../../../../Store/Middlewares/homePageData";
import { resetIsSuccess } from "../../../../../Store/Slices/telegramLoginSLice";

const Bot = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const token = useSelector((state) => state?.telegramLogin?.token);
  const isSuccess = useSelector((state) => state?.telegramLogin?.isSuccess);
  const homeData = useSelector((state) => state?.homePage?.homeData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(getHomePageDataThunk({ token }));
      dispatch(resetIsSuccess(false));
    }
  }, [isSuccess]);

  return (
    <>
      <div className="bot">
        <div className="assistant">
          <div className="assistantIcon">
            <img src={assistanIcon} alt="assistanIcon" />
          </div>
          <div className="assistantText">
            <h2>Assistant</h2>
            <p>
              Your personal assistant will automatically start farming and
              claiming rewards{" "}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={homeData?.user_mining_data?.is_auto_claim}
        >
          {homeData?.user_mining_data?.is_auto_claim ? "Active" : "Buy"}
        </button>
      </div>

      {showModal && (
        <BotFirstModal
          setShowModal={setShowModal}
          title={"Assistant"}
          description={
            "Your personal assistant will automatically start farming and claiming rewards"
          }
          data={data}
        />
      )}
    </>
  );
};
export default Bot;
