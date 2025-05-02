// import React, { useState, useEffect, ChangeEvent } from 'react';
// import { Input } from '../ui/Input';
// import { Textarea } from '../ui/Textarea';
// import { Button } from '../ui/Button';
// import { Notice } from '../../contexts/NoticeContext';
// import { Image } from 'lucide-react';
// // import { uploadImageToCloudinary } from '../../utils/cloudnary'; // ← Added
// // import { db } from '../../firebase/config'; // ← Firebase config
// // import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'; // ← Firestore

// // interface NoticeFormProps {
// //   notice?: Notice;
// //   isSubmitting: boolean;
// //   onSubmit?: () => void; // optional callback
// // }

// interface NoticeFormProps {
//   notice?: Notice;
//   onSubmit: (formData: {
//     title: string;
//     content: string;
//     image?: File;
//     keepOldImage?: boolean;
//   }) => Promise<void>;
//   isSubmitting: boolean;
// }


// export const NoticeForm: React.FC<NoticeFormProps> = ({
//   notice,
//   isSubmitting,
//   onSubmit
// }) => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [image, setImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [keepOldImage, setKeepOldImage] = useState(true);
//   const [errors, setErrors] = useState<{
//     title?: string;
//     content?: string;
//     image?: string;
//   }>({});

//   useEffect(() => {
//     if (notice) {
//       setTitle(notice.title);
//       setContent(notice.content);
//       if (notice.imageUrl) setImagePreview(notice.imageUrl);
//     }
//   }, [notice]);

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.match('image.*')) {
//       setErrors(prev => ({ ...prev, image: 'Please select a valid image file.' }));
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setErrors(prev => ({ ...prev, image: 'Image must be under 5MB.' }));
//       return;
//     }

//     setImage(file);
//     setImagePreview(URL.createObjectURL(file));
//     setKeepOldImage(false);
//     setErrors(prev => ({ ...prev, image: undefined }));
//   };

//   const removeImage = () => {
//     setImage(null);
//     setImagePreview(null);
//     setKeepOldImage(false);
//   };

//   const validate = () => {
//     const newErrors: typeof errors = {};
//     if (!title.trim()) newErrors.title = 'Title is required';
//     if (!content.trim()) newErrors.content = 'Content is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   if (!validate()) return;

//   //   try {
//   //     let imageUrl = notice?.imageUrl || '';

//   //     if (image) {
//   //       imageUrl = await uploadImageToCloudinary(image);
//   //     } else if (!keepOldImage) {
//   //       imageUrl = ''; // cleared image
//   //     }

//   //     if (notice) {
//   //       const noticeRef = doc(db, 'notices', notice.id);
//   //       await updateDoc(noticeRef, { title, content, imageUrl });
//   //     } else {
//   //       await addDoc(collection(db, 'notices'), {
//   //         title,
//   //         content,
//   //         imageUrl,
//   //         createdAt: new Date()
//   //       });
//   //     }

//   //     if (!notice) {
//   //       setTitle('');
//   //       setContent('');
//   //       setImage(null);
//   //       setImagePreview(null);
//   //     }

//   //     onSubmit?.();
//   //   } catch (error) {
//   //     console.error('Failed to submit notice:', error);
//   //   }
//   // };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       await onSubmit?.({
//         title,
//         content,
//         image: image || undefined,
//         keepOldImage,
//       });

//       // Reset form only if adding new (not editing)
//       if (!notice) {
//         setTitle('');
//         setContent('');
//         setImage(null);
//         setImagePreview(null);
//         setKeepOldImage(true);
//       }

      
      
//     } catch (error) {
//       console.error('Failed to submit notice:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <Input
//         label="Notice Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Enter a title for your notice"
//         fullWidth
//         error={errors.title}
//         required
//       />
//       <Textarea
//         label="Notice Content"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Enter the content of your notice"
//         fullWidth
//         error={errors.content}
//         required
//       />
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Notice Image (Optional)
//         </label>
//         <div className="mt-1 flex items-center">
//           <label className="flex items-center justify-center w-32 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer">
//             <Image className="w-4 h-4 mr-2" />
//             Choose File
//             <input
//               type="file"
//               className="hidden"
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//           </label>
//           {(image || imagePreview) && (
//             <button
//               type="button"
//               onClick={removeImage}
//               className="ml-3 text-sm text-red-500 hover:text-red-700"
//             >
//               Remove
//             </button>
//           )}
//         </div>
//         {errors.image && (
//           <p className="mt-1 text-sm text-red-500">{errors.image}</p>
//         )}
//         {imagePreview && (
//           <div className="mt-3">
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="max-h-40 rounded-md"
//             />
//           </div>
//         )}
//       </div>
//       <div className="flex justify-end">
//         <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
//           {notice ? 'Update Notice' : 'Post Notice'}
//         </Button>
//       </div>
//     </form>
//   );
// };

import React, { useState, useEffect, ChangeEvent } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { Notice } from "../../contexts/NoticeContext";
import { Image } from "lucide-react";

interface NoticeFormProps {
  notice?: Notice;
  onSubmit: (formData: {
    title: string;
    content: string;
    image?: File;
    keepOldImage?: boolean;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const NoticeForm: React.FC<NoticeFormProps> = ({
  notice,
  onSubmit,
  isSubmitting,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [keepOldImage, setKeepOldImage] = useState(true);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    image?: string;
  }>({});

  // Reset form when notice prop changes
  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setContent(notice.content);
      if (notice.imageUrl) {
        setImagePreview(notice.imageUrl);
      }
    } else {
      // Clear form when notice is null
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setKeepOldImage(true);
      setErrors({});
    }
  }, [notice]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB",
      }));
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setKeepOldImage(false);
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setKeepOldImage(false);
  };

  const validate = () => {
    const newErrors: {
      title?: string;
      content?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit({
        title,
        content,
        image: image || undefined,
        keepOldImage,
      });

      // Only reset if not editing
      if (!notice) {
        setTitle("");
        setContent("");
        setImage(null);
        setImagePreview(null);
        setKeepOldImage(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Notice Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title for your notice"
        fullWidth
        error={errors.title}
        required
      />

      <Textarea
        label="Notice Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter the content of your notice"
        fullWidth
        error={errors.content}
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notice Image (Optional)
        </label>

        <div className="mt-1 flex items-center">
          <label className="flex items-center justify-center w-32 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer">
            <Image className="w-4 h-4 mr-2" />
            Choose File
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {(image || imagePreview) && (
            <button
              type="button"
              onClick={removeImage}
              className="ml-3 text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>

        {errors.image && (
          <p className="mt-1 text-sm text-red-500">{errors.image}</p>
        )}

        {imagePreview && (
          <div className="mt-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-40 rounded-md"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {notice ? "Update Notice" : "Post Notice"}
        </Button>
      </div>
    </form>
  );
};