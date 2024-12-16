import { useRef, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './App.css'
import { IoMdCloudUpload } from "react-icons/io";
import axiosUrl from './utils/axios';
import { Toaster } from 'sonner';
import { toast } from 'sonner';


function App() {
  const frontUploadRef = useRef(null);  // Separate reference for the front image input
  const backUploadRef = useRef(null);   // Separate reference for the back image input
  const [frontImagePreview, setFrontImagePreview] = useState(null);  // State for front image preview
  const [backImagePreview, setBackImagePreview] = useState(null);    // State for back image preview
  const [adhaarDetails, setAdhaardetails] = useState(null);    // State for back image preview
  const [isLoading, setIsLoading] = useState(false);    // State for back image preview
  

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      frontImage: null,
      backImage: null,
    },
    validationSchema: Yup.object({
      frontImage: Yup.mixed()
        .required('Front Image is required')
        .test(
          'fileSize',
          'File size is too large',
          (value) => value && value.size <= 2 * 1024 * 1024 // max size 2MB
        )
        .test(
          'fileType',
          'Invalid file type',
          (value) =>
            value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
        ), // only jpg, jpeg, png
      backImage: Yup.mixed()
        .required('Back Image is required')
        .test(
          'fileSize',
          'File size is too large',
          (value) => value && value.size <= 2 * 1024 * 1024 // max size 2MB
        )
        .test(
          'fileType',
          'Invalid file type',
          (value) =>
            value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
        ), // only jpg, jpeg, png
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
    
      // Check if the files are present and append to formData
      if (values.frontImage) {
        formData.append('frontImage', values.frontImage);
      } else {
        console.error('Front image is missing');
      }
    
      if (values.backImage) {
        formData.append('backImage', values.backImage);
      } else {
        console.error('Back image is missing');
      }
    
      // Log the contents of formData to verify it's being populated correctly
      for (let [key, value] of formData.entries()) {
        console.log(key, value); // Log all entries
      }
    
    
      try {
        setIsLoading(true)
        
        const response = await axiosUrl.post('/parseData', formData); // Remove 'Content-Type' header
        
        
        setAdhaardetails(response.data)
        
        
        setIsLoading(false)

    
        // Handle success response
        console.log('Parsed Data:', response.data);
      } catch (error) {
        // Handle error response
        console.error('Error parsing Aadhaar data:', error);
        toast.error('Failed to parse Aadhaar data. Please recheck the uploaded images.')
        setIsLoading(false)
       
      }
    },
  });

  // Handle Front Image Upload and Preview
  const handleFrontImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('frontImage', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontImagePreview(reader.result);  // Set the preview URL for front image
      };
      reader.readAsDataURL(file);  // Create preview for the selected file
    }
  };

  // Handle Back Image Upload and Preview
  const handleBackImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('backImage', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackImagePreview(reader.result);  // Set the preview URL for back image
      };
      reader.readAsDataURL(file);  // Create preview for the selected file
    }
  };

  return (
    <>
    <Toaster position="top-center" expand={false} richColors />
  <div className="h-auto w-full flex">
    <form
      onSubmit={formik.handleSubmit} // Attach Formik's submit handler
      className="h-screen bg-gray-50 w-[35%] flex flex-col justify-center space-y-8 p-6"
    >
      {/* Front Image */}
      <div className="w-full h-[230px] flex flex-col items-center">
        <div className="w-[75%] h-[30px]">
          <h1 className="text-lg font-semibold text-gray-800 tracking-wider">
            Aadhaar Front Image
          </h1>
        </div>
        <div
          className="w-[75%] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
          onClick={() => frontUploadRef.current.click()}
        >
          {frontImagePreview ? (
            <img
              src={frontImagePreview}
              alt="Front Preview"
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
            ref={frontUploadRef}
            onChange={handleFrontImageChange}
          />
        </div>
        {formik.touched.frontImage && formik.errors.frontImage ? (
          <div className="text-red-600 text-sm">{formik.errors.frontImage}</div>
        ) : null}
      </div>

      {/* Back Image */}
      <div className="w-full h-[230px] flex flex-col items-center">
        <div className="w-[75%] h-[30px]">
          <h1 className="text-lg font-semibold text-gray-800 tracking-wider">
            Aadhaar Back Image
          </h1>
        </div>
        <div
          className="w-[75%] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
          onClick={() => backUploadRef.current.click()}
        >
          {backImagePreview ? (
            <img
              src={backImagePreview}
              alt="Back Preview"
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
            ref={backUploadRef}
            onChange={handleBackImageChange}
          />
        </div>
        {formik.touched.backImage && formik.errors.backImage ? (
          <div className="text-red-600 text-sm">{formik.errors.backImage}</div>
        ) : null}
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-center mt-6">
        <button
          type="submit" // Ensure the button is a submit button
          className="bg-blue-600 py-2 px-4 h-[40px] w-[75%] rounded-lg text-white font-semibold hover:bg-blue-700 transition-all"
        >
          Parse Aadhaar
        </button>
      </div>
    </form>

    <div className="h-auto bg-gray-200 w-[65%] flex items-center">
      {isLoading ? (
        <div className="flex w-full h-[80%] justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="w-full h-[80%] flex flex-col space-y-4 p-4">
          <div className="text-2xl font-bold text-gray-800">
            <h1>Parsed Details</h1>
          </div>
          <div className="grid grid-cols-2 grid-rows-3 gap-6">
            <div className="p-4 rounded-lg bg-white shadow-lg">
              <label className="block text-gray-700 text-lg font-semibold">Name</label>
              <p className="border-b-2 border-gray-400 pb-1">{adhaarDetails?.name || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-lg">
              <label className="block text-gray-700 text-lg font-semibold">
                Aadhaar Number
              </label>
              <p className="border-b-2 border-gray-400 pb-1">{adhaarDetails?.aadharNumber || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-lg">
              <label className="block text-gray-700 text-lg font-semibold">
                Date of Birth
              </label>
              <p className="border-b-2 border-gray-400 pb-1">{adhaarDetails?.dob || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-lg">
              <label className="block text-gray-700 text-lg font-semibold">Gender</label>
              <p className="border-b-2 border-gray-400 pb-1">{adhaarDetails?.gender || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-lg">
              <label className="block text-gray-700 text-lg font-semibold">Pincode</label>
              <p className="border-b-2 border-gray-400 pb-1">{adhaarDetails?.pin || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-lg">
              <label className="block text-gray-700 text-lg font-semibold">Age</label>
              <p className="border-b-2 border-gray-400 pb-1">{adhaarDetails?.age || 'N/A'}</p>
            </div>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-lg">
            <label className="block text-gray-700 text-lg font-semibold">Address</label>
            <p className="border-b-2 border-gray-400 pb-1">{adhaarDetails?.address || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  </div>
</>


  );
}

export default App;
