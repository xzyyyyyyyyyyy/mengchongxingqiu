import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('following');

  const petCategories = [
    { id: 'cat', name: '猫', icon: '🐱', color: 'bg-orange-100 text-orange-600' },
    { id: 'dog', name: '狗', icon: '🐶', color: 'bg-blue-100 text-blue-600' },
    { id: 'rabbit', name: '兔', icon: '🐰', color: 'bg-pink-100 text-pink-600' },
    { id: 'hamster', name: '仓鼠', icon: '🐹', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'parrot', name: '鹦鹉', icon: '🦜', color: 'bg-green-100 text-green-600' },
    { id: 'fish', name: '鱼', icon: '🐠', color: 'bg-cyan-100 text-cyan-600' },
    { id: 'turtle', name: '龟', icon: '🐢', color: 'bg-teal-100 text-teal-600' },
    { id: 'all', name: '全部', icon: '📱', color: 'bg-gray-100 text-gray-600' }
  ];

  const popularBreeds = [
    {
      id: 1,
      name: '英国短毛猫',
      nameEn: 'Shorthair Cat',
      image: '🐱',
      rating: '粘人指数',
      stars: 5,
      isFollowing: false
    },
    {
      id: 2,
      name: '金毛寻回犬',
      nameEn: 'Golden Retriever',
      image: '🐕',
      rating: '聪明指数',
      stars: 5,
      isFollowing: false
    },
    {
      id: 3,
      name: '布偶猫',
      nameEn: 'Ragdoll Cat',
      image: '😺',
      rating: '颜值指数',
      stars: 5,
      isFollowing: true
    }
  ];

  const ratingBreeds = [
    {
      id: 1,
      name: '哈士奇',
      nameEn: 'Siberian Husky',
      rating: 4.9,
      reviews: '2.1k',
      isFollowing: true
    },
    {
      id: 2,
      name: '柯基',
      nameEn: 'Corgi',
      rating: 4.8,
      reviews: '1.8k',
      isFollowing: false
    },
    {
      id: 3,
      name: '柴犬',
      nameEn: 'Shiba Inu',
      rating: 4.7,
      reviews: '1.5k',
      isFollowing: false
    }
  ];

  const myFollowing = [
    {
      id: 1,
      name: '英短',
      nameEn: 'Shorthair Cat',
      image: '🐱',
      followers: '12.3k'
    },
    {
      id: 2,
      name: '金毛',
      nameEn: 'Golden Retriever',
      image: '🐕',
      followers: '15.8k'
    },
    {
      id: 3,
      name: '布偶',
      nameEn: 'Ragdoll Cat',
      image: '😺',
      followers: '18.2k'
    },
    {
      id: 4,
      name: '哈士奇',
      nameEn: 'Siberian Husky',
      image: '🐺',
      followers: '9.5k'
    },
    {
      id: 5,
      name: '仓鼠',
      nameEn: 'Hamster',
      image: '🐹',
      followers: '5.2k'
    }
  ];

  const toggleFollow = (id) => {
    console.log('Toggle follow:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">宠物分类</h1>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('following')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'following'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              我的关注
              {activeTab === 'following' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'explore'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              发现更多
              {activeTab === 'explore' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'following' && (
          <div>
            {/* My Following */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">我的关注</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {myFollowing.map((breed) => (
                  <div
                    key={breed.id}
                    className="text-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/breeds/${breed.id}`)}
                  >
                    <div className="text-5xl mb-2">{breed.image}</div>
                    <div className="font-medium mb-1">{breed.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{breed.nameEn}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(breed.id);
                      }}
                      className="w-full py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      已关注
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">宠物分类</h2>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {petCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => navigate(`/category/${category.id}`)}
                    className={`p-4 rounded-lg ${category.color} hover:shadow-md transition-shadow flex flex-col items-center`}
                  >
                    <span className="text-3xl mb-2">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="space-y-6">
            {/* Hot Breeds */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">热门榜单</h2>
                <button className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1">
                  <span>查看更多</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {popularBreeds.map((breed, index) => (
                  <div
                    key={breed.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/breeds/${breed.id}`)}
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="font-bold text-lg text-gray-400">{index + 1}</span>
                    </div>
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                      {breed.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{breed.name}</h3>
                      <p className="text-sm text-gray-500">{breed.nameEn}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs text-gray-600">{breed.rating}:</span>
                        <div className="flex text-yellow-400 text-sm">
                          {Array(breed.stars).fill('★').map((star, i) => (
                            <span key={i}>{star}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(breed.id);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        breed.isFollowing
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {breed.isFollowing ? '已关注' : '关注'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Breeds */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">评分榜单</h2>
                <button className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1">
                  <span>查看更多</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {ratingBreeds.map((breed, index) => (
                  <div
                    key={breed.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/breeds/${breed.id}`)}
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="font-bold text-lg text-gray-400">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{breed.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{breed.nameEn}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500 font-bold">★ {breed.rating}</span>
                        <span className="text-xs text-gray-500">({breed.reviews} 评论)</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(breed.id);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        breed.isFollowing
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {breed.isFollowing ? '已关注' : '关注'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Grid */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">浏览分类</h2>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {petCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => navigate(`/category/${category.id}`)}
                    className={`p-4 rounded-lg ${category.color} hover:shadow-md transition-shadow flex flex-col items-center`}
                  >
                    <span className="text-3xl mb-2">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
