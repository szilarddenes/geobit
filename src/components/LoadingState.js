import React from 'react';

const LoadingState = ({ message = 'Loading...' }) => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-message">{message}</p>
            <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          padding: 2rem;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .loading-message {
          font-size: 1rem;
          color: #666;
        }
      `}</style>
        </div>
    );
};

export default LoadingState; 