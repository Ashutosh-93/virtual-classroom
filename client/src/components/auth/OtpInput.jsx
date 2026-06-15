import React, { useRef, useEffect } from 'react';

export function OtpInput({ value, onChange, disabled }) {
  const inputRefs = useRef([]);

  // Split the single string value from parent into an array of 6 digits
  const otpArray = value.split('').concat(new Array(6).fill('')).slice(0, 6);

  useEffect(() => {
    // Auto-focus the first empty box when the component mounts
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, ''); // Enforce numbers only
    if (!val) return;

    const newOtpArray = [...otpArray];
    newOtpArray[index] = val.substring(val.length - 1); // Take the last character typed
    
    const combinedValue = newOtpArray.join('');
    onChange(combinedValue);

    // Auto-focus forward to the next box if it exists
    if (index < 5 && element.value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtpArray = [...otpArray];
      
      // If current box has data, clear it. If it's already empty, clear the previous box.
      if (otpArray[index]) {
        newOtpArray[index] = '';
      } else if (index > 0) {
        newOtpArray[index - 1] = '';
        inputRefs.current[index - 1].focus();
      }

      onChange(newOtpArray.join(''));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Ensure it's exactly a 6-digit number
    if (!/^\d{6}$/.test(pastedData)) return;

    onChange(pastedData);
    inputRefs.current[5].focus(); // Focus the final box after pasting
  };

  return (
    <div className="flex gap-2" onPaste={handlePaste}>
      {otpArray.map((digit, i) => (
        <input
          key={i}
          type="text"
          maxLength="1"
          value={digit}
          disabled={disabled}
          ref={(el) => (inputRefs.current[i] = el)}
          onChange={(e) => handleChange(e.target, i)}
          onKeyDown={(e) => handleKeyDown(e.target, i)}
          className="w-12 h-12 bg-white text-center text-lg font-mono font-semibold text-[#171717] border border-[#ebebeb] rounded-sm focus:outline-none focus:border-[#a1a1a1] disabled:bg-[#fafafa] disabled:text-[#888888] transition-colors"
        />
      ))}
    </div>
  );
}