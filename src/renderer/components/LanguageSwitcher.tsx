import React, { ChangeEvent, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Store from 'electron-store';

const STORE = new Store();

interface Option {
  value: string;
  label: string;
}

interface SelectElementProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectElement: React.FC<SelectElementProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="element">
      <div className="toggler">
        <p>{t(label)}</p>
        <label>
          <select className="main-select-0" value={value} onChange={onChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    (STORE.get('language') as string) || 'en'
  );

  useEffect(() => {
    const storedLanguage = STORE.get('language') as string;
    if (storedLanguage && storedLanguage !== i18n.language) {
      i18n.changeLanguage(storedLanguage);
      setSelectedLanguage(storedLanguage);
    }
  }, [i18n]);

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    STORE.set('language', newLanguage);
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const languageOptions: Option[] = [
    { value: 'en', label: 'English' },
    { value: 'hu', label: 'Hungarian' },
  ];

  return (
    <SelectElement
      label="Select Language"
      value={selectedLanguage}
      options={languageOptions}
      onChange={handleLanguageChange}
    />
  );
};

export default LanguageSwitcher;
