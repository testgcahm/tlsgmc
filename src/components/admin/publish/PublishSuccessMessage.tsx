import React from 'react';

interface PublishSuccessMessageProps {
  message: string | null;
}

const PublishSuccessMessage: React.FC<PublishSuccessMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      background: '#4ade80',
      color: '#065f46',
      padding: '12px 32px',
      borderRadius: '8px',
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      fontSize: '1.1rem',
      minWidth: '220px',
      textAlign: 'center',
    }}>
      {message}
    </div>
  );
};

export default PublishSuccessMessage;
