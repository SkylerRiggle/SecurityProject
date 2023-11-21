import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import StandardPage from "./pages/Standard";
import RfidPage from "./pages/Rfid";
import SignaturePage from "./pages/Signature";
import { Button } from "react-bootstrap";

const AppRouter = () => (<>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/standard" element={<StandardPage />} />
            <Route path="/rfid" element={<RfidPage />} />
            <Route path="/signature" element={<SignaturePage />} />
        </Routes>
    </BrowserRouter>

    <a href="/" className="text-white btn btn-cancel position-absolute top-0 m-2">
        Back
    </a>
</>);

export default AppRouter;