import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { uploadImageToCloudinary } from '../utils/cloudnary';

export interface Notice {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

interface NoticeContextType {
  notices: Notice[];
  loading: boolean;
  addNotice: (title: string, content: string, image?: File) => Promise<void>;
  updateNotice: (id: string, title: string, content: string, image?: File, keepOldImage?: boolean) => Promise<void>;
  deleteNotice: (id: string, imageUrl?: string) => Promise<void>;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export const useNotices = () => {
  const context = useContext(NoticeContext);
  if (context === undefined) {
    throw new Error('useNotices must be used within a NoticeProvider');
  }
  return context;
};

interface NoticeProviderProps {
  children: ReactNode;
}

export const NoticeProvider = ({ children }: NoticeProviderProps) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticeList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notice[];

      setNotices(noticeList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notices:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const uploadImage = async (image: File) => {
    if (!image) return undefined;

    const storageRef = ref(Storage, `notices/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    return await getDownloadURL(storageRef);
  };

  const deleteImage = async (imageUrl: string) => {
    if (!imageUrl) return;

    try {
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // const addNotice = async (title: string, content: string, image?: File) => {
  //   if (!currentUser) throw new Error("You must be logged in to add a notice");

  //   let imageUrl = undefined;

  //   if (image) {
  //     imageUrl = await uploadImage(image);
  //   }

  //   await addDoc(collection(db, 'notices'), {
  //     title,
  //     content,
  //     imageUrl,
  //     createdAt: Timestamp.now(),
  //     updatedAt: Timestamp.now(),
  //     createdBy: currentUser.uid
  //   });
  // };

  // const updateNotice = async (
  //   id: string,
  //   title: string,
  //   content: string,
  //   image?: File,
  //   keepOldImage = true
  // ) => {
  //   if (!currentUser) throw new Error("You must be logged in to update a notice");

  //   const noticeRef = doc(db, 'notices', id);
  //   const notice = notices.find(n => n.id === id);

  //   if (!notice) throw new Error("Notice not found");

  //   let imageUrl = keepOldImage ? notice.imageUrl : undefined;

  //   // Delete old image if replacing or removing
  //   if (notice.imageUrl && !keepOldImage) {
  //     await deleteImage(notice.imageUrl);
  //   }

  //   // Upload new image if provided
  //   if (image) {
  //     imageUrl = await uploadImage(image);
  //   }

  //   await updateDoc(noticeRef, {
  //     title,
  //     content,
  //     imageUrl,
  //     updatedAt: Timestamp.now()
  //   });
  // };

  const addNotice = async (title: string, content: string, image?: File) => {
    if (!currentUser) throw new Error("You must be logged in to add a notice");

    let imageUrl = undefined;

    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
    }

    await addDoc(collection(db, 'notices'), {
      title,
      content,
      imageUrl: imageUrl || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: currentUser.uid
    });
  };

  const updateNotice = async (
    id: string,
    title: string,
    content: string,
    image?: File,
    keepOldImage = true
  ) => {
    if (!currentUser) throw new Error("You must be logged in to update a notice");

    const noticeRef = doc(db, 'notices', id);
    const notice = notices.find(n => n.id === id);
    if (!notice) throw new Error("Notice not found");

    let imageUrl = keepOldImage ? notice.imageUrl : undefined;

    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
    }

    await updateDoc(noticeRef, {
      title,
      content,
      imageUrl,
      updatedAt: Timestamp.now()
    });
  };


  const deleteNotice = async (id: string, imageUrl?: string) => {
    if (!currentUser) throw new Error("You must be logged in to delete a notice");

    // Delete image if exists
    if (imageUrl) {
      await deleteImage(imageUrl);
    }

    // Delete document
    await deleteDoc(doc(db, 'notices', id));
  };

  return (
    <NoticeContext.Provider
      value={{
        notices,
        loading,
        addNotice,
        updateNotice,
        deleteNotice
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
};