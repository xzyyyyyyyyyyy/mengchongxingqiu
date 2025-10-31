import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../api/postService';
import { useAuth } from '../contexts/AuthContext';
import { isOwner as checkIsOwner } from '../utils/userUtils';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(id);
      // Handle both response formats for consistency
      setPost(response.data?.data || response.data);
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await postService.likePost(id);
      loadPost();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      await postService.addComment(id, commentText);
      setCommentText('');
      loadPost();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = () => {
    setEditContent(post.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    try {
      setSubmitting(true);
      await postService.updatePost(id, { content: editContent });
      setIsEditing(false);
      loadPost();
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('更新失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await postService.deletePost(id);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('删除失败，请重试');
    }
  };

  const isOwner = checkIsOwner(user, post, 'author');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">帖子不存在</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>返回</span>
        </button>

        {/* Post Content */}
        <div className="card mb-6">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={post.author?.avatar || '/default-avatar.png'}
                alt={post.author?.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-bold text-gray-900">{post.author?.username}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {post.category && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {getCategoryName(post.category)}
                </span>
              )}
              {isOwner && !isEditing && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="p-2 text-gray-600 hover:text-primary transition-colors"
                    title="编辑"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="删除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            {isEditing ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-lg"
                  rows="6"
                  placeholder="编辑内容..."
                />
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editContent.trim() || submitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? '保存中...' : '保存'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            )}
          </div>

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.hashtags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/community/hashtag/${tag}`)}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className={`grid gap-2 mb-4 ${
              post.media.length === 1 ? 'grid-cols-1' :
              post.media.length === 2 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}>
              {post.media.map((item, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleLike}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{post.likesCount || 0} 赞</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{post.commentsCount || 0} 评论</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{post.views || 0} 浏览</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">评论 ({post.commentsCount || 0})</h3>

          {/* Add Comment Form */}
          <form onSubmit={handleComment} className="mb-6">
            <div className="flex space-x-3">
              <img
                src={user?.avatar || '/default-avatar.png'}
                alt={user?.username}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的评论..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows="3"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? '发布中...' : '发布评论'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={comment.user?.avatar || '/default-avatar.png'}
                    alt={comment.user?.username}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {comment.user?.username}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">暂无评论，快来抢沙发吧！</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">确认删除</h3>
            <p className="text-gray-700 mb-6">确定要删除这篇帖子吗？此操作无法撤销。</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getCategoryName = (category) => {
  const names = {
    daily: '日常',
    medical: '医疗',
    training: '训练',
    food: '美食',
    travel: '旅行',
    funny: '搞笑',
    other: '其他',
  };
  return names[category] || category;
};

export default PostDetailPage;
