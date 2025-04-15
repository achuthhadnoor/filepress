import { Routes, Route, HashRouter } from "react-router-dom";
import { electronAPIType } from "./preload";
import { Button } from "./components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./components/ui/accordion";

declare global {
    interface Window {
        api: electronAPIType;
    }
}

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="">
                            <Button variant="destructive">Delete</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                            <div className="max-w-md mx-auto">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </HashRouter>
    );
}

export default App;
