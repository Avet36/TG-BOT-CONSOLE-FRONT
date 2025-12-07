import "./Tasks.css";
import fon from "../../../Assets/fon.png";
import { useEffect, useState } from "react";
import New from "./New/New";
import Completed from "./Completed/Completed";
import { useDispatch, useSelector } from "react-redux";
import { getHomePageDataThunk } from "../../../Store/Middlewares/homePageData";
import { getTaskDataThunk } from "../../../Store/Middlewares/taskDataMidlware";

const Tasks = () => {
  const [page, setPage] = useState("new");
  const token = useSelector((state) => state?.telegramLogin?.token);
  const isSuccess = useSelector((state) => state?.telegramLogin?.isSuccess);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getTaskDataThunk(token));
    }
  }, [isSuccess]);
  return (
    <>
      <img src={fon} alt="fon" className="fon" />
      <div className="task">
        <h2>Tasks</h2>

        <nav>
          <ul>
            <li
              className={page === "new" ? "activePage" : ""}
              onClick={() => setPage("new")}
            >
              New
            </li>
            <li
              className={page === "completed" ? "activePage" : ""}
              onClick={() => setPage("completed")}
            >
              Completed
            </li>
          </ul>
        </nav>

        {page === "new" && <New />}
        {page === "completed" && <Completed />}
      </div>
    </>
  );
};
export default Tasks;
