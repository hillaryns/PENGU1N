import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OtpInput({ length = 6, value = '', onChange, disabled }) {
  const refs = useRef([]);

  const digits = String(value).padEnd(length, ' ').slice(0, length).split('');

  useEffect(() => {
    refs.current = refs.current.slice(0, length);
  }, [length]);

  const setChar = (index, char) => {
    const next = value.split('');
    next[index] = char;
    const joined = next.join('').replace(/\s/g, '').slice(0, length);
    onChange(joined);
  };

  const handleChange = (index, e) => {
    const v = e.target.value.replace(/\D/g, '').slice(-1);
    setChar(index, v || '');
    if (v && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="otp-input-row" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          className="otp-cell"
          value={value[i] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        />
      ))}
    </div>
  );
}
