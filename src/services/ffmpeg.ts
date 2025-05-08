// services/ffmpeg.ts
import { spawn } from "child_process";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import { ipcMain } from "electron";

const ffmpegPath = ffmpegInstaller.path;

type VideoSettings = {
  codec: string;
  crf: number;
  preset: string;
  resolution: string;
  audioBitrate: string;
  frameRate: string;
  removeAudio: boolean;
};

type ImageSettings = {
  format: string;
  quality: number;
  resize: string;
  compressionLevel?: number;
};

function buildVideoArgs(
  input: string,
  output: string,
  s: VideoSettings
): string[] {
  const args = ["-y", "-i", input];

  if (s.removeAudio) args.push("-an");
  args.push("-c:v", s.codec);
  args.push("-preset", s.preset);
  args.push("-crf", s.crf.toString());

  if (s.resolution !== "original") {
    args.push("-vf", `scale=${s.resolution.replace("x", ":")}`);
  }

  if (s.audioBitrate) args.push("-b:a", `${s.audioBitrate}k`);
  if (s.frameRate !== "original") args.push("-r", s.frameRate);

  args.push(output);
  return args;
}

function buildImageArgs(
  input: string,
  output: string,
  s: ImageSettings
): string[] {
  const args = ["-y", "-i", input];

  if (s.resize !== "original") {
    args.push("-vf", `scale=${s.resize.replace("x", ":")}`);
  }

  if (s.format === "jpg" || s.format === "jpeg") {
    args.push("-q:v", Math.round((100 - s.quality) / 10).toString());
  }

  if (s.format === "png" && s.compressionLevel !== undefined) {
    args.push("-compression_level", s.compressionLevel.toString());
  }

  args.push(output);
  return args;
}

function parseDuration(line: string): number | null {
  const match = line.match(/Duration:\s(\d+):(\d+):([\d.]+)/);
  if (!match) return null;
  const [, hh, mm, ss] = match;
  return +hh * 3600 + +mm * 60 + +ss;
}

function parseProgressTime(line: string): number | null {
  const match = line.match(/time=(\d+):(\d+):([\d.]+)/);
  if (!match) return null;
  const [, hh, mm, ss] = match;
  return +hh * 3600 + +mm * 60 + +ss;
}

export function compressWithFFmpeg(
  inputPath: string,
  outputPath: string,
  settings: VideoSettings | ImageSettings,
  type: "video" | "image",
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args =
      type === "video"
        ? buildVideoArgs(inputPath, outputPath, settings as VideoSettings)
        : buildImageArgs(inputPath, outputPath, settings as ImageSettings);

    const process = spawn(ffmpegPath, args);

    let totalDuration: number | null = null;

    process.stderr.on("data", (data: Buffer) => {
      const lines = data.toString().split(/\r?\n/);
      lines.forEach((line) => {
        if (!totalDuration && line.includes("Duration:")) {
          totalDuration = parseDuration(line);
        }

        const progressTime = parseProgressTime(line);
        if (totalDuration && progressTime !== null) {
          const percent = Math.min(
            100,
            Math.round((progressTime / totalDuration) * 100)
          );
          onProgress(percent);
        }
      });
    });

    process.on("close", (code) => {
      if (code === 0) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    process.on("error", (err) => {
      reject(err);
    });
  });
}

ipcMain.handle("compress-video", (_event, { files, settings }) => {
  console.log(files);
  console.log(settings);
});
