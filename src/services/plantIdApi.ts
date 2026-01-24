// Plant.id API サービス
import { PlantIdentification, PlantIdApiResponse, PlantIdError } from '../types/plant';
import { translationService } from './translationService';

const PLANT_ID_API_URL = 'https://api.plant.id/v3/identification';

class PlantIdApiService {
  private apiKey: string | null = null;

  // APIキーを設定
  setApiKey(key: string): void {
    this.apiKey = key;
    console.log('✅ Plant.id API key has been set');
  }

  // APIキーが設定されているか確認
  hasApiKey(): boolean {
    return this.apiKey !== null && this.apiKey.length > 0;
  }

  // 画像をBase64エンコード
  private async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // data:image/jpeg;base64, の部分を除去
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // 植物を識別
  async identifyPlant(imageFile: File): Promise<PlantIdentification> {
    if (!this.hasApiKey()) {
      throw new Error(PlantIdError.API_KEY_INVALID);
    }

    try {
      console.log('🌿 ===== Starting Plant Identification =====');
      console.log(`🌿 Image file: ${imageFile.name}, size: ${imageFile.size} bytes`);

      // 画像をBase64に変換
      const base64Image = await this.imageToBase64(imageFile);
      console.log(`🌿 Base64 encoded, length: ${base64Image.length} characters`);

      // API リクエストボディ
      const requestBody = {
        images: [base64Image],
        similar_images: true,
      };

      console.log('🌿 Sending request to Plant.id API...');

      // API リクエスト
      const response = await fetch(PLANT_ID_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.apiKey!,
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`🌿 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(PlantIdError.API_KEY_INVALID);
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: PlantIdApiResponse = await response.json();
      console.log('🌿 API Response received');

      // レスポンスを PlantIdentification に変換
      const result = await this.convertToPlantIdentification(data);

      if (!result) {
        throw new Error(PlantIdError.LOW_CONFIDENCE);
      }

      console.log('🌿 ===== Identification Complete =====');
      return result;

    } catch (error) {
      console.error('❌ Plant identification failed:', error);

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error(PlantIdError.NETWORK_ERROR);
        }
        throw error;
      }

      throw new Error(PlantIdError.UNKNOWN_ERROR);
    }
  }

  // APIレスポンスを PlantIdentification に変換
  private async convertToPlantIdentification(
    response: PlantIdApiResponse
  ): Promise<PlantIdentification | null> {
    // suggestions の取得（複数のフォーマットに対応）
    const suggestions =
      response.suggestions ||
      response.result?.classification?.suggestions ||
      [];

    if (!suggestions || suggestions.length === 0) {
      console.log('⚠️ No suggestions found in API response');
      return null;
    }

    const firstSuggestion = suggestions[0];
    const scientificName = firstSuggestion.name || 'Unknown';
    const probability = firstSuggestion.probability || 0;

    console.log('🌿 ===== Plant ID API Response =====');
    console.log(`🌿 Scientific name: '${scientificName}'`);
    console.log(`🌿 Probability: ${probability}`);

    if (firstSuggestion.details?.common_names) {
      console.log(`🌿 Common names from API: ${firstSuggestion.details.common_names}`);
    } else {
      console.log('🌿 Common names: (none)');
    }

    console.log('🌿 ===================================');

    // 信頼度チェック（最低0.5以上）
    if (probability < 0.5) {
      console.log(`⚠️ Confidence too low: ${probability}`);
      return null;
    }

    // 翻訳辞書を読み込み
    await translationService.loadDictionary();

    // 日本語名を取得（APIのcommon_namesまたは翻訳辞書から）
    let japaneseName = '';

    // APIから日本語名を探す
    if (firstSuggestion.details?.common_names) {
      const japaneseFromApi = firstSuggestion.details.common_names.find((name) =>
        /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(name)
      );
      if (japaneseFromApi) {
        console.log(`🌿 Using Japanese name from API: '${japaneseFromApi}'`);
        japaneseName = japaneseFromApi;
      }
    }

    // API に日本語名がなければ翻訳辞書を使用
    if (!japaneseName) {
      const nameToTranslate = firstSuggestion.details?.common_names?.[0] || scientificName;
      console.log(`🌿 Attempting translation for: '${nameToTranslate}'`);
      japaneseName = translationService.translateToJapanese(nameToTranslate);
    }

    // サムネイル画像URL
    const thumbnailURL =
      firstSuggestion.similar_images?.[0]?.url || undefined;

    if (thumbnailURL) {
      console.log(`🌿 Thumbnail URL: ${thumbnailURL}`);
    }

    return {
      id: response.id || `plant-${Date.now()}`,
      name: japaneseName,
      scientificName: scientificName,
      confidence: probability,
      thumbnailURL: thumbnailURL,
      timestamp: new Date(),
    };
  }
}

// シングルトンインスタンス
export const plantIdApiService = new PlantIdApiService();
