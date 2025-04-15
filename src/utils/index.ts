import { webUtils } from "electron";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}
export function getFullPath(file: File) {
  return webUtils.getPathForFile(file);
}
