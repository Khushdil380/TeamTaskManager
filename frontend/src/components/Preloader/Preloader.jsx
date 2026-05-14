import { useState, useEffect } from "react";
import "./Preloader.css";

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show preloader for at least 2 seconds on first load or refresh
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Also hide when page is fully loaded
    const handleLoad = () => {
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    window.addEventListener("load", handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div className={`preloader ${!isVisible ? "hidden" : ""}`}>
      <svg
        className="pencil"
        viewBox="0 0 200 200"
        width="200px"
        height="200px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="pencil-eraser">
            <rect rx="5" ry="5" width="30" height="30"></rect>
          </clipPath>
        </defs>
        <circle
          className="pencil__stroke"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="439.82 439.82"
          strokeDashoffset="439.82"
          strokeLinecap="round"
          transform="rotate(-113,100,100)"
          style={{ stroke: "#FF6A33" }}
        />
        <g className="pencil__rotate" transform="translate(100,100)">
          <g fill="none">
            <circle
              className="pencil__body1"
              r="64"
              stroke="#FF6A33"
              strokeWidth="30"
              strokeDasharray="402.12 402.12"
              strokeDashoffset="402"
              transform="rotate(-90)"
            />
            <circle
              className="pencil__body2"
              r="74"
              stroke="#FF8B60"
              strokeWidth="10"
              strokeDasharray="464.96 464.96"
              strokeDashoffset="465"
              transform="rotate(-90)"
            />
            <circle
              className="pencil__body3"
              r="54"
              stroke="#E85A26"
              strokeWidth="10"
              strokeDasharray="339.29 339.29"
              strokeDashoffset="339"
              transform="rotate(-90)"
            />
          </g>
          <g className="pencil__eraser" transform="rotate(-90) translate(49,0)">
            <g className="pencil__eraser-skew">
              <rect fill="#FF8B60" rx="5" ry="5" width="30" height="30" />
              <rect fill="#E85A26" width="5" height="30" clipPath="url(#pencil-eraser)" />
              <rect fill="#F8FAFC" width="30" height="20" />
              <rect fill="#CBD5E1" width="15" height="20" />
              <rect fill="#E2E8F0" width="5" height="20" />
              <rect fill="rgba(255, 106, 51, 0.2)" y="6" width="30" height="2" />
              <rect fill="rgba(255, 106, 51, 0.2)" y="13" width="30" height="2" />
            </g>
          </g>
          <g className="pencil__point" transform="rotate(-90) translate(49,-30)">
            <polygon fill="#FFD700" points="15 0,30 30,0 30" />
            <polygon fill="#FFA500" points="15 0,6 30,0 30" />
            <polygon fill="#1F2937" points="15 0,20 10,10 10" />
          </g>
        </g>
      </svg>
      <p className="preloader__text">LOADING</p>
    </div>
  );
};

export default Preloader;
