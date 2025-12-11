import Table from "/src/pages/Table/Table1.jsx";
import Home from "/src/pages/Home/Home.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import UploadedFiles from "/src/pages/Upload/UploadPage.jsx";

const route = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/table", element: <Table /> },
  { path: "/upload", element: <UploadedFiles /> },
]);

function App() {
  return (
    <RouterProvider router={route} />
  );
}

export default App;