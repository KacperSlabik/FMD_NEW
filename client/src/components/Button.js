import React from 'react';

export const FacebookButton = React.forwardRef((props, ref) => {
  return (
    <a href={props.link} className="facebook-button" rel="noreferrer" target="_blank" ref={ref}>
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path
          d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"
          fill="currentColor"
        ></path>
      </svg>
      Facebook
    </a>
  );
});
