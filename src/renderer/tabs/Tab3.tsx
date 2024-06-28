import Store from 'electron-store';
import { ContentSteeringController } from 'hls.js';
import React, { ChangeEvent, useContext, useState } from 'react';
import { AuthContext } from '../App';
import Heading from '../components/Heading';

const STORE = new Store();

// Interfaccia per definire la struttura delle opzioni del select
interface Option {
  value: string;
  label: string;
}

// Props per il componente Element
interface ElementProps {
  label: string;
  children: React.ReactNode;
}

// Componente generico per gli elementi
const Element: React.FC<ElementProps> = ({ label, children }) => {
  return (
    <div className="element">
      <div className="toggler">
        <p>{label}</p>
        {children}
      </div>
    </div>
  );
};

// Props per il componente CheckboxElement
interface CheckboxElementProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

// Componente per gestire gli elementi con i checkbox
const CheckboxElement: React.FC<CheckboxElementProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <Element label={label}>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider round"></span>
      </label>
    </Element>
  );
};

// Props per il componente SelectElement
interface SelectElementProps {
  label: string;
  value: number | string;
  options: Option[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

// Componente per gestire gli elementi con i select
const SelectElement: React.FC<SelectElementProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <Element label={label}>
      <label>
        <select className="main-select-0" value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </Element>
  );
};
const Tab3: React.FC = () => {
  const logged = useContext(AuthContext);

  const [updateProgress, setUpdateProgress] = useState<boolean>(
    STORE.get('update_progress') as boolean,
  );
  const [watchDubbed, setWatchDubbed] = useState<boolean>(
    STORE.get('dubbed') as boolean,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    STORE.get('source_flag') as string,
  );
  const [skipTime, setSkipTime] = useState<number>(
    STORE.get('intro_skip_time') as number,
  );
  const [showDuration, setShowDuration] = useState<boolean>(
    STORE.get('show_duration') as boolean,
  );

  const handleUpdateProgressChange = () => {
    STORE.set('update_progress', !updateProgress);
    setUpdateProgress(!updateProgress);
  };

  const handleWatchDubbedChange = () => {
    STORE.set('dubbed', !watchDubbed);
    setWatchDubbed(!watchDubbed);
  };

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    STORE.set('source_flag', event.target.value);
    setSelectedLanguage(event.target.value);
  };

  const handleSkipTimeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    STORE.set('intro_skip_time', parseInt(event.target.value));
    setSkipTime(parseInt(event.target.value));
  };

  const handleShowDurationChange = () => {
    STORE.set('dubbed', !showDuration);
    setShowDuration(!showDuration);
  };

  const languageOptions: Option[] = [
    { value: 'US', label: 'English' },
    { value: 'IT', label: 'Italian' },
  ];

  const skipTimeOptions: Option[] = [
    { value: '60', label: '60' },
    { value: '65', label: '65' },
    { value: '70', label: '70' },
    { value: '75', label: '75' },
    { value: '80', label: '80' },
    { value: '85', label: '85' },
    { value: '90', label: '90' },
    { value: '95', label: '95' },
  ];

  return (
    <div className="body-container  show-tab">
      <div className="main-container">
        <div className="settings-page">
        <Heading text='Settings' />

          {logged && (
            <CheckboxElement
              label="Update progress automatically"
              checked={updateProgress}
              onChange={handleUpdateProgressChange}
            />
          )}
          <CheckboxElement
            label="Watch dubbed"
            checked={watchDubbed}
            onChange={handleWatchDubbedChange}
          />
          <SelectElement
            label="Select the language in which you want to watch the episodes"
            value={selectedLanguage}
            options={languageOptions}
            onChange={handleLanguageChange}
          />
          <SelectElement
            label="Select the duration of the intro skip (in seconds)"
            value={skipTime}
            options={skipTimeOptions}
            onChange={handleSkipTimeChange}
          />
          <CheckboxElement
            label="Display the video duration instead of the remaining time."
            checked={showDuration}
            onChange={handleShowDurationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Tab3;
