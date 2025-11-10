import { useState } from 'react';

const PetDocumentsPage = () => {
  const [documents] = useState([
    {
      id: 1,
      type: 'vaccine',
      petName: '小橘',
      title: '疫苗接种证明',
      date: '2024-05-15',
      expiryDate: '2025-05-15',
      fileUrl: '/uploads/docs/vaccine1.pdf',
      thumbnail: 'https://via.placeholder.com/200x150?text=Vaccine',
      icon: '💉',
    },
    {
      id: 2,
      type: 'quarantine',
      petName: '旺财',
      title: '动物检疫合格证明',
      date: '2024-06-20',
      expiryDate: '2025-06-20',
      fileUrl: '/uploads/docs/quarantine1.pdf',
      thumbnail: 'https://via.placeholder.com/200x150?text=Quarantine',
      icon: '🏥',
    },
    {
      id: 3,
      type: 'chip',
      petName: '小橘',
      title: '电子芯片登记证',
      date: '2023-08-10',
      expiryDate: null,
      fileUrl: '/uploads/docs/chip1.pdf',
      thumbnail: 'https://via.placeholder.com/200x150?text=Chip',
      icon: '🔖',
    },
    {
      id: 4,
      type: 'insurance',
      petName: '旺财',
      title: '宠物医疗保险单',
      date: '2024-01-01',
      expiryDate: '2025-01-01',
      fileUrl: '/uploads/docs/insurance1.pdf',
      thumbnail: 'https://via.placeholder.com/200x150?text=Insurance',
      icon: '🛡️',
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = [
    { id: 'all', name: '全部', icon: '📁' },
    { id: 'vaccine', name: '疫苗证明', icon: '💉' },
    { id: 'quarantine', name: '检疫证明', icon: '🏥' },
    { id: 'chip', name: '芯片证明', icon: '🔖' },
    { id: 'insurance', name: '保险单', icon: '🛡️' },
    { id: 'license', name: '养犬证', icon: '📜' },
  ];

  const filteredDocs = selectedCategory === 'all'
    ? documents
    : documents.filter(doc => doc.type === selectedCategory);

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">已过期</span>;
    } else if (diffDays < 30) {
      return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">即将过期</span>;
    }
    return <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">有效</span>;
  };

  const handleUpload = () => {
    setShowUploadModal(false);
    alert('文件上传成功！');
  };

  const handleDownload = (doc) => {
    alert(`开始下载: ${doc.title}`);
  };

  const handleShare = (doc) => {
    alert(`分享: ${doc.title}`);
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">📂 宠物证件夹</h1>
            <p className="text-text-secondary">安全保管宠物的重要证件</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>📤</span>
            <span>上传证件</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="text-3xl mb-2">📁</div>
            <div className="text-2xl font-bold text-primary">{documents.length}</div>
            <div className="text-sm text-text-secondary">总证件数</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-primary">
              {documents.filter(d => {
                if (!d.expiryDate) return true;
                return new Date(d.expiryDate) > new Date();
              }).length}
            </div>
            <div className="text-sm text-text-secondary">有效证件</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-primary">
              {documents.filter(d => {
                if (!d.expiryDate) return false;
                const days = (new Date(d.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
                return days > 0 && days < 30;
              }).length}
            </div>
            <div className="text-sm text-text-secondary">即将过期</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-red-50 to-pink-50">
            <div className="text-3xl mb-2">❌</div>
            <div className="text-2xl font-bold text-primary">
              {documents.filter(d => {
                if (!d.expiryDate) return false;
                return new Date(d.expiryDate) < new Date();
              }).length}
            </div>
            <div className="text-sm text-text-secondary">已过期</div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-text-secondary hover:bg-gray-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="card hover:shadow-xl transition-all">
              {/* Thumbnail */}
              <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center text-6xl">
                {doc.icon}
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-text-primary">{doc.title}</h3>
                    {getExpiryStatus(doc.expiryDate)}
                  </div>
                  <div className="text-sm text-text-secondary space-y-1">
                    <div>🐾 {doc.petName}</div>
                    <div>📅 签发: {doc.date}</div>
                    {doc.expiryDate && <div>⏰ 有效至: {doc.expiryDate}</div>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex-1 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                  >
                    📥 下载
                  </button>
                  <button
                    onClick={() => handleShare(doc)}
                    className="flex-1 py-2 bg-gray-100 text-text-secondary rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    📤 分享
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
          <h3 className="text-lg font-bold text-text-primary mb-4">💡 使用建议</h3>
          <div className="space-y-2 text-text-secondary">
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>及时上传宠物的重要证件照片或扫描件，以备不时之需</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>定期检查证件有效期，避免过期影响宠物出行或就医</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>外出旅行或看病时，可以快速分享给兽医或相关部门</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>所有文件采用加密存储，保障您和宠物的隐私安全</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">上传证件</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">证件类型</label>
                <select className="input-field w-full">
                  {categories.filter(c => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">宠物</label>
                <select className="input-field w-full">
                  <option value="1">小橘</option>
                  <option value="2">旺财</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">证件标题</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="例如：狂犬疫苗接种证明"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">签发日期</label>
                <input type="date" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">有效期至（可选）</label>
                <input type="date" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">上传文件</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  <div className="text-4xl mb-2">📤</div>
                  <div className="text-sm text-text-secondary">点击或拖拽文件到这里</div>
                  <div className="text-xs text-text-secondary mt-1">支持 JPG、PNG、PDF 格式</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                上传
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDocumentsPage;
