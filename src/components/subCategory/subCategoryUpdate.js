import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const SubCategoryUpdate = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categoryNames, setCategoryNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const categoryNameRef = useRef(null);
  const subCategoryNameRef = useRef(null);
  const subCategoryStatusRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubcategories();
    fetchCategoryNames(); 
  // eslint-disable-next-line no-use-before-define
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(
        "https://ecommerce-backend-fm0r.onrender.com/subcategory/"
      );
      const data = await response.json();
      setSubcategories(data.allSubCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

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

  const handleUpdate = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowUpdateModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      setDeleteLoading(true); // Set delete loading to true
      const response = await fetch(
        `https://ecommerce-backend-fm0r.onrender.com/subcategory/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to the request
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete subcategory");
      }
      // Remove the deleted subcategory from the state
      setSubcategories((prevSubcategories) =>
        prevSubcategories.filter((subcategory) => subcategory._id !== id)
      );
      toast.success("Subcategory deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete subcategory");
    } finally {
      setDeleteLoading(false); // Set delete loading back to false after operation completes
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    const formData = new FormData();
    formData.append("image", e.target.elements.image.files[0]);
    formData.append("categoryName", categoryNameRef.current.value);
    formData.append("subCategoryName", subCategoryNameRef.current.value);
    formData.append("subCategoryStatus", subCategoryStatusRef.current.value);

    try {
      const token = sessionStorage.getItem("adminToken");

      const response = await fetch(
        `https://ecommerce-backend-fm0r.onrender.com/subcategory/${selectedSubcategory._id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update subcategory");
      }
      setShowUpdateModal(false);
      toast.success("Subcategory updated successfully");
      fetchSubcategories(); // Refresh subcategories after successful update
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subcategory");
    } finally {
      setUpdateLoading(false); // Set update loading back to false after operation completes
    }
  };

  const navigateToImagesPage = () => {
    // Navigate to the page where you can view images
    navigate("subcategory/create");
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div>
      <button
        onClick={navigateToImagesPage}
        className="m-3 py-3 px-5 bg-blue-500 text-white font-bold rounded focus:outline-none focus:shadow-outline"
      >
        Back to Upload File
      </button>
      <div className="flex flex-wrap justify-center">
        {loading ? (
          <ThreeDots color="#0c6602" height={50} width={50} />
        ) : (
          subcategories.map((subcategory, index) => (
            <div key={index} className="max-w-xs mx-4 my-4">
              <img
                src={subcategory.subCategoryUrl}
                alt="User"
                className="rounded-lg w-full h-full object-cover"
                style={{ width: "300px", height: "300px" }}
              />
              <div className="mt-2">
                <p className="font-bold uppercase">
                  {subcategory.subCategoryName}
                </p>
                <p className="text-xl">
                  <span className="text-green-800 font-semibold text-xl capitalize">
                    {subcategory.subCategoryStatus}
                  </span>
                </p>
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => handleUpdate(subcategory)}
                  className="mr-2 bg-blue-500 text-white py-1 px-3 rounded"
                >
                  {updateLoading && selectedSubcategory === subcategory ? (
                    <TailSpin color="#FFFFFF" height={20} width={20} />
                  ) : (
                    "Update"
                  )}
                </button>
                <button
                  onClick={() => handleDelete(subcategory._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  {deleteLoading && selectedSubcategory === subcategory ? (
                    <TailSpin color="#FFFFFF" height={20} width={20} />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          ))
        )}
        {showUpdateModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Update Subcategory</h2>
              <form onSubmit={handleSubmitUpdate}>
                <input type="file" name="image" accept="image/*" />
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  required
                  ref={subCategoryNameRef}
                  className="mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Subcategory Status"
                  required
                  ref={subCategoryStatusRef}
                  className="mb-4 p-2 border border-gray-300 rounded"
                />
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  ref={categoryNameRef}
                >
                  <option value="">Select a category</option>
                  {categoryNames.map((category) => (
                    <option key={category._id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="mr-2 bg-blue-500 text-white py-1 px-3 rounded"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-1 px-3 rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default SubCategoryUpdate;
