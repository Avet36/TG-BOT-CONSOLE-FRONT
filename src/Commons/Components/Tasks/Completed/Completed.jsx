import "./Completed.css";
import instagramIcon from "../../../../Assets/Tasks/task-instagram.svg";
import telegramIcon from "../../../../Assets/Tasks/task-telegram.svg";
import tiktokIcon from "../../../../Assets/Tasks/task-tiktok.svg";
import twiterIcon from "../../../../Assets/Tasks/task-twitter.png";
import youtubeIcon from "../../../../Assets/Tasks/task-youtube.svg";
import completedSuccess from "../../../../Assets/Tasks/completed-success.svg";
import consoleIcon from "../../../../Assets/Tasks/task-console.svg";

import { useSelector } from "react-redux";
import { formatLargeNumber } from "./../../../../utils/index";

const Completed = () => {
  const tasksData = useSelector((state) => state.tasks.taskData);

  const handleIcon = (socialType) => {
    switch (socialType) {
      case "instagram":
        return instagramIcon;
      case "telegram":
        return telegramIcon;
      case "tiktok":
        return tiktokIcon;
      case "twitter":
        return twiterIcon;
      case "youtube":
        return youtubeIcon;
      case "console":
        return consoleIcon;
      default:
        return null;
    }
  };
  return (
    <div className="completed">
      <div className="completedContent">
        {Array.isArray(tasksData?.completed) &&
          tasksData?.completed.map((item) => (
            <div className="completedItem" key={item.id}>
              <img
                src={handleIcon(item?.social_type)}
                alt={item?.social_type}
              />
              <div className="completedText">
                <h2>{item?.name}</h2>
                {item?.description && <p>{item?.description}</p>}
                <p>
                  $CP {item?.amount ? formatLargeNumber(+item?.amount) : ""}
                </p>
              </div>

              <button>
                <img src={completedSuccess} alt="completedSuccess" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Completed;
