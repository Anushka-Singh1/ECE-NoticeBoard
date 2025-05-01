import React, { useState } from 'react';
import { Link } from "react-router-dom"; 
import { Card, CardContent, CardFooter } from '../ui/Card';
import { formatDistance } from '../../utils/dateUtils';
import { Notice } from '../../contexts/NoticeContext';

interface NoticeCardProps {
  notice: Notice;
  isAdmin?: boolean;
  onEdit?: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  notice,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
   
    <Card className="mb-6 transition-all duration-300 hover:shadow-lg">
       <Link to={`/notice/${notice.id}`}>
        <CardContent className="p-0">
          {/* {notice.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={notice.imageUrl} 
              alt={notice.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )} */}
          {notice.imageUrl && (
            <>
              <div
                className="aspect-video w-full overflow-hidden cursor-pointer"
                onClick={() => setIsImageOpen(true)}
              >
                <img
                  src={notice.imageUrl}
                  alt={notice.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {isImageOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                  onClick={() => setIsImageOpen(false)} // Close on click
                >
                  <img
                    src={notice.imageUrl}
                    alt={notice.title}
                    className="max-w-full max-h-full rounded-lg shadow-lg"
                    onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
                  />
                </div>
              )}
            </>
          )}

          <div className="p-4 h-[calc(100%-aspect-ratio)]">
            <h2 className="text-xl font-bold mb-3">{notice.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-3">
              {notice.content}
            </p>
          </div>
        </CardContent>
          </Link>
        <CardFooter className="bg-gray-50 flex justify-between items-center text-sm text-gray-500">
          <span>Posted {formatDistance(notice.createdAt.toDate())}</span>
          {isAdmin && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit && onEdit(notice)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete && onDelete(notice)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </CardFooter>
      </Card>
   
  );
};