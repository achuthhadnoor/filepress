import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { UploadCloud, File, FileVideo, FileImage, X, Trash } from 'lucide-react';

export const FileDropZone = ({ onFilesSelected }: any) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [processingFile, setProcessingFile] = useState(null);
    const [processProgress, setProcessProgress] = useState(0);
    const fileInputRef = useRef(null);


    // Handle drag events
    const handleDragEnter = useCallback((e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: any) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    // Process the dropped or selected files
    const processFiles = useCallback((fileList: File[]) => {
        const newFiles = Array.from(fileList).map((file: File) => ({
            id: `${file.name}-${Date.now()}`,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: 'ready' // ready, processing, completed, error
        }));

        // Filter for only video and image files
        const filteredFiles = newFiles.filter(file => {
            const isVideo = file.type.startsWith('video/');
            const isImage = file.type.startsWith('image/');
            return isVideo || isImage;
            return isVideo
        });

        setFiles(prev => [...prev, ...filteredFiles]);

        // Pass the files to the parent component
        if (onFilesSelected) {
            onFilesSelected(filteredFiles.map(f => f.file));
        }
    }, [onFilesSelected]);

    // Handle drop event
    const handleDrop = useCallback((e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    }, [processFiles]);

    // Handle file input change
    const handleFileSelect = useCallback((e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
            // Reset the input value to allow selecting the same file again
            e.target.value = '';
        }
    }, [processFiles]);

    // Remove a file from the list
    const removeFile = useCallback((id: number) => {
        setFiles(prev => prev.filter(file => file.id !== id));
    }, []);

    // Clear all files
    const clearAllFiles = useCallback(() => {
        setFiles([]);
    }, []);

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Get file icon based on type
    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('video/')) {
            return <FileVideo className="h-6 w-6 text-blue-500" />;
        } else if (fileType.startsWith('image/')) {
            return <FileImage className="h-6 w-6 text-green-500" />;
        } else {
            return <File className="h-6 w-6 text-gray-500" />;
        }
    };

    // Simulate process updating (for demo purposes)
    React.useEffect(() => {
        if (processingFile) {
            const interval = setInterval(() => {
                setProcessProgress(prev => {
                    if (prev >= 100) {
                        setProcessingFile(null);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev + 5;
                });
            }, 200);

            return () => clearInterval(interval);
        }
    }, [processingFile]);

    return (
        <div className="h-full flex flex-1 flex-col px-2  select-none">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-center flex flex-1"></h2>
                {files.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearAllFiles}>
                        <Trash className="h-4 w-4 mr-2" />
                        Clear All
                    </Button>
                )}
            </div>

            {/* Drop zone */}
            <div
                className={`flex-1 h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 mb-4 transition-colors 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {files.length === 0 ? (
                    <>
                        <UploadCloud className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Drag & Drop Files</h3>
                        <p className="text-sm text-gray-500 mb-4 text-center">
                            Drag and drop video or image files here, or click to select files
                        </p>
                        <Button onClick={() => fileInputRef.current.click()}>
                            Select Files
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="video/*,image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium">Selected Files {files.length > 0 && `(${files.length})`}</h3>
                            <Button size="sm" onClick={() => fileInputRef.current.click()}>
                                Add More
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="video/*,image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>
                        <ScrollArea className="flex-1 overflow-auto h-full px-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {files.map(file => (
                                    <div key={file.id} className="overflow-hidden py-0">
                                        <CardContent className="">
                                            <div className="mt-3">
                                                {file.type.startsWith('image/') && (
                                                    <img
                                                        src={file.preview || URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="w-full h-auto max-h-64 object-contain rounded"
                                                    />
                                                )}
                                                {file.type.startsWith('video/') && (
                                                    <video
                                                        src={file.preview || URL.createObjectURL(file)}
                                                        controls
                                                        className="w-full h-auto max-h-64 rounded"
                                                    />
                                                )}
                                                {file.type === 'application/pdf' && (
                                                    <embed
                                                        src={file.preview || URL.createObjectURL(file)}
                                                        type="application/pdf"
                                                        className="w-full h-64 rounded"
                                                    />
                                                )}
                                            </div>

                                            {file.status === 'processing' && (
                                                <Progress value={file.progress} className="h-1 mt-2" />
                                            )}
                                        </CardContent>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}
                zsdds
            </div>

            {/* Processing status */}
            {processingFile && (
                <div className="mt-auto">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">Processing {processingFile}</p>
                        <span className="text-xs text-gray-500">{processProgress}%</span>
                    </div>
                    <Progress value={processProgress} className="h-2" />
                </div>
            )}
        </div>
    );
};

export default FileDropZone;