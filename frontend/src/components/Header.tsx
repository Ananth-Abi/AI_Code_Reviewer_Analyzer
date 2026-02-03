import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-black via-primary-darkGray to-black border-b-4 border-primary-red py-8 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-red mb-3 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
          🔍 AI Code Reviewer
        </h1>
        <p className="text-gray-300 text-lg md:text-xl">
          Analyze your code with AI-powered insights
        </p>
      </div>
    </header>
  );
};

export default Header;