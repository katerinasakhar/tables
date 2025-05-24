import Table from "./Table.jsx";
import Home from "./Home.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DownloadFiles from "./pages/DownloadFiles";

const route = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/table", element: <Table /> },
  { path: "/download", element: <DownloadFiles /> },
]);

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/table" element={<Table />} />
    //     <Route path="/download" element={<DownloadFiles />} />
    //   </Routes>
    // </Router>
    <RouterProvider router={route} />
  );
}

export default App;
