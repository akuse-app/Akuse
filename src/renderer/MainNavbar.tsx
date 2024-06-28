import './styles/MainNavbar.css';

import {
  faCompass,
  IconDefinition,
} from '@fortawesome/free-regular-svg-icons';
import {
  faCalendarWeek,
  faCompass as faCompassFull,
  faGear,
  faLaptopCode,
  faMagnifyingGlass,
  faMagnifyingGlassPlus,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ipcRenderer } from 'electron';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import isAppImage from '../modules/packaging/isAppImage';
import { AuthContext } from './App';
import AuthCodeModal from './components/modals/AuthCodeModal';
import UserModal from './components/modals/UserModal';

const Li: React.FC<{
  text: string;
  icon: IconDefinition;
  to: string;
  active: boolean;
  onClick: () => void;
}> = ({ text, icon, to, active, onClick }) => {
  return (
    <Link to={to} className={active ? 'active' : ''} onClick={onClick}>
      <li className={active ? 'active' : ''} data-title={text}>
        <div className="i-wrapper">
          <FontAwesomeIcon className="i" icon={icon} />
        </div>
        <span>{text}</span>
      </li>
    </Link>
  );
};

const LiLink: React.FC<{
  text: string;
  icon: IconDefinition;
  onClick: () => void;
}> = ({ text, icon, onClick }) => {
  return (
    <li data-title={text} onClick={onClick}>
      <div className="i-wrapper">
        <FontAwesomeIcon className="i" icon={icon} />
      </div>
      <span>{text}</span>
    </li>
  );
};

const MainNavbar: React.FC<{ avatar?: string }> = ({ avatar }) => {
  const logged = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState(1);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showAuthCodeModal, setShowAuthCodeModal] = useState<boolean>(false);
  const [isPackaged, setIsPackaged] = useState<boolean>(false);

  useEffect(() => {
    ipcRenderer.invoke('get-is-packaged').then((packaged) => {
      setIsPackaged(packaged);
    });
  }, []);

  return (
    <nav className="main">
      <ul>
        <Li
          text="Discover"
          icon={activeTab === 1 ? faCompassFull : faCompass}
          to="/"
          active={activeTab === 1}
          onClick={() => setActiveTab(1)}
        />
        <Li
          text="Search"
          icon={activeTab === 2 ? faMagnifyingGlassPlus : faMagnifyingGlass}
          to="/tab2"
          active={activeTab === 2}
          onClick={() => setActiveTab(2)}
        />
        <Li
          text="Settings"
          icon={faGear}
          to="/tab3"
          active={activeTab === 3}
          onClick={() => setActiveTab(3)}
        />
        <Li
          text="Schedule"
          icon={faCalendarWeek}
          to="/tab5"
          active={activeTab === 5}
          onClick={() => setActiveTab(5)}
        />
        {logged ? (
          <>
            <UserModal
              show={showUserModal}
              onClose={() => setShowUserModal(false)}
            />
            <div
              className="img-wrapper"
              onClick={() => {
                setShowUserModal(true);
              }}
            >
              <img src={avatar}></img>
            </div>
          </>
        ) : (
          <LiLink
            text="Log-In"
            icon={faRightToBracket}
            onClick={() => {
              ipcRenderer.send('open-login-url');
            }}
          />
        )}
        {(isAppImage || !isPackaged) && !logged && (
          <>
            <AuthCodeModal
              show={showAuthCodeModal}
              onClose={() => setShowAuthCodeModal(false)}
            />
            <LiLink
              text="Insert auth code"
              icon={faLaptopCode}
              onClick={() => setShowAuthCodeModal(true)}
            />
          </>
        )}
      </ul>
    </nav>
  );
};

export default MainNavbar;
