import React, { useCallback, useState, useRef } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import {
    X,
    Pin,
    Minus,
    Trash,
    Plus,
    UploadCloud,
    FileVideo,
    FileImage,
    File,
} from "lucide-react/";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import Compressor from "../components/compressor";

function FilePress() {
    const [isWindows] = useState(false);
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [processingFile, setProcessingFile] = useState(null);
    const [processProgress, setProcessProgress] = useState(0);
    const fileInputRef = useRef(null);

    const onFilesSelected = (filterFiles: File[]) => { };
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
    const processFiles = useCallback(
        (fileList: File[]) => {
            const newFiles = Array.from(fileList).map((file: File) => ({
                id: `${file.name}-${Date.now()}`,
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                progress: 0,
                status: "ready", // ready, processing, completed, error
            }));

            // Filter for only video and image files
            const filteredFiles = newFiles.filter((file) => {
                const isVideo = file.type.startsWith("video/");
                const isImage = file.type.startsWith("image/");
                return isVideo || isImage;
            });

            setFiles((prev) => [...prev, ...filteredFiles]);

            // Pass the files to the parent component
            if (onFilesSelected) {
                onFilesSelected(filteredFiles.map((f) => f.file));
            }
        },
        [onFilesSelected]
    );

    // Handle drop event
    const handleDrop = useCallback(
        (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processFiles(e.dataTransfer.files);
            }
        },
        [processFiles]
    );

    // Handle file input change
    const handleFileSelect = useCallback(
        (e: any) => {
            if (e.target.files && e.target.files.length > 0) {
                processFiles(e.target.files);
                // Reset the input value to allow selecting the same file again
                e.target.value = "";
            }
        },
        [processFiles]
    );

    // Remove a file from the list
    const removeFile = useCallback((id: number) => {
        setFiles((prev) => prev.filter((file) => file.id !== id));
    }, []);

    // Clear all files
    const clearAllFiles = useCallback(() => {
        setFiles([]);
    }, []);

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Get file icon based on type
    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith("video/")) {
            return <FileVideo className="h-6 w-6 text-blue-500" />;
        } else if (fileType.startsWith("image/")) {
            return <FileImage className="h-6 w-6 text-green-500" />;
        } else {
            return <File className="h-6 w-6 text-gray-500" />;
        }
    };

    // Simulate process updating (for demo purposes)
    React.useEffect(() => {
        if (processingFile) {
            const interval = setInterval(() => {
                setProcessProgress((prev) => {
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
        <div className="flex flex-col h-screen">
            <div className="drag flex px-2 py-1 justify-end shadow items-center gap-2">
                <div className="flex-1 text-center">Filepress</div>
                <span className="p-2 rounded-md hover:bg-neutral-200 no-drag">
                    <Pin size={16} />
                </span>
                {isWindows && (
                    <>
                        <span className="p-2 rounded-md hover:bg-neutral-200 no-drag">
                            <Minus size={16} />
                        </span>
                        <span className="p-2 rounded-md hover:bg-neutral-200 no-drag">
                            <X size={16} />
                        </span>
                    </>
                )}
            </div>
            <div className="flex flex-1 h-full overflow-auto  p-1">
                <div className="p-1 h-full flex flex-1 flex-col px-2 overflow-auto select-none">
                    {files.length > 0 ? (
                        <div className="flex flex-col h-full ">
                            <div className="my-2 flex justify-between items-center gap-2">
                                <h2 className="text-lg font-medium">
                                    Selected Files {files.length > 0 && `(${files.length})`}
                                </h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={clearAllFiles}>
                                        <Trash className="h-4 w-4 mr-2" />
                                        Clear All
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add more
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
                            </div>
                            <div className="flex-1 flex flex-col  overflow-auto h-full">
                                <ScrollArea className="flex-1 overflow-auto h-full px-4">
                                    <div className="space-y-3">
                                        {files.map((file) => (
                                            <Card key={file.id} className="overflow-hidden py-2">
                                                <CardContent className="px-2 py-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            {getFileIcon(file.type)}
                                                            <div className="flex-1 min-w-0 space-y-2">
                                                                <p className="text-sm font-medium truncate">
                                                                    {file.name}
                                                                </p>
                                                                <div className="flex items-center space-x-2">
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatFileSize(file.size)}
                                                                    </p>
                                                                    <Badge
                                                                        variant={
                                                                            file.type.startsWith("video/")
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {file.type.startsWith("video/")
                                                                            ? "Video"
                                                                            : "Image"}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => removeFile(file.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    {file.status === "processing" && (
                                                        <Progress
                                                            value={file.progress}
                                                            className="h-1 mt-2"
                                                        />
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`flex-1 h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-2 transition-colors 
          ${isDragging
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <>
                                <UploadCloud className="h-16 w-16 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium mb-2">Drag & Drop Files</h3>
                                <p className="text-sm text-gray-500 mb-4 text-center">
                                    Drag and drop video or image files here, or click to select
                                    files
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
                        </div>
                    )}
                </div>
                <Compressor />
            </div>
        </div>
    );
}

export default FilePress;
