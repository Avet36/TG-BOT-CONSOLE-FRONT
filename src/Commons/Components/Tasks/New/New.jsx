import "./New.css";

import instagramIcon from "../../../../Assets/Tasks/task-instagram.svg";
import telegramIcon from "../../../../Assets/Tasks/task-telegram.svg";
import tiktokIcon from "../../../../Assets/Tasks/task-tiktok.svg";
import twiterIcon from "../../../../Assets/Tasks/task-twitter.png";
import youtubeIcon from "../../../../Assets/Tasks/task-youtube.svg";
import consoleIcon from "../../../../Assets/Tasks/task-console.svg";
import { Button } from "antd";
import { useState } from "react";
import { dotSpinner } from "ldrs";
import { useDispatch, useSelector } from "react-redux";
import { startTask } from "../../../Services/taskService";
import { toast } from "react-toastify";
import {
  setUpdateSingleTask,
  updateStartTask,
} from "../../../../Store/Slices/taskSlice";
import TaskSuccess from "./TaskSuccess/TaskSuccess";
import { formatLargeNumber } from "./../../../../utils/index";
import LogoAnimation from "../../LogoAnimation/LogoAnimation";
dotSpinner.register();

const New = () => {
  const [loading, setLoading] = useState(null);
  const tasksData = useSelector((state) => state.tasks.taskData);
  const token = useSelector((state) => state?.telegramLogin?.token);
  const [isOpen, setIsOpen] = useState(false);
  const [itemData, setItemData] = useState(null);

  const dispatch = useDispatch();

  const handleClick = (item) => {
    if (item && item.link && item.status === "start") {
      let inTelegram = !!window.Telegram?.WebApp;
      let newWindow;

      setLoading(item?.id);

      const data = {
        id: item?.id,
        status: item?.status,
        token: token,
      };

      if (inTelegram) {
        // In Telegram: open link and immediately start the task
        window.Telegram.WebApp.openLink(item.link);
        startTask(data)
          .then((res) => {
            dispatch(updateStartTask(res));
            setLoading(null);
          })
          .catch((err) => {
            console.log(err);
            setLoading(null);
          });
      } else {
        // In browser: open link and wait for user to come back
        newWindow = window.open(item.link);

        if (!newWindow) return;

        const handleFocus = async () => {
          window.removeEventListener("focus", handleFocus);

          try {
            const res = await startTask(data);
            dispatch(updateStartTask(res));
            setLoading(null);
          } catch (err) {
            console.log(err);
            setLoading(null);
          }
        };

        window.addEventListener("focus", handleFocus);
      }
    } else if (item?.status === "check") {
      setItemData(item);
      setLoading(item?.id);

      const data = {
        id: item?.id,
        status: item?.status,
        token: token,
      };
      startTask(data)
        .then((res) => {
          if (!res || res?.status === "check") {
            dispatch(setUpdateSingleTask({ id: item.id }));
          } else {
            dispatch(updateStartTask(res));
          }
          setLoading(null);
        })
        .catch((err) => {
          if (
            err?.response?.status === 400 &&
            err?.response?.data?.msg === "You not completed task."
          ) {
            dispatch(setUpdateSingleTask({ id: item.id }));
          }
          setLoading(null);
        });
    } else if (item?.status === "claim") {
      setItemData(item);
      setIsOpen(true);
      setLoading(item?.id);

      const data = {
        id: item?.id,
        status: item?.status,
        token: token,
      };

      startTask(data)
        .then((res) => {
          dispatch(updateStartTask(res));
          setLoading(null);
        })
        .catch((err) => {
          console.log(err);
          setLoading(null);
        });
    }
  };

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
    <>
      {!tasksData ? (
        <LogoAnimation />
      ) : (
        <div className="new">
          <div className="newContent">
            {Array.isArray(tasksData?.new) && tasksData?.new.length > 0 ? (
              tasksData?.new.map((item) => (
                <div className="newItem" key={item?.id}>
                  <img
                    src={handleIcon(item?.social_type)}
                    alt={item?.social_type}
                  />

                  <div className="newText">
                    <h2>{item?.name}</h2>
                    {item?.description && <p>{item?.description}</p>}
                    <p>$CP {formatLargeNumber(+item?.amount)}</p>
                  </div>
                  <Button
                    size="small"
                    // loading={loading}
                    icon={
                      loading === item.id ? (
                        <l-dot-spinner size="20" speed="0.9" color="black" />
                      ) : null
                    }
                    // disabled={loading ? true : false}
                    onClick={() => handleClick(item)}
                  >
                    {loading === item.id ? "" : item?.status}
                  </Button>
                </div>
              ))
            ) : (
              <h2>All tasks completed – more tasks coming soon!</h2>
            )}
            {isOpen && <TaskSuccess data={itemData} setIsOpen={setIsOpen} />}
          </div>
        </div>
      )}
    </>
  );
};
export default New;
