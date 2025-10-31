import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../api/postService';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
    category: 'daily',
    hashtags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'daily', label: '日常', icon: '📝' },
    { value: 'funny', label: '搞笑', icon: '😄' },
    { value: 'medical', label: '医疗', icon: '🏥' },
    { value: 'food', label: '美食', icon: '🍖' },
    { value: 'training', label: '训练', icon: '🎓' },
    { value: 'travel', label: '旅行', icon: '✈️' },
    { value: 'other', label: '其他', icon: '📌' },
  ];

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError('请输入内容');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      // Parse hashtags
      const hashtags = formData.hashtags
        .split(/[,，\s]+/)
        .map(tag => tag.trim().replace(/^#/, ''))
        .filter(tag => tag.length > 0);

      await postService.createPost({
        content: formData.content,
        category: formData.category,
        hashtags,
        mediaType: 'text'
      });

      setSuccess('发布成功！');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Failed to create post:', error);
      setError('发布失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>取消</span>
          </button>
          <h1 className="text-2xl font-bold text-text-primary">发布动态</h1>
          <div className="w-16"></div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="分享你的宠物日常..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="8"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.content.length} / 2000
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              分类
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.category === cat.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-medium">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              话题标签
            </label>
            <input
              type="text"
              value={formData.hashtags}
              onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
              placeholder="例如: 猫咪日常, 新手养宠"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-gray-500 mt-1">
              用逗号或空格分隔多个话题
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.content.trim()}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '发布中...' : '发布'}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 card bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="font-bold mb-2">发布小贴士</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✓ 分享真实的宠物日常</li>
            <li>✓ 使用话题标签增加曝光</li>
            <li>✓ 友善交流，传播正能量</li>
            <li>✓ 尊重他人，拒绝虚假信息</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
