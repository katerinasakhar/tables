import Table from "/src/pages/Table/Table.jsx";
import Home from "/src/pages/Home/Home.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DownloadFiles from "/src/pages/Upload/DownloadFiles";
import UploadedFiles from "/src/pages/Upload/UploadPage.jsx";

const route = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/table", element: <Table /> },
  { path: "/download", element: <DownloadFiles /> },
  { path: "/upload", element: <UploadedFiles /> },
]);

function App() {
  return (
    <RouterProvider router={route} />
  );
}

export default App;