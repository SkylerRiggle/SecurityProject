import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import StandardPage from "./pages/Standard";
import RfidPage from "./pages/Rfid";
import SignaturePage from "./pages/Signature";

const BackButton = () => (
    <a href="/" className="text-white btn btn-cancel position-absolute top-0 m-2">
        Back
    </a>
);

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/standard" element={<><StandardPage /><BackButton /></>} />
            <Route path="/rfid" element={<><RfidPage /><BackButton /></>} />
            <Route path="/signature" element={<><SignaturePage /><BackButton /></>} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;