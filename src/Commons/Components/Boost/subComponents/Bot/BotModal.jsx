import './Bot.css';
import modalCancelIcon from '../../../../../Assets/Home/cancel-assistant-icon.svg';
import assistanIcon from '../../../../../Assets/Home/assistant-icon.svg';
import botLogoIcon from '../../../../../Assets/bot/bot-logo-icon.svg';
import { formatLargeNumber } from './../../../../../utils/index';

const BotModal = ({ setShowModal, data }) => {
  return (
    <>
      <div className="botOverlay" onClick={() => setShowModal(false)}></div>
      <div className="botModal">
        <img
          src={modalCancelIcon}
          alt="modalCancelIcon"
          onClick={() => setShowModal(false)}
          className="cancelBotModal"
        />
        <div className="modalText">
          <div className="modalIconBlock">
            <img src={assistanIcon} alt={assistanIcon} />
          </div>
          <h2>Worked for you</h2>
        </div>

        <div className="botLogoPoint">
          <img src={botLogoIcon} alt={botLogoIcon} />
          <p>{formatLargeNumber(2525252525)}</p>
        </div>

        <button>Claim</button>
      </div>
    </>
  );
};
export default BotModal;
