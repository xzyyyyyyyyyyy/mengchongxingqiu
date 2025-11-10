import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';

const AddHealthLogPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    temperature: '',
    diet: {
      foodAmount: '',
      waterAmount: '',
      appetite: 'good'
    },
    bowelMovement: {
      frequency: '',
      consistency: 'normal'
    },
    energy: {
      level: 'normal'
    },
    mood: 'normal',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Convert empty strings to null
      const cleanData = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        diet: {
          ...formData.diet,
          foodAmount: formData.diet.foodAmount ? parseFloat(formData.diet.foodAmount) : null,
          waterAmount: formData.diet.waterAmount ? parseFloat(formData.diet.waterAmount) : null
        },
        bowelMovement: {
          ...formData.bowelMovement,
          frequency: formData.bowelMovement.frequency ? parseInt(formData.bowelMovement.frequency) : null
        }
      };

      await axios.post(`/api/health/${petId}`, cleanData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('健康记录已保存！');
      navigate(`/pets/${petId}/health`);
    } catch (error) {
      console.error('Error saving health log:', error);
      alert(error.response?.data?.message || '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-sm px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-xl font-bold text-center flex-1">记录健康数据</h1>
            <div className="w-8"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Date */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              日期
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Basic Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-bold">基础指标</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  体重 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="12.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  体温 (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="38.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Diet */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-bold">饮食情况</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  食量 (g)
                </label>
                <input
                  type="number"
                  step="1"
                  name="diet.foodAmount"
                  value={formData.diet.foodAmount}
                  onChange={handleChange}
                  placeholder="150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  饮水量 (ml)
                </label>
                <input
                  type="number"
                  step="1"
                  name="diet.waterAmount"
                  value={formData.diet.waterAmount}
                  onChange={handleChange}
                  placeholder="300"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食欲
              </label>
              <select
                name="diet.appetite"
                value={formData.diet.appetite}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="excellent">极好</option>
                <option value="good">良好</option>
                <option value="fair">一般</option>
                <option value="poor">较差</option>
              </select>
            </div>
          </div>

          {/* Bowel Movement */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-bold">排便情况</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  排便次数
                </label>
                <input
                  type="number"
                  step="1"
                  name="bowelMovement.frequency"
                  value={formData.bowelMovement.frequency}
                  onChange={handleChange}
                  placeholder="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  粪便状态
                </label>
                <select
                  name="bowelMovement.consistency"
                  value={formData.bowelMovement.consistency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="normal">正常</option>
                  <option value="soft">偏软</option>
                  <option value="hard">偏硬</option>
                  <option value="diarrhea">腹泻</option>
                </select>
              </div>
            </div>
          </div>

          {/* Energy & Mood */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-bold">精神状态</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  精力水平
                </label>
                <select
                  name="energy.level"
                  value={formData.energy.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="very-high">非常活跃</option>
                  <option value="high">活跃</option>
                  <option value="normal">正常</option>
                  <option value="low">较低</option>
                  <option value="very-low">萎靡</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  心情
                </label>
                <select
                  name="mood"
                  value={formData.mood}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="happy">开心</option>
                  <option value="normal">正常</option>
                  <option value="anxious">焦虑</option>
                  <option value="sad">沮丧</option>
                  <option value="irritable">烦躁</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              备注
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="记录今天的特殊情况..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.notes.length}/500
            </p>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white pt-4 pb-safe">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '保存记录'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddHealthLogPage;
