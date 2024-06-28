import Store from 'electron-store';
import React, { ChangeEvent, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../App';
import Heading from '../components/Heading';
import LanguageSwitcher from '../components/LanguageSwitcher';

const STORE = new Store();

interface Option {
  value: string;
  label: string;
}

interface ElementProps {
  label: string;
  children: React.ReactNode;
}

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

interface CheckboxElementProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

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

interface SelectElementProps {
  label: string;
  value: number | string;
  options: Option[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

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

const Tab4: React.FC = () => {
  const { t } = useTranslation();
  const logged = useContext(AuthContext);

  const [updateProgress, setUpdateProgress] = useState<boolean>(
    (STORE.get('update_progress') as boolean) || false
  );
  const [watchDubbed, setWatchDubbed] = useState<boolean>(
    (STORE.get('dubbed') as boolean) || false
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    (STORE.get('source_flag') as string) || 'en'
  );
  const [skipTime, setSkipTime] = useState<number>(
    (STORE.get('intro_skip_time') as number) || 60
  );
  const [showDuration, setShowDuration] = useState<boolean>(
    (STORE.get('show_duration') as boolean) || false
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
    const value = parseInt(event.target.value);
    STORE.set('intro_skip_time', value);
    setSkipTime(value);
  };

  const handleShowDurationChange = () => {
    STORE.set('show_duration', !showDuration);
    setShowDuration(!showDuration);
  };

  const episodeLanguageOptions: Option[] = [
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
    <div className="body-container show-tab">
      <div className="main-container">
        <div className="settings-page">
          <Heading text={t('Settings')} />

          {logged && (
            <CheckboxElement
              label={t('Update progress automatically')}
              checked={updateProgress}
              onChange={handleUpdateProgressChange}
            />
          )}
          <CheckboxElement
            label={t('Watch dubbed')}
            checked={watchDubbed}
            onChange={handleWatchDubbedChange}
          />
          <SelectElement
            label={t('Select the language in which you want to watch the episodes')}
            value={selectedLanguage}
            options={episodeLanguageOptions}
            onChange={handleLanguageChange}
          />
          <SelectElement
            label={t('Select the duration of the intro skip (in seconds)')}
            value={skipTime}
            options={skipTimeOptions}
            onChange={handleSkipTimeChange}
          />
          <CheckboxElement
            label={t('Display the video duration instead of the remaining time.')}
            checked={showDuration}
            onChange={handleShowDurationChange}
          />
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Tab4;
