import "./DownloadFiles.css";
import { NavLink } from "react-router-dom";

function DownloadFiles() {
  return (
    <div className="download-page__container">
      <NavLink to="/" className="download-page__button-back">
        <div className="back-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </div>
        <div>Назад</div>
      </NavLink>
      <label className="custom-fileinput">
        <input type="file" multiple className="custom-fileinput__input" />
        <span className="custom-fileinput__button">
          <div className="file-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <p>Выбрать файлы</p>
        </span>
      </label>
    </div>
  );
}

export default DownloadFiles;
