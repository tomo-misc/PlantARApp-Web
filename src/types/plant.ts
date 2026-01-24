// 植物認識結果の型定義
export interface PlantIdentification {
  id: string;
  name: string;              // 日本語名
  scientificName: string;    // 学名
  confidence: number;        // 信頼度 (0.0-1.0)
  thumbnailURL?: string;     // サムネイル画像URL
  timestamp: Date;           // 認識日時
}

// ユーザー設定の型定義
export interface UserSettings {
  minimumConfidence: number;  // 最低信頼度 (0.5-0.95)
  showThumbnail: boolean;     // サムネイル表示
}

// Plant.id API レスポンスの型定義
export interface PlantIdApiResponse {
  id?: string;
  suggestions?: Suggestion[];
  result?: {
    classification?: {
      suggestions?: Suggestion[];
    };
  };
}

export interface Suggestion {
  id?: string;
  name?: string;
  probability?: number;
  similar_images?: SimilarImage[];
  details?: {
    common_names?: string[];
  };
}

export interface SimilarImage {
  id?: string;
  url?: string;
  similarity?: number;
}

// エラー型定義
export enum PlantIdError {
  NETWORK_ERROR = 'ネットワーク接続を確認してください',
  API_KEY_INVALID = 'APIキーが無効です',
  LOW_CONFIDENCE = '認識できませんでした\n別の角度から撮影してみてください',
  IMAGE_PROCESSING_FAILED = '画像の処理に失敗しました',
  INVALID_RESPONSE = 'APIからの応答が不正です',
  UNKNOWN_ERROR = '不明なエラーが発生しました'
}
