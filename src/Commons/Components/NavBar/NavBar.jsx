import "./NavBar.css";
import airDropIcon from "../../../Assets/NavBar/airdrop-icon.svg";
import friendsIcon from "../../../Assets/NavBar/friends-icon.svg";
import homeIcon from "../../../Assets/NavBar/home-icon.svg";
import profileIcon from "../../../Assets/NavBar/profile-icon.svg";
import tasksIcon from "../../../Assets/NavBar/tasks-icon.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeyboardVisible } from "../../../utils";
import { useSelector } from "react-redux";
import LogoAnimation from "./../LogoAnimation/LogoAnimation";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const homeData = useSelector((state) => state?.homePage?.homeData);
  const referalsData = useSelector((state) => state?.refferals?.referalsData);
  const tasksData = useSelector((state) => state.tasks.taskData);

  const changeRoute = (path) => {
    switch (path) {
      case "": {
        navigate("/");
        break;
      }
      case "tasks": {
        navigate("/tasks");
        break;
      }
      case "friends": {
        navigate("/friends");
        break;
      }
      case "airdrop": {
        navigate("/airdrop");
        break;
      }
      case "profile": {
        navigate("/profile");
        break;
      }
      default: {
        navigate("/");
      }
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(`/${path}`);
  };

  const keyboardVisible = useKeyboardVisible();
  if (keyboardVisible) return null;

  return (
    <>
      <div className="navBar">
        <div
          onClick={() => changeRoute("")}
          className={isActive("/") ? "active" : ""}
        >
          <img src={homeIcon} alt="homeIcon" />
          <p>Home</p>
        </div>

        <div
          onClick={() => changeRoute("tasks")}
          className={isActive("tasks") ? "active" : ""}
        >
          {homeData?.is_new_task && !tasksData && (
            <div className="taskCircle"></div>
          )}
          <img src={tasksIcon} alt="tasksIcon" />
          <p>Tasks</p>
        </div>
        <div
          onClick={() => changeRoute("friends")}
          className={isActive("friends") ? "active" : ""}
        >
          {homeData?.is_new_referee && !referalsData && (
            <div className="friendsCircle"></div>
          )}
          <img src={friendsIcon} alt="friendsIcon" />
          <p>Friends</p>
        </div>
        <div
          onClick={() => changeRoute("airdrop")}
          className={isActive("airdrop") ? "active" : ""}
        >
          <img src={airDropIcon} alt="airDropIcon" />
          <p>Airdrop</p>
        </div>
        <div
          onClick={() => changeRoute("profile")}
          className={isActive("profile") ? "active" : ""}
        >
          <img src={profileIcon} alt="profileIcon" />
          <p>Profile</p>
        </div>
      </div>
    </>
  );
};
export default NavBar;
