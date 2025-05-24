import Button from "./Buttons.jsx";
import { useState } from "react";
import "./Home.css";
import { NavLink } from "react-router-dom";

function Home() {
  const [files, setFiles] = useState([]);
  const allowedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).filter((file) =>
      allowedTypes.includes(file.type)
    );
    setFiles(selectedFiles);
  };

  return (
    <div className="App">
      <div className="home-buttons">
        <NavLink to={"/download"} className="no-underline-link">
          <div className="home-buttons__button">
            <div className="home-buttons__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </div>
            <p>Загрузить файлы</p>
          </div>
        </NavLink>

        <div className="home-buttons__button">
          <div className="home-buttons__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
          </div>
          <p>Получить данные</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
