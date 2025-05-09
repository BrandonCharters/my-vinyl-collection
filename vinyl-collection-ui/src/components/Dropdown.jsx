import React from 'react';

const Dropdown = ({ id, label, options, value, onChange }) => (
  <div className="w-full mb-4">
    {label && (
      <label htmlFor={id} className="block text-vinyl-light/80 text-sm mb-1 font-semibold">{label}</label>
    )}
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded border border-vinyl-accent bg-vinyl-secondary text-vinyl-light focus:outline-none focus:ring-2 focus:ring-vinyl-accent shadow-sm appearance-none pr-10 transition-all duration-150"
        aria-label={label}
      >
        {options.map(option => (
          <option key={option.code} value={option.code}>{option.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-vinyl-accent text-lg font-bold">
        ▼
      </span>
    </div>
  </div>
);

export default Dropdown; 