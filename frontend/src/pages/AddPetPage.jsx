import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petService } from '../api/petService';

const AddPetPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: 'cat',
    breed: '',
    gender: 'unknown',
    birthDate: '',
    color: '',
    weight: '',
    temperament: '',
    traits: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const petData = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        gender: formData.gender,
        birthDate: formData.birthDate || undefined,
        appearance: {
          color: formData.color || undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
        },
        personality: {
          temperament: formData.temperament || undefined,
          traits: formData.traits
            ? formData.traits.split(',').map(t => t.trim()).filter(t => t)
            : undefined,
        },
      };

      const response = await petService.createPet(petData);
      navigate(`/pets/${response.data._id}`);
    } catch (err) {
      setError(err.message || '添加失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const speciesNames = {
    cat: '猫',
    dog: '狗',
    rabbit: '兔子',
    hamster: '仓鼠',
    bird: '鸟',
    fish: '鱼',
    other: '其他',
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/pets')}
          className="flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          返回
        </button>

        <div className="card">
          <h1 className="text-2xl font-bold mb-6">添加宠物档案</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-bold mb-4">基本信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    名字 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="例如: 小白"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      种类 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="species"
                      value={formData.species}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      {Object.entries(speciesNames).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      品种 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="例如: 英国短毛猫"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      性别
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="unknown">未知</option>
                      <option value="male">雄性</option>
                      <option value="female">雌性</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      出生日期
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div>
              <h2 className="text-lg font-bold mb-4">外观特征</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    颜色
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="例如: 橘色"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    体重 (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="例如: 4.5"
                  />
                </div>
              </div>
            </div>

            {/* Personality */}
            <div>
              <h2 className="text-lg font-bold mb-4">性格特征</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    性格描述
                  </label>
                  <textarea
                    name="temperament"
                    value={formData.temperament}
                    onChange={handleChange}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="描述一下TA的性格..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    性格标签（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    name="traits"
                    value={formData.traits}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="例如: 活泼, 粘人, 独立"
                  />
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">💡 温馨提示</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 完善宠物档案后，可以添加健康记录和提醒事项</li>
                <li>• 可以上传宠物照片作为头像</li>
                <li>• 建议上传疫苗本和体检报告以便管理</li>
              </ul>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/pets')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '添加中...' : '添加宠物'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPetPage;
