// import axios from 'axios';

// export const uploadImageToCloudinary = async (image: File): Promise<string> => {
//   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//   const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

//   const formData = new FormData();
//   formData.append('file', image);
//   formData.append('upload_preset', uploadPreset);

//   const response = await axios.post(
//     `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//     formData
//   );

//   return response.data.secure_url;
// };


export const uploadImageToCloudinary = async (image: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', uploadPreset);
  
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      console.error('Cloudinary upload failed:', data);
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }
  
    return data.secure_url;
  };
  