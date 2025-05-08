import { cn } from '../../utils/cn';
import { Pin, Minus, X } from 'lucide-react';
import React, { useState } from 'react'

function TitleBar() {
    const [isWindows] = useState(true);
    const [pinWindow, setPinWindow] = useState(false);
    const handlePinWindow = () => {
        window.api.windowActions.pinWindow();
        setPinWindow(!pinWindow);
    }
    const handleMinimize = () => {
        window.api.windowActions.minimizeWindow();
    }
    const handleClose = () => {
        window.api.windowActions.closeWindow();
    }
    return (
        <div className="drag flex px-2 py-1 justify-end shadow items-center gap-2">
            <div className="flex-1 text-center">Filepress<span className='text-xs'> (6 days left)</span></div>
            <button className="p-2 rounded-md hover:bg-neutral-200 no-drag" onClick={handlePinWindow}>
                <Pin size={16} className={cn(!pinWindow ? "transform rotate-45" : "text-indigo-600")} />
            </button>
            {isWindows && (
                <>
                    <button className="p-2 rounded-md hover:bg-neutral-200 no-drag" onClick={handleMinimize}>
                        <Minus size={16} />
                    </button>
                    <button className="p-2 rounded-md hover:bg-neutral-200 no-drag" onClick={handleClose}>
                        <X size={16} />
                    </button>
                </>
            )}
        </div>
    )
}

export default TitleBar