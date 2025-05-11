import React from 'react';
import './Button.css';

const Button = ({ onClick, children, disabled }) => {
    return (
        <button 
            className="custom-button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button; 