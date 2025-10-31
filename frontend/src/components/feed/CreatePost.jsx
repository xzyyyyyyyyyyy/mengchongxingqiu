import { useState } from 'react';
import { postService } from '../../api/postService';
import { petService } from '../../api/petService';

const CreatePost = ({ onPostCreated, onClose }) => {
  const [formData, setFormData] = useState({
    content: '',
    category: 'daily',
    tags: '',
    hashtags: '',
    pet: '',
  });
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user's pets
  useState(() => {
    const loadPets = async () => {
      try {
        const response = await petService.getPets();
        setPets(response.data);
      } catch (err) {
        console.error('Failed to load pets:', err);
      }
    };
    loadPets();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const postData = {
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        hashtags: formData.hashtags.split(',').map(t => t.trim()).filter(t => t),
      };

      if (formData.pet) {
        postData.pet = formData.pet;
      }

      await postService.createPost(postData);
      
      if (onPostCreated) {
        onPostCreated();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || '发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">发布动态</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={4}
            className="input-field resize-none"
            placeholder="分享你的宠物日常..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="daily">日常</option>
              <option value="funny">搞笑</option>
              <option value="medical">医疗</option>
              <option value="food">美食</option>
              <option value="training">训练</option>
              <option value="travel">旅行</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              关联宠物（可选）
            </label>
            <select
              name="pet"
              value={formData.pet}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">选择宠物</option>
              {pets.map((pet) => (
                <option key={pet._id} value={pet._id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标签（用逗号分隔）
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-field"
            placeholder="例如: 可爱, 萌萌哒, 猫咪"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            话题（用逗号分隔）
          </label>
          <input
            type="text"
            name="hashtags"
            value={formData.hashtags}
            onChange={handleChange}
            className="input-field"
            placeholder="例如: 萌宠日常, 新手养宠"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              取消
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '发布中...' : '发布'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
