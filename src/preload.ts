// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, webUtils } from "electron";

const electronAPI = {
  preferences: {},
  app: {
    minimize: () => ipcRenderer.invoke("minimize-window"),
    close: () => ipcRenderer.invoke("close-window"),
  },
  handleOpenUrl: (callback: any) => ipcRenderer.on("open-url", callback),
};

contextBridge.exposeInMainWorld("api", electronAPI);

type electronAPIType = typeof electronAPI;
export { electronAPIType };
