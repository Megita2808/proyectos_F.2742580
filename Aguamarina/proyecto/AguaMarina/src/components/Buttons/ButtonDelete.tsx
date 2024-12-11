import React from 'react';

const Button: React.FC<{onClick : any}> = ({onClick}) => {
  return (
    <>
      <style>
        {`
          .button-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .btn {
            cursor: pointer;
            width: 50px;
            height: 50px;
            border: none;
            position: relative;
            border-radius: 10px;
            box-shadow: 1px 1px 5px 0.2px #00000035;
            transition: width 0.2s linear, transform 0.2s linear;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .btn:hover {
            width: 150px;
            transition-delay: 0.2s;
          }

          .btn:hover .paragraph {
            visibility: visible;
            opacity: 1;
            transition-delay: 0.4s;
          }

          .btn:hover .icon-wrapper .icon {
            transform: scale(1.1);
          }

          .btn:hover .icon-wrapper .icon path {
            stroke: black;
          }

          .paragraph {
            color: black;
            visibility: hidden;
            opacity: 0;
            font-size: 18px;
            margin-right: 20px;
            padding-left: 20px;
            transition: opacity 0.2s linear, visibility 0.2s linear;
            font-weight: bold;
            text-transform: uppercase;
          }

          .icon-wrapper {
            width: 50px;
            height: 50px;
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .icon {
            transform: scale(0.9);
            transition: transform 0.2s linear;
          }

          .icon path {
            stroke: #000;
            stroke-width: 2px;
            transition: stroke 0.2s linear;
          }

        `}
      </style>
      <div className="button-wrapper">
        <button className="btn" onClick={onClick}>
          <p className="paragraph dark:text-dark-8">Anular</p>
          <span className="icon-wrapper text-dark dark:text-dark-8">
            <svg
              className="icon"
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
                stroke="#000000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </>
  );
};

export default Button;
