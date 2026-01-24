// 植物情報カードコンポーネント
import { PlantIdentification } from '../types/plant';

interface PlantInfoCardProps {
  result: PlantIdentification;
  showThumbnail: boolean;
  onRetry: () => void;
}

export default function PlantInfoCard({
  result,
  showThumbnail,
  onRetry,
}: PlantInfoCardProps) {
  const confidencePercent = (result.confidence * 100).toFixed(0);
  const formattedDate = result.timestamp.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* ヘッダー */}
      <div className="bg-green-600 p-4 text-white">
        <h1 className="text-2xl font-bold text-center">植物認識結果</h1>
      </div>

      {/* 結果コンテンツ */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* サムネイル画像 */}
        {showThumbnail && result.thumbnailURL && (
          <div className="mb-6">
            <img
              src={result.thumbnailURL}
              alt={result.name}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* 植物名 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-4 shadow-lg">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">🌿</span>
            <div>
              <h2 className="text-3xl font-bold text-white">{result.name}</h2>
              <p className="text-gray-400 text-sm mt-1 italic">
                {result.scientificName}
              </p>
            </div>
          </div>

          {/* 信頼度 */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">信頼度</span>
              <span className="text-white text-lg font-semibold">
                {confidencePercent}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  result.confidence >= 0.8
                    ? 'bg-green-500'
                    : result.confidence >= 0.6
                    ? 'bg-yellow-500'
                    : 'bg-orange-500'
                }`}
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 認識日時 */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">認識日時</span>
            <span className="text-white text-sm">{formattedDate}</span>
          </div>
        </div>

        {/* 認識IDデバッグ情報 */}
        {import.meta.env.DEV && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">ID</span>
              <span className="text-gray-500 text-xs font-mono">{result.id}</span>
            </div>
          </div>
        )}

        {/* 信頼度による注意メッセージ */}
        {result.confidence < 0.7 && (
          <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <span className="text-yellow-400 text-xl mr-2">⚠️</span>
              <div>
                <p className="text-yellow-200 text-sm font-semibold mb-1">
                  認識精度が低い可能性があります
                </p>
                <p className="text-yellow-300 text-xs">
                  より鮮明な画像で再度撮影すると、精度が向上する場合があります。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 再撮影ボタン */}
      <div className="p-6 bg-gray-800">
        <button
          onClick={onRetry}
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg"
        >
          📷 再撮影する
        </button>
      </div>
    </div>
  );
}
