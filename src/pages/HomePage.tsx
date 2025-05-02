import React from 'react';
// import { Navbar } from '../components/layout/Navbar';
import { NoticeCard } from '../components/notices/NoticeCard';
import { useNotices } from '../contexts/NoticeContext';
import { Alert } from '../components/ui/Alert';
import Image from "../assets/Clg.banner.png"

export const HomePage: React.FC = () => {
  const { notices, loading } = useNotices();

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <div className="w-full flex items-center justify-center mt-[2%]">
        <img src={Image} alt="Banner" className="h-full object-contain" />
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 mt-[2%] shadow-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Community Notice Board
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Stay updated with the latest announcements and important information
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : notices.length === 0 ? (
          <Alert variant="info" className="max-w-2xl mx-auto">
            <p>No notices have been posted yet. Check back soon for updates!</p>
          </Alert>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Notice Board. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};