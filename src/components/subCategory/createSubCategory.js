import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

const SubCategoryUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryNames, setCategoryNames] = useState([]);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setPreview(URL.createObjectURL(selectedImage));
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };
  const handleSubCategoryNameChange = (e) => {
    setSubCategoryName(e.target.value);
  };

  const handleUpload = async () => {
    if (!image) {
      setErrorMessage("Please select an image");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("categoryName", categoryName);
    formData.append("subCategoryName", subCategoryName);

    try {
      const token = sessionStorage.getItem("adminToken"); // Retrieve token from sessionStorage

      const response = await axios.post(
        "https://ecommerce-backend-fm0r.onrender.com/subcategory/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Attach token to the request
          },
        }
      );

      console.log(response.allSubCategories);
      toast.success("Image uploaded successfully");
      // Handle successful upload, e.g., show success message or redirect
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Error uploading image. Please try again later.");
      toast.error("Error uploading image. Please try again later.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchCategoryNames();
    // eslint-disable-next-line no-use-before-define
  }, []);

  const fetchCategoryNames = async () => {
    try {
      const response = await fetch(
        "https://ecommerce-backend-fm0r.onrender.com/category/"
      );
      const data = await response.json();

      setCategoryNames(data.allCategories);
    } catch (error) {
      console.error("Error fetching category names:", error);
    }
  };

  const navigateToImagesPage = () => {
    // Navigate to the page where you can view images
    navigate("/subcategories");
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md mt-6">
      <h2 className="text-lg font-bold mb-4">Upload Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      <select
        value={categoryName}
        onChange={handleCategoryNameChange}
        className="mb-4 p-2 border border-gray-300 rounded"
        required
      >
        <option value="">Select a category</option>
        {categoryNames.map((category) => (
          <option key={category._id} value={category.categoryName}>
            {category.categoryName}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={subCategoryName}
        onChange={handleSubCategoryNameChange}
        placeholder="SubCategory Name"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      {preview && (
        <img src={preview} alt="Preview" className="mb-4 max-w-full" />
      )}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          uploading && "opacity-50 cursor-not-allowed"
        }`}
      >
        {uploading ? (
          <div className="flex justify-center items-center">
            <TailSpin color="#FFFFFF" height={20} width={20} />
          </div>
        ) : (
          "Upload Image"
        )}
      </button>
      <button
        onClick={navigateToImagesPage}
        className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        View Sub Categories
      </button>
      <ToastContainer />
    </div>
  );
};

export default SubCategoryUpload;
