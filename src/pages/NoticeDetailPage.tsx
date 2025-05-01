import React from "react";
import { useParams } from "react-router-dom";
import { useNotices } from "../contexts/NoticeContext";
import { formatDistance } from "../utils/dateUtils";

export const NoticeDetailPage: React.FC = () => {
  const { id } = useParams();
  const { notices } = useNotices();
  const notice = notices.find((n) => n.id === id);

  if (!notice) return <p className="text-center mt-10">Notice not found.</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{notice.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Posted {formatDistance(notice.createdAt.toDate())}
      </p>
      {notice.imageUrl && (
        <img
          src={notice.imageUrl}
          alt={notice.title}
          className="w-full rounded-lg shadow mb-6"
        />
      )}
      <p className="whitespace-pre-line text-gray-800">{notice.content}</p>
    </div>
  );
};
