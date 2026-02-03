import React from 'react';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onChange }) => {
  return (
    <div className="mb-6">
      <label className="text-primary-red text-lg font-bold mr-4 block mb-2">
        Select Language:
      </label>
      <select
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
        className="w-full md:w-auto px-6 py-3 text-base bg-primary-darkGray text-white border-2 border-primary-red rounded-lg cursor-pointer outline-none hover:bg-primary-lightGray transition-all duration-300"
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <option key={lang.value} value={lang.value}>
            {lang.icon} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;