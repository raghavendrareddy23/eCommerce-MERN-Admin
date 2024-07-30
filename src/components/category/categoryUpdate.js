import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const CategoryUpdate = () => {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const categoryNameRef = useRef(null); // Ref for categoryName input
  const categoryStatusRef = useRef(null); // Ref for categoryStatus input

  const { id } = useParams(); // Correct syntax: { id }

  const navigate = useNavigate();

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch(
          "https://ecommerce-backend-fm0r.onrender.com/category"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        const data = await response.json();
        setImageData(data.allCategories);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error("Failed to fetch image data");
      }
    };

    fetchImageData();
  }, [id]);

  const handleUpdate = (id) => {
    setSelectedImageId(id);
    setShowUpdateModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      setDeleteLoading(true);
      const response = await fetch(
        `https://ecommerce-backend-fm0r.onrender.com/category/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete image");
      }
      setImageData((prevImageData) =>
        prevImageData.filter((image) => image._id !== id)
      );
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    const formData = new FormData();
    formData.append("image", e.target.elements.image.files[0]);
    formData.append("categoryName", categoryNameRef.current.value); // Access value from ref
    formData.append("categoryStatus", categoryStatusRef.current.value); // Access value from ref

    try {
      const token = sessionStorage.getItem("adminToken");
      const response = await fetch(
        `https://ecommerce-backend-fm0r.onrender.com/category/${selectedImageId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update Category");
      }
      setShowUpdateModal(false);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Category");
    } finally {
      setUpdateLoading(false);
    }
  };

  const navigateToImagesPage = () => {
    navigate("/create");
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
          imageData.map((image) => (
            <div key={image._id} className="max-w-xs mx-4 my-4">
              <img
                src={image.categoryUrl}
                alt="User"
                className="rounded-lg w-full h-full object-cover"
                style={{ width: "300px", height: "300px" }}
              />
              <div className="mt-2">
                <p className="font-bold uppercase">{image.categoryName}</p>
                <p className="text-xl">
                  <span className="text-green-800 font-semibold text-xl capitalize">
                    {image.categoryStatus}
                  </span>
                </p>
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => handleUpdate(image._id)}
                  className="mr-2 bg-blue-500 text-white py-1 px-3 rounded"
                >
                  {updateLoading && selectedImageId === image._id ? (
                    <TailSpin color="#FFFFFF" height={20} width={20} />
                  ) : (
                    "Update"
                  )}
                </button>
                <button
                  onClick={() => handleDelete(image._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  {deleteLoading && selectedImageId === image._id ? (
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
              <h2 className="text-lg font-semibold mb-2">Update Image</h2>
              <form onSubmit={handleSubmitUpdate}>
                <input type="file" name="image" accept="image/*" />
                <input
                  type="text"
                  ref={categoryNameRef} // Assign ref to input
                  placeholder="Category Name"
                  required
                  className="mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  ref={categoryStatusRef} // Assign ref to input
                  placeholder="Category Status"
                  required
                  className="mb-4 p-2 border border-gray-300 rounded"
                />
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

export default CategoryUpdate;
