import { useState } from 'react';
import { healthService } from '../../api/healthService';

const HealthLogForm = ({ petId, onLogCreated, onClose }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    temperature: '',
    foodAmount: '',
    waterAmount: '',
    appetite: 'good',
    bowelFrequency: '',
    bowelConsistency: 'normal',
    energyLevel: 'normal',
    mood: 'normal',
    notes: '',
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
      const logData = {
        date: formData.date,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        diet: {
          foodAmount: formData.foodAmount ? parseFloat(formData.foodAmount) : undefined,
          waterAmount: formData.waterAmount ? parseFloat(formData.waterAmount) : undefined,
          appetite: formData.appetite,
        },
        bowelMovement: {
          frequency: formData.bowelFrequency ? parseInt(formData.bowelFrequency) : undefined,
          consistency: formData.bowelConsistency,
        },
        energy: {
          level: formData.energyLevel,
        },
        mood: formData.mood,
        notes: formData.notes,
      };

      await healthService.createHealthLog(petId, logData);
      
      if (onLogCreated) {
        onLogCreated();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || '记录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">每日健康记录</h2>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日期
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Basic Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="例如: 5.2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              体温 (°C)
            </label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              step="0.1"
              className="input-field"
              placeholder="例如: 38.5"
            />
          </div>
        </div>

        {/* Diet */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">饮食情况</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                食量 (g)
              </label>
              <input
                type="number"
                name="foodAmount"
                value={formData.foodAmount}
                onChange={handleChange}
                className="input-field"
                placeholder="例如: 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                饮水量 (ml)
              </label>
              <input
                type="number"
                name="waterAmount"
                value={formData.waterAmount}
                onChange={handleChange}
                className="input-field"
                placeholder="例如: 200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                食欲
              </label>
              <select
                name="appetite"
                value={formData.appetite}
                onChange={handleChange}
                className="input-field"
              >
                <option value="excellent">非常好</option>
                <option value="good">良好</option>
                <option value="fair">一般</option>
                <option value="poor">不佳</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bowel Movement */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">排便情况</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                次数
              </label>
              <input
                type="number"
                name="bowelFrequency"
                value={formData.bowelFrequency}
                onChange={handleChange}
                className="input-field"
                placeholder="例如: 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态
              </label>
              <select
                name="bowelConsistency"
                value={formData.bowelConsistency}
                onChange={handleChange}
                className="input-field"
              >
                <option value="normal">正常</option>
                <option value="soft">偏软</option>
                <option value="hard">偏硬</option>
                <option value="diarrhea">腹泻</option>
              </select>
            </div>
          </div>
        </div>

        {/* Energy and Mood */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              精神状态
            </label>
            <select
              name="energyLevel"
              value={formData.energyLevel}
              onChange={handleChange}
              className="input-field"
            >
              <option value="very-high">非常活跃</option>
              <option value="high">活跃</option>
              <option value="normal">正常</option>
              <option value="low">低迷</option>
              <option value="very-low">非常低迷</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              情绪
            </label>
            <select
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              className="input-field"
            >
              <option value="happy">开心</option>
              <option value="normal">正常</option>
              <option value="anxious">焦虑</option>
              <option value="sad">低落</option>
              <option value="irritable">烦躁</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            备注
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="记录其他观察到的情况..."
          />
        </div>

        {/* Submit */}
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
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthLogForm;
