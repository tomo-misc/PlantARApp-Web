// カメラビューコンポーネント
import { useState } from 'react';
import { useCamera } from '../hooks/useCamera';
import { plantIdApiService } from '../services/plantIdApi';
import { PlantIdentification } from '../types/plant';
import PlantInfoCard from './PlantInfoCard';

interface CameraViewProps {
  apiKey: string;
  minimumConfidence: number;
  showThumbnail: boolean;
}

export default function CameraView({
  apiKey,
  minimumConfidence,
  showThumbnail,
}: CameraViewProps) {
  const { videoRef, canvasRef, isStreaming, error, captureImage } = useCamera();
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [result, setResult] = useState<PlantIdentification | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // APIキーを設定
  if (apiKey && !plantIdApiService.hasApiKey()) {
    plantIdApiService.setApiKey(apiKey);
  }

  // シャッターボタンをクリック
  const handleCapture = async () => {
    if (!plantIdApiService.hasApiKey()) {
      setErrorMessage('APIキーが設定されていません\n設定画面でAPIキーを入力してください');
      return;
    }

    setIsIdentifying(true);
    setErrorMessage(null);
    setResult(null);

    try {
      // 画像をキャプチャ
      const imageFile = captureImage();

      if (!imageFile) {
        throw new Error('画像のキャプチャに失敗しました');
      }

      console.log('🌿 Captured image, starting identification...');

      // Plant.id APIで植物を識別
      const identification = await plantIdApiService.identifyPlant(imageFile);

      // 信頼度チェック
      if (identification.confidence < minimumConfidence) {
        setErrorMessage(
          `認識できませんでした\n信頼度: ${(identification.confidence * 100).toFixed(0)}%\n別の角度から撮影してみてください`
        );
        return;
      }

      console.log('✅ Identification successful:', identification);
      setResult(identification);

    } catch (err) {
      console.error('❌ Identification error:', err);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('不明なエラーが発生しました');
      }
    } finally {
      setIsIdentifying(false);
    }
  };

  // 再撮影ボタンをクリック
  const handleRetry = () => {
    setResult(null);
    setErrorMessage(null);
  };

  // カメラエラー表示
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📷</div>
          <h2 className="text-xl font-bold text-white mb-2">カメラエラー</h2>
          <p className="text-gray-400 whitespace-pre-line">{error}</p>
        </div>
      </div>
    );
  }

  // 結果表示中
  if (result) {
    return (
      <div className="flex flex-col h-screen bg-gray-900">
        <PlantInfoCard
          result={result}
          showThumbnail={showThumbnail}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // カメラビュー
  return (
    <div className="relative flex flex-col h-screen bg-black">
      {/* ビデオプレビュー */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 隠しキャンバス（画像キャプチャ用） */}
        <canvas ref={canvasRef} className="hidden" />

        {/* ガイドフレーム */}
        {isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-4 border-white border-opacity-50 rounded-lg"></div>
          </div>
        )}

        {/* 処理中オーバーレイ */}
        {isIdentifying && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">植物を認識中...</p>
            </div>
          </div>
        )}

        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="absolute top-4 left-4 right-4 bg-red-500 bg-opacity-90 p-4 rounded-lg">
            <p className="text-white text-center whitespace-pre-line">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* シャッターボタン */}
      <div className="flex items-center justify-center p-8 bg-gray-900">
        <button
          onClick={handleCapture}
          disabled={!isStreaming || isIdentifying}
          className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${
            isStreaming && !isIdentifying
              ? 'bg-white hover:scale-110 active:scale-95'
              : 'bg-gray-600 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white"></div>
        </button>
      </div>
    </div>
  );
}
