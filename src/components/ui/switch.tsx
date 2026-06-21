import React from 'react';
import styled from 'styled-components';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Switch = ({ checked, onChange }: SwitchProps) => {
  return (
    <StyledWrapper>
      <div className="flex items-center">
        <input 
          id="check" 
          type="checkbox" 
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <label className="switch" htmlFor="check">
          <svg viewBox="0 0 212.4992 84.4688" overflow="visible">
            <path 
              pathLength={360} 
              fill="none" 
              stroke="currentColor" 
              d="M 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 A 42.24 42.24 90 0 0 84.4992 42.2496 A 42.24 42.24 90 0 0 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 L 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 A 42.24 42.24 90 0 0 128 42.2496 A 42.24 42.24 90 0 0 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 L 42.2496 0" 
            />
          </svg>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* The switch - the box around the slider */
  .switch {
    --a: 0.4s ease-out;
    cursor: pointer;
    position: relative;
    display: inline-flex;
    height: 1.45rem;
    border-radius: 2rem;
    box-shadow: 0 0 0 0.2rem rgba(115, 115, 115, 0.15); /* Neutral custom Apple-like shadow */
    aspect-ratio: 212.4992/84.4688;
    background-color: #cbd5e1; /* slate-300 off state */
    transition: background-color var(--a);
    align-items: center;
    justify-content: center;
  }

  /* Controlled input hiding */
  input:checked + .switch {
    background-color: #10b981; /* emerald-500 verified success state */
    box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.2);
  }

  /* Hide default HTML checkbox */
  #check {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    pointer-events: none;
  }

  .switch svg {
    height: 100%;
    width: auto;
  }

  .switch svg path {
    color: #ffffff;
    stroke-width: 17;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 136 224;
    transition:
      all var(--a),
      0s transform;
    transform-origin: center;
  }

  input:checked + .switch svg path {
    stroke-dashoffset: 180;
    transform: scaleY(-1);
  }
`;

export default Switch;
