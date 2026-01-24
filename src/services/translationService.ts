// 植物名翻訳サービス

class TranslationService {
  private plantDictionary: Map<string, string> = new Map();
  private isLoaded = false;

  // JSONファイルから辞書を読み込み
  async loadDictionary(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const response = await fetch('/plants_ja.json');
      const data = await response.json();

      // メタデータキーを除外
      const metadataKeys = ['comment', 'version', 'last_updated', 'total_entries'];

      for (const [key, value] of Object.entries(data)) {
        // メタデータキーをスキップ
        if (metadataKeys.includes(key)) {
          continue;
        }

        // カテゴリキー（_で始まる）の場合は、その中身を展開
        if (key.startsWith('_') && typeof value === 'object' && value !== null) {
          for (const [plantKey, japaneseName] of Object.entries(value as Record<string, string>)) {
            // 大文字小文字を区別せず保存
            this.plantDictionary.set(plantKey.toLowerCase(), japaneseName);
          }
        } else if (typeof value === 'string') {
          // 直接のキー・バリューペア
          this.plantDictionary.set(key.toLowerCase(), value);
        }
      }

      this.isLoaded = true;
      console.log(`✅ Loaded ${this.plantDictionary.size} plant names from plants_ja.json`);
    } catch (error) {
      console.error('❌ Failed to load plants_ja.json:', error);
    }
  }

  // 英語の植物名を日本語に翻訳
  translateToJapanese(englishName: string): string {
    const searchKey = englishName.toLowerCase();
    const japaneseName = this.plantDictionary.get(searchKey);

    if (japaneseName) {
      console.log(`✅ Translated '${englishName}' → '${japaneseName}'`);
      return japaneseName;
    }

    console.log(`⚠️ No translation found for '${englishName}'`);
    return englishName;
  }
}

// シングルトンインスタンス
export const translationService = new TranslationService();
