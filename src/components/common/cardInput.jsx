import React, { useRef, useState } from 'react';
import { IoMdCloudUpload } from "react-icons/io";

function cardInput() {
    const uploadRef = useRef(null);  // Reference for the file input
    const [imagePreview, setImagePreviewLocal] = useState(null);  // Local state for image preview
    
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        formik.setFieldValue(fieldName, file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewLocal(reader.result);  // Set the preview URL for the selected image
          setImagePreview(reader.result);  // Pass preview to parent component
        };
        reader.readAsDataURL(file);  // Create preview for the selected file
      }
    };
  return (
    <div className="w-full h-[230px] flex flex-col items-center">
    <div className="w-[75%] h-[30px]">
      <h1 className="text-lg font-semibold text-gray-800 tracking-wider">{label}</h1>
    </div>
    <div
      className="w-[75%] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
      onClick={() => uploadRef.current.click()}
    >
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Image Preview"
          className="object-cover w-full h-full rounded-md"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
          <IoMdCloudUpload className="text-6xl text-blue-500" />
          <p className="text-center text-xl font-semibold">
            Upload the image
          </p>
        </div>
      )}
      <input
        type="file"
        className="hidden"
        ref={uploadRef}
        onChange={handleImageChange}
      />
    </div>
    {formik.touched[fieldName] && formik.errors[fieldName] ? (
      <div className="text-red-600 text-sm">{formik.errors[fieldName]}</div>
    ) : null}
  </div>
  )
}

export default cardInput
