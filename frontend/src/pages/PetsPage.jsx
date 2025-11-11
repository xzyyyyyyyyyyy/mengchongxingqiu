import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { petService } from '../api/petService';
import { getImageUrl } from '../utils/imageUtils';

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interactionPet, setInteractionPet] = useState(null);
  const [interactionType, setInteractionType] = useState(null);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      const response = await petService.getPets();
      setPets(response.data);
    } catch (error) {
      console.error('Failed to load pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = (petId, type) => {
    setInteractionPet(petId);
    setInteractionType(type);
    
    // Show animation for 2 seconds
    setTimeout(() => {
      setInteractionPet(null);
      setInteractionType(null);
    }, 2000);
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

  const interactionMessages = {
    pet: ['😸 好舒服~', '🥰 开心~', '😊 真好~'],
    feed: ['😋 真好吃!', '🤤 太棒了!', '😍 还要!'],
    play: ['🎾 好玩!', '🎉 太开心了!', '😆 再来!']
  };

  return (
    <div className="min-h-screen bg-background-light pb-20 sm:pb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1 sm:mb-2">我的宠物</h1>
            <p className="text-sm sm:text-base text-text-secondary">管理你的毛孩子们</p>
          </div>
          <Link
            to="/pets/new"
            className="btn-primary flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">添加宠物</span>
            <span className="sm:hidden">添加</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="card hover:shadow-lg transition-shadow relative overflow-hidden"
              >
                {/* Interaction Animation */}
                {interactionPet === pet._id && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10 animate-pulse">
                    <div className="text-4xl sm:text-6xl">
                      {interactionMessages[interactionType][Math.floor(Math.random() * 3)]}
                    </div>
                  </div>
                )}

                <Link to={`/pets/${pet._id}`} className="block">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <img
                      src={getImageUrl(pet.avatar) || '/default-pet.png'}
                      alt={pet.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-1 truncate">{pet.name}</h3>
                      <p className="text-text-secondary text-xs sm:text-sm mb-1 sm:mb-2">
                        {speciesNames[pet.species]} · {pet.breed}
                      </p>
                      {pet.birthDate && (
                        <p className="text-text-secondary text-xs sm:text-sm">
                          {calculateAge(pet.birthDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Virtual Pet Interactions */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">🎮 AI虚拟互动</p>
                  <div className="flex justify-around gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleInteraction(pet._id, 'pet');
                      }}
                      className="flex flex-col items-center flex-1 py-2 px-1 sm:px-2 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                    >
                      <span className="text-xl sm:text-2xl mb-1">🤚</span>
                      <span className="text-xs sm:text-sm font-medium text-pink-600">抚摸</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleInteraction(pet._id, 'feed');
                      }}
                      className="flex flex-col items-center flex-1 py-2 px-1 sm:px-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                      <span className="text-xl sm:text-2xl mb-1">🍖</span>
                      <span className="text-xs sm:text-sm font-medium text-orange-600">喂食</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleInteraction(pet._id, 'play');
                      }}
                      className="flex flex-col items-center flex-1 py-2 px-1 sm:px-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <span className="text-xl sm:text-2xl mb-1">🎾</span>
                      <span className="text-xs sm:text-sm font-medium text-blue-600">玩耍</span>
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        {pet.health?.vaccinations?.length || 0}
                      </p>
                      <p className="text-xs text-gray-600">疫苗记录</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-secondary">
                        {pet.health?.checkups?.length || 0}
                      </p>
                      <p className="text-xs text-gray-600">体检记录</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-accent">
                        {pet.reminders?.filter(r => !r.completed).length || 0}
                      </p>
                      <p className="text-xs text-gray-600">待办提醒</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pets.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl sm:text-6xl mb-4">🐾</div>
            <p className="text-gray-500 text-base sm:text-lg mb-4">还没有宠物档案</p>
            <Link to="/pets/new" className="btn-primary inline-block text-sm sm:text-base">
              添加你的第一个宠物
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();

  if (years > 0) {
    return `${years}岁${months > 0 ? months + '个月' : ''}`;
  } else {
    return `${months}个月`;
  }
}

export default PetsPage;
