import React, { useState, useEffect } from 'react';

const TypingAnimation = () => {
  const texts = ['ॐ नमः शिवाय','राम राम','राधे राधे','ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ','प्रणिपात','नमस्ते','Hi', 'Hello'];
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    if (index === texts.length) {
      setIndex(0);
    }

    if (subIndex === texts[index].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), 1000);
    } else if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      setCurrentText(texts[index].substring(0, subIndex));
      setTypingSpeed(isDeleting ? 30 : 150);
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, texts, typingSpeed]);

  return (
    <div className='moving-container'>
      <p className='moving-text'>{currentText}</p>
    </div>
  );
};

export default TypingAnimation;
