import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { petService } from '../api/petService';
import { petRatingService } from '../api/petRatingService';
import { historyService } from '../api/historyService';
import { getImageUrl } from '../utils/imageUtils';

const EnhancedPetDetailPage = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({
    overall: 0,
    stickiness: 0,
    intelligence: 0,
    activeness: 0,
    shedding: 0,
    count: 0
  });
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const loadPetData = useCallback(async () => {
    try {
      setLoading(true);
      const [petResponse, ratingsResponse] = await Promise.all([
        petService.getPet(id),
        petRatingService.getPetRatings(id, { limit: 10 })
      ]);
      
      setPet(petResponse.data);
      setRatings(ratingsResponse.averages || ratings);
      setReviews(ratingsResponse.data || []);
      
      // Track browsing history
      try {
        await historyService.addToHistory('pet', id);
      } catch (err) {
        console.log('Failed to track history:', err);
      }
      
      // Load user's rating
      try {
        const myRatingResponse = await petRatingService.getMyRating(id);
        setMyRating(myRatingResponse.data);
      } catch (err) {
        // User hasn't rated yet, that's okay
      }
    } catch (error) {
      console.error('Failed to load pet data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPetData();
  }, [loadPetData]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">⭐</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  const renderRatingBar = (label, value) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= value ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-yellow-400 h-2 rounded-full transition-all"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">宠物不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              <img
                src={pet.avatar || '/default-pet.png'}
                alt={pet.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{pet.name}</h1>
                  <p className="text-gray-600 text-lg">{pet.breed || '柯基犬'} · {pet.age || 3}岁 · {pet.gender === 'male' ? '雄性' : '雌性'}</p>
                </div>
                <Link
                  to={`/pets/${id}/health`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  AI健康管家
                </Link>
              </div>

              {/* Rating */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-4xl font-bold text-yellow-500">{ratings.overall}</span>
                    <div>
                      <div className="flex text-yellow-400 text-xl">
                        {renderStars(ratings.overall)}
                      </div>
                      <p className="text-sm text-gray-600">综合评分</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('rating')}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>打分</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {renderRatingBar('粘人指数', ratings.stickiness)}
                  {renderRatingBar('聪明指数', ratings.intelligence)}
                  {renderRatingBar('活泼指数', ratings.activeness)}
                  {renderRatingBar('掉毛程度', ratings.shedding)}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {pet.personality?.temperament || '一只对世界充满好奇心的快乐小柯基！喜欢追球、晒太阳和所有好吃的零食。性格温顺，是家里的开心果。'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-lg">{stats.wantToAdopt.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-600">想养</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-lg mb-1">{stats.size}</div>
                  <p className="text-xs text-gray-600">体型</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-lg mb-1">{stats.views.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">浏览量</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>想养</span>
                </button>
                <button className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors font-medium">
                  领养
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {['info', 'feeding', 'reviews', 'videos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'info' && '详细信息'}
                {tab === 'feeding' && '喂养建议'}
                {tab === 'reviews' && '用户评价'}
                {tab === 'videos' && '视频'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">详细信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">品种</p>
                <p className="font-medium">{pet.breed || '柯基犬'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">年龄</p>
                <p className="font-medium">{pet.age || 3}岁</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">性别</p>
                <p className="font-medium">{pet.gender === 'male' ? '雄性' : '雌性'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">体重</p>
                <p className="font-medium">{pet.appearance?.weight || '12.5'}kg</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feeding' && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">喂养建议</h2>
            <div className="space-y-4 text-gray-700">
              <p>• 每日喂食2-3次，控制食量避免肥胖</p>
              <p>• 提供充足的清水，保持水分</p>
              <p>• 适量运动，每天散步1-2次</p>
              <p>• 定期梳理毛发，保持清洁</p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{review.user.name}</h3>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex text-yellow-400">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="bg-white rounded-lg p-6">
            <p className="text-gray-500 text-center py-12">暂无视频</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPetDetailPage;
