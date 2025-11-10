import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';

const HelpPage = () => {
  const navigate = useNavigate();
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // TODO: Implement feedback submission
    alert('感谢您的反馈！我们会认真处理。');
    setFeedbackText('');
    setShowFeedbackForm(false);
  };

  const faqItems = [
    {
      question: '如何添加宠物档案？',
      answer: '在"我的宠物"页面，点击右上角的"+"按钮，填写宠物的基本信息即可添加新的宠物档案。'
    },
    {
      question: '如何发布帖子？',
      answer: '点击页面底部中央的"+"按钮，选择分类和话题，输入内容后即可发布。'
    },
    {
      question: '健康记录如何使用？',
      answer: '进入宠物详情页，点击"AI健康管家"按钮，您可以记录每日健康数据、查看健康趋势和AI预警。'
    },
    {
      question: '如何预约服务？',
      answer: '在"服务"页面浏览各类宠物服务，选择心仪的服务后点击"立即预约"即可。'
    },
    {
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入注册邮箱，我们会发送重置链接到您的邮箱。'
    }
  ];

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
            <h1 className="text-xl font-bold text-center flex-1">帮助与反馈</h1>
            <div className="w-8"></div>
          </div>
        </div>

        <main className="p-4 space-y-6">
          {/* Self-Service Section */}
          <section>
            <h2 className="px-2 pb-3 text-lg font-bold">自助服务</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">help_outline</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-base font-medium">常见问题</p>
                  <p className="text-sm text-gray-500">解答您在使用中的常见疑问</p>
                </div>
                <span className="material-symbols-outlined text-xl text-gray-400">chevron_right</span>
              </button>

              <button className="w-full flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <span className="material-symbols-outlined text-2xl">play_circle</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-base font-medium">视频教程</p>
                  <p className="text-sm text-gray-500">观看视频快速上手各项功能</p>
                </div>
                <span className="material-symbols-outlined text-xl text-gray-400">chevron_right</span>
              </button>
            </div>
          </section>

          {/* Contact Us Section */}
          <section>
            <h2 className="px-2 pb-3 text-lg font-bold">联系我们</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <span className="material-symbols-outlined text-2xl">email</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium">客服邮箱</p>
                  <p className="text-sm text-gray-500">support@mengchong.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <span className="material-symbols-outlined text-2xl">phone</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium">客服热线</p>
                  <p className="text-sm text-gray-500">400-888-8888</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <span className="material-symbols-outlined text-2xl">schedule</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium">工作时间</p>
                  <p className="text-sm text-gray-500">周一至周日 9:00-21:00</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="px-2 pb-3 text-lg font-bold">常见问题</h2>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <details key={index} className="rounded-lg bg-white p-4 shadow-sm">
                  <summary className="cursor-pointer font-medium text-gray-800 list-none flex items-center justify-between">
                    {item.question}
                    <span className="material-symbols-outlined text-gray-400">expand_more</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Feedback Section */}
          <section>
            <h2 className="px-2 pb-3 text-lg font-bold">意见反馈</h2>
            {!showFeedbackForm ? (
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="w-full flex items-center justify-center gap-3 rounded-lg bg-primary text-white p-4 shadow-sm hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">rate_review</span>
                <span className="text-base font-medium">提交反馈</span>
              </button>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="rounded-lg bg-white p-4 shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    反馈类型
                  </label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="suggestion">功能建议</option>
                    <option value="bug">问题反馈</option>
                    <option value="praise">表扬鼓励</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    详细描述
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows="5"
                    required
                    placeholder="请详细描述您的问题或建议..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    maxLength="500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {feedbackText.length}/500
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFeedbackForm(false);
                      setFeedbackText('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    提交
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* App Info */}
          <section className="text-center text-sm text-gray-500 pb-4">
            <p>萌宠星球 v1.0.0</p>
            <p className="mt-2">
              <a href="#" className="text-primary hover:underline">用户协议</a>
              {' · '}
              <a href="#" className="text-primary hover:underline">隐私政策</a>
            </p>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default HelpPage;
