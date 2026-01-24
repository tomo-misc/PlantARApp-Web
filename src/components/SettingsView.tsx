// 設定画面コンポーネント
import { useState } from 'react';
import { UserSettings } from '../types/plant';

interface SettingsViewProps {
  settings: UserSettings;
  apiKey: string;
  onSave: (settings: UserSettings, apiKey: string) => void;
  onClose: () => void;
}

export default function SettingsView({
  settings,
  apiKey,
  onSave,
  onClose,
}: SettingsViewProps) {
  const [minimumConfidence, setMinimumConfidence] = useState(
    settings.minimumConfidence
  );
  const [showThumbnail, setShowThumbnail] = useState(settings.showThumbnail);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    const newSettings: UserSettings = {
      minimumConfidence,
      showThumbnail,
    };
    onSave(newSettings, apiKeyInput);
    onClose();
  };

  const confidencePercent = (minimumConfidence * 100).toFixed(0);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* ヘッダー */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">設定</h1>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* 設定コンテンツ */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Plant.id API キー */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <label className="block text-white font-semibold mb-2">
            Plant.id API キー
          </label>
          <p className="text-gray-400 text-sm mb-4">
            Plant.id の API キーを入力してください。
            <a
              href="https://web.plant.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 ml-1 underline"
            >
              API キーを取得
            </a>
          </p>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="API キーを入力"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showApiKey ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {!apiKeyInput && (
            <p className="text-yellow-400 text-xs mt-2">
              ⚠️ API キーが設定されていません
            </p>
          )}
        </div>

        {/* 最低信頼度 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <label className="block text-white font-semibold mb-2">
            最低信頼度
          </label>
          <p className="text-gray-400 text-sm mb-4">
            この値未満の認識結果は表示されません
          </p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm">50%</span>
            <span className="text-white text-lg font-bold">
              {confidencePercent}%
            </span>
            <span className="text-gray-300 text-sm">95%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={minimumConfidence}
            onChange={(e) => setMinimumConfidence(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="mt-3 text-xs text-gray-400">
            {minimumConfidence >= 0.8
              ? '💚 高精度（誤認識が少ない）'
              : minimumConfidence >= 0.65
              ? '💛 標準（バランス型）'
              : '🧡 低精度（より多くの結果を表示）'}
          </div>
        </div>

        {/* サムネイル表示 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-white font-semibold mb-1">
                サムネイル表示
              </label>
              <p className="text-gray-400 text-sm">
                認識結果に類似画像を表示
              </p>
            </div>
            <button
              onClick={() => setShowThumbnail(!showThumbnail)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                showThumbnail ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  showThumbnail ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* アプリ情報 */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-white font-semibold mb-3">アプリ情報</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">バージョン</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">認識API</span>
              <span className="text-white">Plant.id v3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">辞書エントリ数</span>
              <span className="text-white">600+</span>
            </div>
          </div>
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="p-6 bg-gray-800 border-t border-gray-700">
        <button
          onClick={handleSave}
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg"
        >
          ✅ 保存する
        </button>
      </div>
    </div>
  );
}
