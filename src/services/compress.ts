// import { exec } from "child_process";
// import { promisify } from "util";
// import * as path from "path";
// import * as fs from "fs";

// const execAsync = promisify(exec);

// /**
//  * Handles file compression based on the selected settings
//  * @param {Object} settings - The compression settings from the sidebar
//  * @param {Object} fileInfo - Information about the file to compress
//  * @returns {Promise<string>} - Path to the compressed file
//  */
// export const handleCompress = async (settings, fileInfo) => {
//   const { filePath, fileName, fileType } = fileInfo;
//   const outputDir = path.join(process.env.USER_DATA_PATH, "compressed");

//   // Ensure output directory exists
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   // Determine if we're compressing a video or image
//   const isVideo = ["mp4", "mov", "avi", "mkv", "webm", "flv"].includes(
//     path.extname(fileName).toLowerCase().substring(1)
//   );

//   const outputPath = path.join(
//     outputDir,
//     `${path.basename(fileName, path.extname(fileName))}_compressed${
//       isVideo ? ".mp4" : `.${settings.imageSettings.format}`
//     }`
//   );

//   try {
//     if (isVideo) {
//       await compressVideo(filePath, outputPath, settings.videoSettings);
//     } else {
//       await compressImage(filePath, outputPath, settings.imageSettings);
//     }

//     return outputPath;
//   } catch (error) {
//     console.error("Compression error:", error);
//     throw new Error(`Failed to compress file: ${error.message}`);
//   }
// };

// /**
//  * Compresses a video file using FFmpeg
//  * @param {string} inputPath - Path to the input video
//  * @param {string} outputPath - Path for the output video
//  * @param {Object} settings - Video compression settings
//  * @returns {Promise<void>}
//  */
// const compressVideo = async (inputPath, outputPath, settings) => {
//   let command = "ffmpeg -y";

//   // Input file
//   command += ` -i "${inputPath}"`;

//   // Video codec
//   command += ` -c:v ${settings.codec}`;

//   // Quality (CRF)
//   command += ` -crf ${settings.crf}`;

//   // Preset
//   command += ` -preset ${settings.preset}`;

//   // Resolution (if not original)
//   if (settings.resolution !== "original" && settings.resolution !== "custom") {
//     const [width, height] = settings.resolution.split("x");
//     command += ` -vf scale=${width}:${height}`;
//   } else if (
//     settings.resolution === "custom" &&
//     settings.customWidth &&
//     settings.customHeight
//   ) {
//     command += ` -vf scale=${settings.customWidth}:${settings.customHeight}`;
//   }

//   // Frame rate (if not original)
//   if (settings.frameRate !== "original") {
//     command += ` -r ${settings.frameRate}`;
//   }

//   // Audio settings
//   command += ` -c:a aac -b:a ${settings.audioBitrate}k`;

//   // Two-pass encoding
//   if (settings.twoPass) {
//     // First pass
//     const firstPassCmd = `${command} -pass 1 -an -f null /dev/null`;
//     // For Windows, use NUL instead of /dev/null
//     const windowsSafeFirstPassCmd =
//       process.platform === "win32"
//         ? firstPassCmd.replace("/dev/null", "NUL")
//         : firstPassCmd;

//     await execAsync(windowsSafeFirstPassCmd);

//     // Second pass
//     command += ` -pass 2`;
//   }

//   // Output file
//   command += ` "${outputPath}"`;

//   // Execute command
//   const { stdout, stderr } = await execAsync(command);
//   console.log("FFmpeg stdout:", stdout);
//   console.log("FFmpeg stderr:", stderr);
// };

// /**
//  * Compresses an image file using FFmpeg
//  * @param {string} inputPath - Path to the input image
//  * @param {string} outputPath - Path for the output image
//  * @param {Object} settings - Image compression settings
//  * @returns {Promise<void>}
//  */
// const compressImage = async (inputPath, outputPath, settings) => {
//   let command = "ffmpeg -y";

//   // Input file
//   command += ` -i "${inputPath}"`;

//   // Resize (if not original)
//   if (settings.resize !== "original" && settings.resize !== "custom") {
//     const [width, height] = settings.resize.split("x");
//     command += ` -vf scale=${width}:${height}`;
//   } else if (
//     settings.resize === "custom" &&
//     settings.customWidth &&
//     settings.customHeight
//   ) {
//     command += ` -vf scale=${settings.customWidth}:${settings.customHeight}`;
//   }

//   // Format-specific settings
//   if (settings.format === "jpg" || settings.format === "jpeg") {
//     // Quality for JPEG (1-31, lower is better quality)
//     // Convert from percentage (1-100) to FFmpeg's scale (1-31)
//     const jpegQuality = Math.round(31 - (settings.quality / 100) * 30);
//     command += ` -q:v ${jpegQuality}`;
//   } else if (settings.format === "png") {
//     // Compression level for PNG (0-9)
//     command += ` -compression_level ${settings.compressionLevel}`;
//   } else if (settings.format === "webp") {
//     // Quality for WebP (0-100)
//     command += ` -quality ${settings.quality}`;
//   } else if (settings.format === "avif") {
//     // Quality for AVIF
//     const crf = Math.round(63 - (settings.quality / 100) * 63);
//     command += ` -c:v libaom-av1 -crf ${crf} -strict experimental`;
//   }

//   // Output file
//   command += ` "${outputPath}"`;

//   // Execute command
//   const { stdout, stderr } = await execAsync(command);
//   console.log("FFmpeg stdout:", stdout);
//   console.log("FFmpeg stderr:", stderr);
// };

// /**
//  * Integration with React component
//  * @param {Object} param0 - The settings from the compression sidebar
//  * @returns {Promise<void>}
//  */
// export const onCompress = async ({ videoSettings, imageSettings }) => {
//   try {
//     // Get file information (assuming you have this from your drag and drop component)
//     const selectedFiles = window.electronAPI.getSelectedFiles();

//     if (!selectedFiles || selectedFiles.length === 0) {
//       throw new Error("No files selected for compression");
//     }

//     // Show compression in progress
//     window.electronAPI.showProgress("Compressing files...");

//     // Process each file
//     const compressedFiles = [];

//     for (let i = 0; i < selectedFiles.length; i++) {
//       const file = selectedFiles[i];
//       window.electronAPI.updateProgress(
//         `Processing ${file.fileName} (${i + 1}/${selectedFiles.length})`,
//         (i / selectedFiles.length) * 100
//       );

//       const outputPath = await handleCompress(
//         { videoSettings, imageSettings },
//         file
//       );

//       compressedFiles.push(outputPath);
//     }

//     // Hide progress and show success
//     window.electronAPI.hideProgress();
//     window.electronAPI.showNotification(
//       "Compression complete",
//       `Successfully compressed ${compressedFiles.length} files`
//     );

//     // Open folder with compressed files
//     window.electronAPI.openFolder(path.dirname(compressedFiles[0]));

//     return compressedFiles;
//   } catch (error) {
//     window.electronAPI.hideProgress();
//     window.electronAPI.showError("Compression failed", error.message);
//     console.error("Compression error:", error);
//   }
// };

// export default onCompress;
