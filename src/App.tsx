import { Routes, Route, HashRouter } from "react-router-dom";
import { electronAPIType } from "./preload";
import FilePress from "./screens/FilePress";

declare global {
    interface Window {
        api: electronAPIType;
    }
}

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<FilePress />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
