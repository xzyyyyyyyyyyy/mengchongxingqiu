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
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 9 images
    if (files.length + selectedImages.length > 9) {
      setError('最多只能上传9张图片');
      return;
    }

    // Check file size (10MB each)
    const maxSize = 10 * 1024 * 1024;
    const invalidFiles = files.filter(file => file.size > maxSize);
    if (invalidFiles.length > 0) {
      setError('单个图片大小不能超过10MB');
      return;
    }

    setSelectedImages([...selectedImages, ...files]);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setError('');
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

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

      // Create FormData for file upload
      const postData = new FormData();
      postData.append('content', formData.content);
      postData.append('category', formData.category);
      postData.append('mediaType', selectedImages.length > 0 ? 'image' : 'text');
      
      // Add hashtags
      hashtags.forEach(tag => {
        postData.append('hashtags[]', tag);
      });

      // Add images
      selectedImages.forEach(image => {
        postData.append('images', image);
      });

      await postService.createPostWithImages(postData);

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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              图片（可选）
            </label>
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {selectedImages.length < 9 && (
              <div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">添加图片</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  最多9张，每张不超过10MB
                </p>
              </div>
            )}
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
