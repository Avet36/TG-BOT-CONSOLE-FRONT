import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { loginTelegramBotThunk } from "./Store/Middlewares/homePageData.js";
import { useTelegramBackButton } from "./utils/index.js";
import qrImg from "./Assets/qr.png";
// import { QRCode } from "antd";
// Lazy load components
// const Header = lazy(() => import("./Commons/Components/Header/Header"));
const Home = lazy(() => import("./Commons/Components/Home/Home"));
const NavBar = lazy(() => import("./Commons/Components/NavBar/NavBar"));
const Boost = lazy(() => import("./Commons/Components/Boost/Boost"));
const LogoAnimation = lazy(() =>
  import("./Commons/Components/LogoAnimation/LogoAnimation")
);
const Tasks = lazy(() => import("./Commons/Components/Tasks/Tasks"));
const AirDrop = lazy(() => import("./Commons/Components/AirDrop/AirDrop"));
const Profile = lazy(() => import("./Commons/Components/Profile/Profile"));
const Friends = lazy(() => import("./Commons/Components/Friends/Friends"));

function App() {
  const dispatch = useDispatch();
  const [showQRModal, setShowQRModal] = useState(false);
  const loading = useSelector((state) => state?.homePage?.loading);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      setShowQRModal(true); // 👈 Show QR modal instead of alert
      return;
    }
    const tg = window.Telegram?.WebApp;
    // if (tg) {
    //   // Initialize TON Connect SDK here
    // } else {
    //   console.warn(
    //     "TON Connect requires Telegram WebApp context. Skipping init."
    //   );
    // }

    if (!tg || !tg.initData || !tg.initDataUnsafe?.user) {
      // You can redirect or block here
      document.body.innerHTML = `
        <div style="text-align:center;padding:2rem;font-family:sans-serif">
          <h2>Access Denied 🚫</h2>
          <p>This app must be opened via <strong>Telegram</strong>.</p>
          <a href="https://t.me/Console_app_bot?start" target="_blank" rel="noopener noreferrer">
            👉 Open in Telegram
          </a>
        </div>
      `;
      return;
    }

    tg?.ready();
    tg?.expand();
    tg?.disableVerticalSwipes();

    // Handling user data from Telegram WebApp
    const userData = tg?.initDataUnsafe?.user || {
      id: "1802368420",
      first_name: "Phogos",
      last_name: "Poghosyanp",
      username: "Poghos_kkk",
      language_code: "en",
      photo_url:
        "https://t.me/i/userpic/320/R6kP81fplPdhuT-LUfFQPEUXqqKPrvaTLmqSgpUeMfc.jpg",
      hash: "a2ab797fbc1d209a618725edb826dc0736dee5d2a120bcdd7ae6b7d88415ab18"
    };
    // const fakeData =
    //   "user=%7B%22id%22%3A1077363526%2C%22first_name%22%3A%22%D5%8C%22%2C%22last_name%22%3A%22%D5%94%22%2C%22username%22%3A%22Robert12365489%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FMsR3NgkhIrC_Y_qODmaNb8p6UL9v8BHEAUmT9lsa_J0.svg%22%7D&chat_instance=-6691743215258862698&chat_type=sender&auth_date=1750700860&signature=WFAQHTyViLEQCOUeBdNBlYxkfojxxqXy86u_hjKL8uRoubiWo8b5GFh7FBm1odl13QALaKifrwDLwBznwHTgCA&hash=0494083e0f7fa1380ea0713477d4726c8a3c1633a36eea936b4dbbfcd3ec676f";
    const fakeData = "";
    if (userData) {
      dispatch(loginTelegramBotThunk(tg?.initData || fakeData));
    } else {
      console.warn(
        "⚠️ User or hash not available. Make sure it's opened via Telegram."
      );
    }
  }, []);

  useTelegramBackButton();
  // Show loading animation until homeData is available

  return (
    <div className="app">
      {showQRModal ? (
        <div className="qr-modal">
          <div className="qr-content">
            <h1>Console</h1>
            <h3>📱 Please open this bot on your smartphone</h3>
            <img src={qrImg} alt="qrImg" style={{ width: "300px" }} />
            {/* <QRCode
              value=""
              size={180}
              color="#FFF"
            /> */}
          </div>
        </div>
      ) : (
        <Suspense fallback={<LogoAnimation />}>
          {/* <Header /> */}
          <div className="main-scroll">
            {/* 👈 Scrollable wrapper */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:tab?" element={<Boost />} />
              <Route path="/boost" element={<Boost />} />
              <Route path="/tasks" element={<Tasks />} />
              {/* <Route path="/tasks/boost" element={<Boost />} /> */}{" "}
              <Route path="/airdrop" element={<AirDrop />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
            </Routes>
          </div>

          {!loading ? <NavBar /> : null}
          <ToastContainer autoClose={1500} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
