import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { NoticeForm } from '../components/notices/NoticeForm';
import { NoticeCard } from '../components/notices/NoticeCard';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../contexts/AuthContext';
import { useNotices, Notice } from '../contexts/NoticeContext';
import { Navigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { notices, loading, addNotice, updateNotice, deleteNotice } = useNotices();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeToEdit, setNoticeToEdit] = useState<Notice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if not authenticated or not an admin
  if (!currentUser || !isAdmin) {
    return <Navigate to="/" />;
  }

  const handleAddNotice = async (formData: {
    title: string;
    content: string;
    image?: File;
  }) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await addNotice(formData.title, formData.content, formData.image);
      setSuccess('Notice posted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Error adding notice:', err);
      setError('Failed to post notice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNotice = async (formData: {
    title: string;
    content: string;
    image?: File;
    keepOldImage?: boolean;
  }) => {
    if (!noticeToEdit) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await updateNotice(
        noticeToEdit.id,
        formData.title,
        formData.content,
        formData.image,
        formData.keepOldImage ?? true
      );

      setSuccess('Notice updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setNoticeToEdit(null);
    } catch (err) {
      console.error('❌ Error updating notice:', err);
      setError('Failed to update notice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (notice: Notice) => {
    setNoticeToEdit(notice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (notice: Notice) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    try {
      await deleteNotice(notice.id, notice.imageUrl);
      setSuccess('Notice deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Error deleting notice:', err);
      setError('Failed to delete notice. Please try again.');
    }
  };

  const cancelEdit = () => {
    setNoticeToEdit(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage notices from this dashboard. Create new notices or edit existing ones.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          {/* Notice Form */}
          <div className="md:col-span-5 lg:col-span-4">
            <Card className="sticky top-8">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  {noticeToEdit ? 'Edit Notice' : 'Post New Notice'}
                </h2>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert
                    variant="error"
                    className="mb-4"
                    onClose={() => setError(null)}
                  >
                    <p>{error}</p>
                  </Alert>
                )}

                {success && (
                  <Alert
                    variant="success"
                    className="mb-4"
                    onClose={() => setSuccess(null)}
                  >
                    <p>{success}</p>
                  </Alert>
                )}

                <NoticeForm
                  notice={noticeToEdit || undefined}
                  onSubmit={noticeToEdit ? handleUpdateNotice : handleAddNotice}
                  isSubmitting={isSubmitting}
                />

                {noticeToEdit && (
                  <button
                    onClick={cancelEdit}
                    className="mt-4 text-gray-600 hover:text-gray-800"
                  >
                    Cancel Edit
                  </button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notices List */}
          <div className="md:col-span-7 lg:col-span-8">
            <h2 className="text-xl font-semibold mb-4">Manage Notices</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : notices.length === 0 ? (
              <Alert variant="info">
                <p>No notices have been posted yet. Create your first notice!</p>
              </Alert>
            ) : (
              <div className="space-y-6">
                {notices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    isAdmin={true}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
