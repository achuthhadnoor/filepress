export interface MainWindowManager {
  open(): void;
  close(): void;
}

export interface LicenseWindowManager {
  open(): void;
  close(): void;
}

export interface SettingsWindowManager {
  open(): void;
  close(): void;
}

export interface FeedbackWindowManager {
  open(): void;
  close(): void;
}

class WindowManager {
  main: MainWindowManager;
  license: LicenseWindowManager;
  settings: SettingsWindowManager;
  feedback: FeedbackWindowManager;

  setMainWindowManager(main: MainWindowManager) {
    this.main = main;
  }

  setLicenseWindowManager(license: LicenseWindowManager) {
    this.license = license;
  }

  setSettingsWindowManager(settings: SettingsWindowManager) {
    this.settings = settings;
  }
  setFeedbackWindowManager(feedback: FeedbackWindowManager) {
    this.feedback = feedback;
  }
}

export default new WindowManager();
