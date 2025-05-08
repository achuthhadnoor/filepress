// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, webUtils } from "electron";
import { getFullPath } from "./utils";

const electronAPI = {
  preferences: {},
  app: {
    compressVideo: (files: File[], settings: any) =>
      ipcRenderer.invoke("compress-video", { files, settings }),
  },
  windowActions: {
    pinWindow: () => ipcRenderer.invoke("pin-window"),
    minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
    closeWindow: () => ipcRenderer.invoke("close-window"),
  },
  handleOpenUrl: (callback: any) => ipcRenderer.on("open-url", callback),
};

contextBridge.exposeInMainWorld("api", electronAPI);

type electronAPIType = typeof electronAPI;
export { electronAPIType };
