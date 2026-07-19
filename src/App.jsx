import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage/MovieDetailsPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/movie/:imdbID" element={<MovieDetailsPage />} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
