import React from 'react';
import styled from 'styled-components';

interface RadioGroup3DProps {
  value: "cart" | "address" | "payment";
  onChange: (val: "cart" | "address" | "payment") => void;
  disabledSteps?: {
    cart?: boolean;
    address?: boolean;
    payment?: boolean;
  };
}

export const RadioGroup3D = ({ value, onChange, disabledSteps = {} }: RadioGroup3DProps) => {
  return (
    <StyledWrapper>
      <div className="radio-input">
        {/* Glass cylinder container on the left */}
        <div className="glass">
          <div className="glass-inner" />
        </div>
        
        {/* Step triggers selector */}
        <div className="selector">
          
          {/* Choice 1: Cart Items */}
          <div className={`choice ${disabledSteps.cart ? "opacity-40 pointer-events-none" : ""}`}>
            <div>
              <input 
                className="choice-circle" 
                checked={value === "cart"} 
                onChange={() => !disabledSteps.cart && onChange("cart")} 
                name="number-selector" 
                id="one" 
                type="radio" 
                disabled={disabledSteps.cart}
              />
              <div className="ball" />
            </div>
            <label htmlFor="one" className="choice-name">1</label>
            <span className="choice-label">Cart Review</span>
          </div>

          {/* Choice 2: Delivery Details */}
          <div className={`choice ${disabledSteps.address ? "opacity-40 pointer-events-none" : ""}`}>
            <div>
              <input 
                className="choice-circle" 
                checked={value === "address"} 
                onChange={() => !disabledSteps.address && onChange("address")} 
                name="number-selector" 
                id="two" 
                type="radio" 
                disabled={disabledSteps.address}
              />
              <div className="ball" />
            </div>
            <label htmlFor="two" className="choice-name">2</label>
            <span className="choice-label">Address Entry</span>
          </div>

          {/* Choice 3: Secure Payment */}
          <div className={`choice ${disabledSteps.payment ? "opacity-40 pointer-events-none" : ""}`}>
            <div>
              <input 
                className="choice-circle" 
                checked={value === "payment"} 
                onChange={() => !disabledSteps.payment && onChange("payment")} 
                name="number-selector" 
                id="three" 
                type="radio" 
                disabled={disabledSteps.payment}
              />
              <div className="ball" />
            </div>
            <label htmlFor="three" className="choice-name">3</label>
            <span className="choice-label">Secure Pay</span>
          </div>

        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .radio-input {
    display: flex;
    height: 190px;
    align-items: center;
    position: relative;
    user-select: none;
  }

  .glass {
    z-index: 2;
    height: 110%;
    width: 95px;
    margin-right: 25px;
    padding: 8px;
    background-color: rgba(180, 150, 60, 0.15);
    border-radius: 35px;
    box-shadow: 
      inset 1px 1px 4px rgba(255, 255, 255, 0.2),
      inset -1px -1px 6px rgba(0, 0, 0, 0.3),
      0 12px 30px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .glass-inner {
    width: 100%;
    height: 100%;
    border-color: rgba(180, 148, 43, 0.3);
    border-width: 9px;
    border-style: solid;
    border-radius: 30px;
    background: linear-gradient(180deg, rgba(180,148,43,0.05) 0%, rgba(0,0,0,0.2) 100%);
  }

  .selector {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .choice {
    margin: 8px 0;
    display: flex;
    align-items: center;
    position: relative;
  }

  .choice > div {
    position: relative;
    width: 41px;
    height: 41px;
    margin-right: 15px;
    z-index: 0;
  }

  .choice-circle {
    appearance: none;
    height: 100%;
    width: 100%;
    border-radius: 100%;
    border-width: 8px;
    border-style: solid;
    border-color: rgba(220, 200, 150, 0.35);
    cursor: pointer;
    box-shadow: 0px 0px 20px -13px rgba(180, 148, 43, 0.5), 0px 0px 20px -14px rgba(0,0,0,0.8) inset;
    background-color: rgba(20, 20, 20, 0.3);
    transition: all 0.3s ease;
    outline: none;
  }

  .choice-circle:hover {
    border-color: rgba(180, 148, 43, 0.8);
    box-shadow: 0px 0px 12px rgba(180, 148, 43, 0.4);
  }

  .ball {
    z-index: 1;
    position: absolute;
    inset: 0px;
    transform: translateX(-120px);
    box-shadow: 
      rgba(0, 0, 0, 0.3) 0px -6px 6px 0px inset,
      rgba(255, 255, 255, 0.4) 0px 4px 6px 0px inset,
      rgba(180, 148, 43, 0.2) 0px -25px 20px 0px inset,
      0px 4px 12px rgba(0,0,0,0.4);
    border-radius: 100%;
    transition: transform 750ms cubic-bezier(0.34, 1.56, 0.64, 1);
    background: radial-gradient(circle at 35% 35%, #ffd700, #b4942b);
    pointer-events: none;
  }

  .choice-circle:checked + .ball {
    transform: translateX(0px);
    background: radial-gradient(circle at 35% 35%, #ffffff, #ffd700, #b4942b);
    box-shadow: 
      rgba(0, 0, 0, 0.4) 0px -4px 6px 0px inset,
      rgba(255, 255, 255, 0.6) 0px 2px 4px 0px inset,
      0 0 15px rgba(254, 240, 138, 0.6);
  }

  .choice-name {
    color: #a8a29e;
    font-size: 32px;
    font-weight: 900;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    cursor: pointer;
    transition: color 0.3s ease;
    width: 28px;
    display: inline-block;
  }

  .choice-circle:checked ~ .choice-name,
  input:checked + .ball + .choice-name {
    color: #eab308;
    text-shadow: 0 0 8px rgba(234, 179, 8, 0.3);
  }

  .choice-label {
    margin-left: 12px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #78716c;
    transition: color 0.3s ease;
  }

  .choice:hover .choice-label {
    color: #d6d3d1;
  }

  .choice-circle:checked ~ .choice-label {
    color: #f5f5f4;
  }
`;

export default RadioGroup3D;
