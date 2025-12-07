import { useSelector } from "react-redux";

const TelegramUserCard = () => {
  const homeData = useSelector((state) => state?.homePage?.homeData);

  return (
    <div className="user-card">
      <img src={homeData?.photo_url} alt="avatar" />
      <h2>@{homeData?.username}</h2>
      <p>Total: {homeData?.total_balance} coins</p>
    </div>
  );
};

export default TelegramUserCard;
