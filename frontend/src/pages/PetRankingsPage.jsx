import { useState, useEffect } from 'react';

const PetRankingsPage = () => {
  const [activeTab, setActiveTab] = useState('cute');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for now - will connect to real API later
  const mockRankings = {
    cute: [
      { id: 1, name: '小橘', owner: '猫咪小王子', species: '猫', avatar: '/uploads/pets/cat1.jpg', votes: 1234, rank: 1 },
      { id: 2, name: '旺财', owner: '狗狗达人', species: '狗', avatar: '/uploads/pets/dog1.jpg', votes: 1156, rank: 2 },
      { id: 3, name: '球球', owner: '萌宠摄影师', species: '兔', avatar: '/uploads/pets/rabbit1.jpg', votes: 987, rank: 3 },
    ],
    wellBehaved: [
      { id: 1, name: '旺财', owner: '狗狗达人', species: '狗', avatar: '/uploads/pets/dog1.jpg', votes: 1567, rank: 1 },
      { id: 2, name: '小橘', owner: '猫咪小王子', species: '猫', avatar: '/uploads/pets/cat1.jpg', votes: 1234, rank: 2 },
      { id: 3, name: '雪球', owner: 'admin', species: '猫', avatar: '/uploads/pets/cat2.jpg', votes: 1089, rank: 3 },
    ],
    active: [
      { id: 1, name: '闪电', owner: '运动达人', species: '狗', avatar: '/uploads/pets/dog2.jpg', votes: 1678, rank: 1 },
      { id: 2, name: '旺财', owner: '狗狗达人', species: '狗', avatar: '/uploads/pets/dog1.jpg', votes: 1456, rank: 2 },
      { id: 3, name: '跳跳', owner: '萌宠爱好者', species: '兔', avatar: '/uploads/pets/rabbit2.jpg', votes: 1123, rank: 3 },
    ],
    smart: [
      { id: 1, name: '小智', owner: '训练师', species: '狗', avatar: '/uploads/pets/dog3.jpg', votes: 1890, rank: 1 },
      { id: 2, name: '旺财', owner: '狗狗达人', species: '狗', avatar: '/uploads/pets/dog1.jpg', votes: 1567, rank: 2 },
      { id: 3, name: '聪聪', owner: '猫奴', species: '猫', avatar: '/uploads/pets/cat3.jpg', votes: 1345, rank: 3 },
    ],
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRankings(mockRankings[activeTab] || []);
      setLoading(false);
    }, 500);
  }, [activeTab]);

  const tabs = [
    { id: 'cute', name: '😍 可爱榜', icon: '😍' },
    { id: 'wellBehaved', name: '😇 乖巧榜', icon: '😇' },
    { id: 'active', name: '⚡ 活力榜', icon: '⚡' },
    { id: 'smart', name: '🧠 聪明榜', icon: '🧠' },
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">🏆 宠物排行榜</h1>
          <p className="text-text-secondary">看看谁是最受欢迎的萌宠！</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-text-secondary hover:bg-gray-50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Rankings List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {rankings.map((pet, index) => (
              <div
                key={pet.id}
                className={`card hover:shadow-xl transition-all cursor-pointer ${
                  index < 3 ? 'border-2 border-yellow-400' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="text-4xl font-bold w-16 text-center">
                    {getRankBadge(pet.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0">
                    <img
                      src={pet.avatar}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Pet';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-primary mb-1">
                      {pet.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <span>主人: {pet.owner}</span>
                      <span>·</span>
                      <span>{pet.species}</span>
                    </div>
                  </div>

                  {/* Votes */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {pet.votes.toLocaleString()}
                    </div>
                    <div className="text-sm text-text-secondary">票</div>
                    <button className="mt-2 px-4 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">
                      投票
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rules Section */}
        <div className="mt-8 card bg-gradient-to-br from-yellow-50 to-orange-50">
          <h3 className="text-lg font-bold text-text-primary mb-3">📋 排行榜规则</h3>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>每个用户每天可以为每只宠物投1票</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>排行榜每周一凌晨重置，前三名将获得专属徽章</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>上榜宠物的主人可获得积分奖励</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>禁止刷票行为，一经发现将取消资格</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PetRankingsPage;
