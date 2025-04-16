import { app, BrowserWindow } from "electron";
import "./windows/load";
import windowManager from "./windows/windowManager";
/*
  - license check and show license with trail
    - 7 days trail with device hostname sent to the backend to verify
    - enable ffmpeg service 
    - launch tray to help users drop files and also quit the app if any issue happens // update the tray context menu in case of any issue across the app.
    - launch license window if license expires or launch the app window if everything is fine 
*/

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  windowManager.main.open();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    // open default window
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
