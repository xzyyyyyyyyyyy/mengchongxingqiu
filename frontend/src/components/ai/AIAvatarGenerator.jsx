import { useState } from 'react';
import { aiService } from '../api/aiService';

const AIAvatarGenerator = ({ onAvatarGenerated, petData = {} }) => {
  const [generating, setGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [formData, setFormData] = useState({
    petType: petData.species || 'dog',
    breed: petData.breed || '',
    description: '',
    style: 'realistic'
  });

  const handleGenerate = async () => {
    if (!formData.breed) {
      alert('请输入品种信息');
      return;
    }

    try {
      setGenerating(true);
      const result = await aiService.generateAvatar(formData);
      
      if (result.success) {
        setGeneratedAvatar(result.data);
        if (onAvatarGenerated) {
          onAvatarGenerated(result.data.imageUrl);
        }
      } else {
        alert(result.message || '生成失败');
      }
    } catch (error) {
      console.error('Avatar generation error:', error);
      alert('生成失败，请稍后再试');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">🎨</span>
        AI宠物头像生成
      </h3>

      <div className="space-y-4">
        {/* Pet Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            宠物类型
          </label>
          <select
            value={formData.petType}
            onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="dog">狗狗 🐕</option>
            <option value="cat">猫咪 🐱</option>
            <option value="rabbit">兔子 🐰</option>
            <option value="hamster">仓鼠 🐹</option>
            <option value="bird">鸟类 🦜</option>
            <option value="other">其他 🐾</option>
          </select>
        </div>

        {/* Breed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            品种
          </label>
          <input
            type="text"
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            placeholder="例如：金毛寻回犬"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            外观描述（可选）
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="描述宠物的特征，如颜色、体型等"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            头像风格
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['realistic', 'cartoon', 'anime'].map((style) => (
              <button
                key={style}
                onClick={() => setFormData({ ...formData, style })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  formData.style === style
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {style === 'realistic' && '写实'}
                {style === 'cartoon' && '卡通'}
                {style === 'anime' && '动漫'}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>AI生成中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span>生成AI头像</span>
            </>
          )}
        </button>

        {/* Generated Avatar Preview */}
        {generatedAvatar && (
          <div className="mt-4 p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 mb-2">生成的头像：</p>
            <div className="relative w-32 h-32 mx-auto mb-2">
              <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                <span className="text-5xl">
                  {formData.petType === 'dog' && '🐕'}
                  {formData.petType === 'cat' && '🐱'}
                  {formData.petType === 'rabbit' && '🐰'}
                  {formData.petType === 'hamster' && '🐹'}
                  {formData.petType === 'bird' && '🦜'}
                  {formData.petType === 'other' && '🐾'}
                </span>
              </div>
            </div>
            <p className="text-xs text-center text-green-600">✓ {generatedAvatar.message}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center mt-2">
          💡 提示：AI会根据您提供的信息生成独特的宠物头像
        </div>
      </div>
    </div>
  );
};

export default AIAvatarGenerator;
