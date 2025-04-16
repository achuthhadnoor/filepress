import { app } from "electron";
import Store from "electron-store";

const store: any = new Store();

const defaultMetadata = {
  audio: {
    quality: "high",
    compressionLevel: 1,
    codec: "aac", // Added customization for audio codec
    sampleRate: 44100, // Added customization for sample rate
    bitRate: "128k", // Added customization for bit rate
  },
  video: {
    quality: "high",
    outputFormat: "mp4",
    compressionLevel: 1,
    codec: "h264", // Added customization for video codec
    frameRate: 30, // Added customization for frame rate
    resolution: "1920x1080", // Added customization for resolution
    removeAudio: false,
    preserveMetaData: true,
    overwriteExistingFile: false,
  },
  gif: {
    quality: "high",
    compressionLevel: 1,
    loop: true,
    frameRate: 15, // Added customization for GIF frame rate
    resolution: "800x600", // Added customization for GIF resolution
  },
  pdf: {
    compressionLevel: 1,
    preserveMetaData: true,
    imageQuality: "high", // Added customization for image quality in PDFs
    fontEmbedding: true, // Added customization for font embedding
    removeAnnotations: false, // Added customization for removing annotations
  },
  outputLocation: app.getPath("documents"),
  windowState: false, // 'pinned' || normal
  licenseKey: "",
  trialStartDate: "",
};

export type metadataType = typeof defaultMetadata;

export const getMetadata = () => {
  const metadata: metadataType =
    store.get("filepress-metadata") || defaultMetadata;
  return metadata;
};

export const updateMetadata = (metadata: metadataType) => {
  store.set("metadata", metadata);
  return metadata;
};
export default store;
