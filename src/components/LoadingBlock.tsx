import React from 'react';

const LoadingBlock: React.FC = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <span>Cargando...</span>
    </div>
  );
};

export default LoadingBlock;
