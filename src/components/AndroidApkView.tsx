import React, { useState } from 'react';
import { CheckCircle2, Copy, Download, Share2, Smartphone, Terminal } from 'lucide-react';

interface AndroidApkViewProps {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
  onNotify: (msg: string) => void;
}

const CAPACITOR_COMMANDS = `npm install
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug`;

export const AndroidApkView: React.FC<AndroidApkViewProps> = ({
  isInstallable,
  isInstalled,
  isIOS,
  onInstall,
  onNotify,
}) => {
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const handleInstallClick = async () => {
    const ok = await onInstall();
    if (ok) {
      onNotify('PakLoad installed on your device!');
    }
  };

  const copyCommands = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CAPACITOR_COMMANDS);
      } else {
        const el = document.createElement('textarea');
        el.value = CAPACITOR_COMMANDS;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      onNotify('Android APK build commands copied');
    } catch {
      onNotify('Unable to copy commands');
    }
  };

  return (
    <div className="space-y-6">
      {/* Direct Android Installation (WebAPK / PWA) */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span>Android WebAPK</span>
              <span aria-hidden="true">·</span>
              <span>Offline Service Worker</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-balance">
              Install as an Android App
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              PakLoad runs completely offline with a standalone home-screen icon, splash screen, and
              full-screen Android experience.
            </p>
          </div>

          <div className="shrink-0">
            {isInstalled ? (
              <div className="min-h-[44px] px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Installed on Device
              </div>
            ) : isInstallable ? (
              <button
                type="button"
                onClick={() => void handleInstallClick()}
                className="min-h-[48px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Install Android App
              </button>
            ) : isIOS ? (
              <button
                type="button"
                onClick={() => setShowIOSGuide((v) => !v)}
                className="min-h-[48px] px-5 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Install on iPhone / iPad
              </button>
            ) : (
              <div className="min-h-[44px] px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Open in Android Chrome to Install
              </div>
            )}
          </div>
        </div>

        {showIOSGuide && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 space-y-1">
            <p className="font-semibold">Install on Safari (iOS):</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              1. Tap the Share button in Safari. 2. Scroll down and choose Add to Home Screen.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              01. Open in Chrome on Android
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Visit this app URL in Google Chrome on your Android phone. Chrome automatically packages
              the manifest and icons into an Android WebAPK.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              02. Tap Install App
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tap the Install Android App button above or open Chrome menu (three dots) and select
              Install app / Add to Home screen.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              03. Use 100% Offline
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Launch PakLoad from your Android app drawer anytime — all load calculations, USSD codes,
              and saved history work without mobile data.
            </p>
          </div>
        </div>
      </section>

      {/* Capacitor Native APK Project Setup */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Compile Standalone Android APK (Capacitor)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                App ID: <span className="font-mono-num">pk.pakload.calculator</span> · Android Gradle project included
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void copyCommands()}
            className="min-h-[44px] px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Copy className="w-4 h-4" />
            Copy Build Commands
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 text-xs font-mono-num overflow-x-auto leading-relaxed">
          {CAPACITOR_COMMANDS}
        </pre>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The workspace includes <span className="font-mono-num text-slate-700 dark:text-slate-300">capacitor.config.ts</span>,{' '}
          <span className="font-mono-num text-slate-700 dark:text-slate-300">android/</span>, and a GitHub Actions workflow{' '}
          <span className="font-mono-num text-slate-700 dark:text-slate-300">.github/workflows/android-apk.yml</span> so you can
          compile <span className="font-mono-num text-slate-700 dark:text-slate-300">app-debug.apk</span> locally in Android Studio
          or automatically in GitHub Actions.
        </p>
      </section>
    </div>
  );
};
