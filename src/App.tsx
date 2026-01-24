// メインアプリコンポーネント
import { useState, useEffect } from 'react';
import { UserSettings } from './types/plant';
import CameraView from './components/CameraView';
import SettingsView from './components/SettingsView';

// ローカルストレージのキー
const STORAGE_KEY_SETTINGS = 'plantapp_settings';
const STORAGE_KEY_API_KEY = 'plantapp_api_key';

// デフォルト設定
const DEFAULT_SETTINGS: UserSettings = {
  minimumConfidence: 0.65,
  showThumbnail: true,
};

function App() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [apiKey, setApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  // 初期化: ローカルストレージから設定を読み込み
  useEffect(() => {
    try {
      // 設定を読み込み
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings) as UserSettings;
        setSettings(parsed);
        console.log('✅ Loaded settings from localStorage:', parsed);
      }

      // APIキーを読み込み
      const savedApiKey = localStorage.getItem(STORAGE_KEY_API_KEY);
      if (savedApiKey) {
        setApiKey(savedApiKey);
        console.log('✅ Loaded API key from localStorage');
      }
    } catch (error) {
      console.error('❌ Failed to load settings from localStorage:', error);
    }
  }, []);

  // 設定とAPIキーを保存
  const handleSaveSettings = (newSettings: UserSettings, newApiKey: string) => {
    try {
      // 設定を保存
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
      setSettings(newSettings);
      console.log('✅ Saved settings to localStorage:', newSettings);

      // APIキーを保存
      localStorage.setItem(STORAGE_KEY_API_KEY, newApiKey);
      setApiKey(newApiKey);
      console.log('✅ Saved API key to localStorage');
    } catch (error) {
      console.error('❌ Failed to save settings to localStorage:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-900">
      {/* 設定画面 */}
      {showSettings ? (
        <SettingsView
          settings={settings}
          apiKey={apiKey}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      ) : (
        <>
          {/* カメラビュー */}
          <CameraView
            apiKey={apiKey}
            minimumConfidence={settings.minimumConfidence}
            showThumbnail={settings.showThumbnail}
          />

          {/* 設定ボタン（フローティング） */}
          <button
            onClick={() => setShowSettings(true)}
            className="fixed top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
            aria-label="設定"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export default App;
