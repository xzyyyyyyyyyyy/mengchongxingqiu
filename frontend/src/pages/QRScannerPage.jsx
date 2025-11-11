import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QRScannerPage = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = () => {
    setScanning(true);
    // Simulate QR code scanning
    setTimeout(() => {
      setScanning(false);
      setResult({
        type: 'product',
        id: '12345',
        name: '狗狗磨牙棒洁齿骨耐咬',
      });
    }, 2000);
  };

  const handleScanAction = () => {
    if (result) {
      if (result.type === 'product') {
        navigate(`/shop/${result.id}`);
      } else if (result.type === 'user') {
        navigate(`/profile/${result.id}`);
      } else if (result.type === 'pet') {
        navigate(`/pets/${result.id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background-light pb-20 sm:pb-6">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-text-secondary hover:text-text-primary mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1 sm:mb-2">扫一扫</h1>
          <p className="text-sm sm:text-base text-text-secondary">扫描二维码获取更多信息</p>
        </div>

        {/* Scanner Area */}
        <div className="card mb-6">
          <div className="relative aspect-square max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden">
            {scanning ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p>正在扫描...</p>
                </div>
              </div>
            ) : result ? (
              <div className="absolute inset-0 flex items-center justify-center bg-green-900/80 text-white p-6">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl font-bold mb-2">扫描成功</p>
                  <p className="text-sm opacity-80">识别到: {result.name}</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-lg">将二维码放入框内</p>
                  <p className="text-sm opacity-70 mt-2">即可自动扫描</p>
                </div>
              </div>
            )}
            
            {/* Scan Frame */}
            <div className="absolute inset-8 border-4 border-white/50 rounded-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            {result ? (
              <>
                <button
                  onClick={handleScanAction}
                  className="flex-1 btn-primary"
                >
                  查看详情
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    handleScan();
                  }}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  继续扫描
                </button>
              </>
            ) : (
              <button
                onClick={handleScan}
                disabled={scanning}
                className="w-full btn-primary disabled:opacity-50"
              >
                {scanning ? '扫描中...' : '开始扫描'}
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="card text-center py-4 sm:py-6">
            <div className="text-3xl sm:text-4xl mb-2">👥</div>
            <p className="text-xs sm:text-sm font-medium text-text-primary">添加好友</p>
          </div>
          <div className="card text-center py-4 sm:py-6">
            <div className="text-3xl sm:text-4xl mb-2">🛍️</div>
            <p className="text-xs sm:text-sm font-medium text-text-primary">商品信息</p>
          </div>
          <div className="card text-center py-4 sm:py-6">
            <div className="text-3xl sm:text-4xl mb-2">🐾</div>
            <p className="text-xs sm:text-sm font-medium text-text-primary">宠物档案</p>
          </div>
          <div className="card text-center py-4 sm:py-6">
            <div className="text-3xl sm:text-4xl mb-2">🔍</div>
            <p className="text-xs sm:text-sm font-medium text-text-primary">食品溯源</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="card mt-6">
          <h3 className="font-bold text-text-primary mb-3">使用说明</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>点击"开始扫描"按钮启动相机</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>将二维码对准扫描框</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>等待自动识别并显示结果</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>点击"查看详情"进入相应页面</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;
