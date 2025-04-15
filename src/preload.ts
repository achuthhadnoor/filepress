// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, webUtils } from "electron";
import { getFullPath } from "./utils";

const electronAPI = {
  preferences: {},
  app: {},
  handleOpenUrl: (callback: any) => ipcRenderer.on("open-url", callback),
};

contextBridge.exposeInMainWorld("api", electronAPI);

type electronAPIType = typeof electronAPI;
export { electronAPIType };
