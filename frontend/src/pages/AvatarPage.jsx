import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';

const AvatarPage = () => {
  const navigate = useNavigate();
  // const { petId } = useParams(); // Reserved for future use with useParams from 'react-router-dom'
  const [selectedStyle, setSelectedStyle] = useState('cartoon');
  const [activeTab, setActiveTab] = useState('generate');
  const [uploadedImage, setUploadedImage] = useState(null);

  const styles = [
    { id: 'cartoon', name: '卡通风', preview: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop' },
    { id: 'cute', name: 'Q版可爱', preview: 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=200&h=200&fit=crop' },
    { id: 'realistic', name: '写实感', preview: 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=200&h=200&fit=crop' },
    { id: 'chinese', name: '中国风', preview: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop' },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    alert('AI形象生成功能即将上线！\n此功能需要接入AI图像生成服务。');
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
            <h1 className="text-xl font-bold text-center flex-1">AI 虚拟形象</h1>
            <button className="text-gray-600 hover:text-gray-900">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Interactive Pet Display */}
          <div className="relative w-full bg-gradient-to-b from-pink-50 to-white rounded-xl min-h-80 flex flex-col justify-end overflow-hidden shadow-sm mb-4">
            {uploadedImage ? (
              <img 
                src={uploadedImage} 
                alt="Uploaded pet" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-80">
                <div className="text-center">
                  <span className="material-symbols-outlined text-9xl text-gray-300">pets</span>
                  <p className="text-gray-500 mt-4">上传照片生成虚拟形象</p>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <div className="flex justify-between items-center gap-2">
                <button className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full h-10 px-4 gap-1.5 shadow-sm hover:bg-white">
                  <span className="material-symbols-outlined text-secondary text-lg">pets</span>
                  <span className="text-sm font-medium">抚摸</span>
                </button>
                <button className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full h-10 px-4 gap-1.5 shadow-sm hover:bg-white">
                  <span className="material-symbols-outlined text-secondary text-lg">lunch_dining</span>
                  <span className="text-sm font-medium">喂食</span>
                </button>
                <button className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full h-10 px-4 gap-1.5 shadow-sm hover:bg-white">
                  <span className="material-symbols-outlined text-secondary text-lg">sports_esports</span>
                  <span className="text-sm font-medium">玩耍</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`flex-1 pb-3 pt-3 text-base font-bold border-b-2 ${
                activeTab === 'generate' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('generate')}
            >
              形象生成
            </button>
            <button
              className={`flex-1 pb-3 pt-3 text-base font-medium border-b-2 ${
                activeTab === 'scenes' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('scenes')}
            >
              互动场景
            </button>
            <button
              className={`flex-1 pb-3 pt-3 text-base font-medium border-b-2 ${
                activeTab === 'diary' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('diary')}
            >
              心情日记
            </button>
          </div>

          {/* Generate Tab Content */}
          {activeTab === 'generate' && (
            <div className="space-y-6">
              {/* Image Upload Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-[2/1] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-lg font-bold text-gray-800">上传一张爱宠照片</p>
                  <p className="text-gray-600 mb-3">生成专属虚拟形象</p>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-full bg-primary/10 hover:bg-primary/20 text-primary text-center py-2 rounded-lg cursor-pointer transition-colors">
                      选择照片
                    </div>
                  </label>
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <h3 className="text-lg font-bold mb-3">选择风格</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className="flex flex-col items-center gap-2 flex-shrink-0"
                    >
                      <div 
                        className={`w-20 h-20 rounded-xl bg-cover bg-center border-2 ${
                          selectedStyle === style.id ? 'border-primary' : 'border-transparent'
                        } shadow-sm`}
                        style={{ backgroundImage: `url(${style.preview})` }}
                      />
                      <span className={`text-sm font-medium ${
                        selectedStyle === style.id ? 'text-primary' : 'text-gray-500'
                      }`}>
                        {style.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail Adjustments */}
              <div>
                <h3 className="text-lg font-bold mb-3">细节调整</h3>
                <div className="space-y-3">
                  <button className="w-full bg-white rounded-xl p-4 shadow-sm flex justify-between items-center hover:bg-gray-50">
                    <span className="font-medium">毛色</span>
                    <span className="material-symbols-outlined text-gray-500">expand_more</span>
                  </button>
                  <button className="w-full bg-white rounded-xl p-4 shadow-sm flex justify-between items-center hover:bg-gray-50">
                    <span className="font-medium">可爱配饰</span>
                    <span className="material-symbols-outlined text-gray-500">expand_more</span>
                  </button>
                  <button className="w-full bg-white rounded-xl p-4 shadow-sm flex justify-between items-center hover:bg-gray-50">
                    <span className="font-medium">面部表情</span>
                    <span className="material-symbols-outlined text-gray-500">expand_more</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pb-4">
                <button
                  onClick={handleGenerate}
                  className="w-full flex items-center justify-center h-14 bg-primary text-white rounded-full text-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
                >
                  立即生成
                </button>
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex flex-col items-center justify-center h-14 bg-white rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50">
                    <span className="material-symbols-outlined text-secondary text-2xl">account_circle</span>
                    <span>设为头像</span>
                  </button>
                  <button className="flex flex-col items-center justify-center h-14 bg-white rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50">
                    <span className="material-symbols-outlined text-yellow-500 text-2xl">add_reaction</span>
                    <span>添加表情</span>
                  </button>
                  <button className="flex flex-col items-center justify-center h-14 bg-white rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50">
                    <span className="material-symbols-outlined text-gray-500 text-2xl">download</span>
                    <span>保存本地</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Scenes Tab */}
          {activeTab === 'scenes' && (
            <div className="space-y-4">
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">theater_comedy</span>
                <p className="text-gray-500 mb-2">互动场景功能即将上线</p>
                <p className="text-sm text-gray-400">让您的虚拟宠物在不同场景中互动</p>
              </div>
            </div>
          )}

          {/* Diary Tab */}
          {activeTab === 'diary' && (
            <div className="space-y-4">
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">book</span>
                <p className="text-gray-500 mb-2">虚拟形象日记即将上线</p>
                <p className="text-sm text-gray-400">记录您的虚拟宠物每一天</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AvatarPage;
