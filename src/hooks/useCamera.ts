// カメラアクセス用カスタムフック
import { useEffect, useRef, useState } from 'react';

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreaming: boolean;
  error: string | null;
  captureImage: () => File | null;
  stopCamera: () => void;
}

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // カメラストリームを開始
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        console.log('📷 Starting camera...');

        // カメラへのアクセスを要求
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // 背面カメラを優先
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (!mounted) {
          // コンポーネントがアンマウントされていたらストリームを停止
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        // video要素にストリームを設定
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsStreaming(true);
          console.log('✅ Camera started successfully');
        }
      } catch (err) {
        console.error('❌ Camera access failed:', err);
        if (mounted) {
          if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
              setError('カメラへのアクセスが拒否されました');
            } else if (err.name === 'NotFoundError') {
              setError('カメラが見つかりません');
            } else {
              setError('カメラの起動に失敗しました');
            }
          } else {
            setError('カメラの起動に失敗しました');
          }
        }
      }
    }

    startCamera();

    // クリーンアップ
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        console.log('📷 Camera stopped');
      }
    };
  }, []);

  // カメラを停止
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
      console.log('📷 Camera stopped manually');
    }
  };

  // 画像をキャプチャ
  const captureImage = (): File | null => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('❌ Video or canvas ref is not available');
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // ビデオの実際のサイズを取得
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (videoWidth === 0 || videoHeight === 0) {
      console.error('❌ Video dimensions are invalid');
      return null;
    }

    console.log(`📷 Capturing image: ${videoWidth}x${videoHeight}`);

    // キャンバスのサイズを設定
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    // キャンバスに現在のフレームを描画
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Failed to get canvas context');
      return null;
    }

    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    // キャンバスからBlobを生成
    return new Promise<File | null>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('❌ Failed to create blob from canvas');
            resolve(null);
            return;
          }

          // BlobをFileに変換
          const file = new File([blob], `plant-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });

          console.log(`✅ Image captured: ${file.name}, size: ${file.size} bytes`);
          resolve(file);
        },
        'image/jpeg',
        0.85 // JPEG品質（0.0-1.0）
      );
    }) as unknown as File | null; // Promiseを同期的に扱うためのキャスト（実際は非同期）
  };

  return {
    videoRef,
    canvasRef,
    isStreaming,
    error,
    captureImage,
    stopCamera,
  };
}
