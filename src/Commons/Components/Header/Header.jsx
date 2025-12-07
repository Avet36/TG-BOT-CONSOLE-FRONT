import "./Header.css";

// import arrowBottom from "../../../Assets/Header/arrow-icon.svg";
import smallLogo from "../../../Assets/Header/small-logo.svg";

const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <img src={smallLogo} alt="smallLogo" />
      </div>
      <div className="arrow">
        {/* <img src={arrowBottom} alt="arrowBottom" /> */}
      </div>
    </div>
  );
};
export default Header;
