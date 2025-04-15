import { Routes, Route, HashRouter } from 'react-router-dom';
import { electronAPIType } from './preload';

declare global {
    interface Window {
        api: electronAPIType;
    }
}

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<div className='text-3xl'>asdasd</div>} />
            </Routes>
        </HashRouter>
    )
}

export default App