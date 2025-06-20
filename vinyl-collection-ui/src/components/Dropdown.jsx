import React from 'react';

const Dropdown = ({ id, label, options, value, onChange }) => (
  <div className="form-control w-full mb-4">
    {label && (
      <label htmlFor={id} className="label">
        <span className="label-text text-secondary font-semibold">{label}</span>
      </label>
    )}
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="select select-bordered w-full bg-base-200 text-base-content"
        aria-label={label}
      >
        {options.map(option => (
          <option key={option.code} value={option.code}>{option.label}</option>
        ))}
      </select>
    </div>
  </div>
);

export default Dropdown; 