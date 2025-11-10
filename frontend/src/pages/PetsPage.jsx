import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { petService } from '../api/petService';
import { getImageUrl } from '../utils/imageUtils';

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">我的宠物</h1>
            <p className="text-text-secondary">管理你的毛孩子们</p>
          </div>
          <Link
            to="/pets/new"
            className="btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>添加宠物</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Link
                key={pet._id}
                to={`/pets/${pet._id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={getImageUrl(pet.avatar) || '/default-pet.png'}
                    alt={pet.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-primary mb-1">{pet.name}</h3>
                    <p className="text-text-secondary text-sm mb-2">
                      {speciesNames[pet.species]} · {pet.breed}
                    </p>
                    {pet.birthDate && (
                      <p className="text-text-secondary text-sm">
                        {calculateAge(pet.birthDate)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {pet.health?.vaccinations?.length || 0}
                      </p>
                      <p className="text-xs text-gray-600">疫苗记录</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">
                        {pet.health?.checkups?.length || 0}
                      </p>
                      <p className="text-xs text-gray-600">体检记录</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">
                        {pet.reminders?.filter(r => !r.completed).length || 0}
                      </p>
                      <p className="text-xs text-gray-600">待办提醒</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pets.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <p className="text-gray-500 text-lg mb-4">还没有宠物档案</p>
            <Link to="/pets/new" className="btn-primary inline-block">
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
