import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    subCategoryName: "",
    productName: "",
    productDescription: "",
    price: "",
    sellPrice: "",
    stock: "",
    images: [],
  });

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubcategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-backend-fm0r.onrender.com/subcategory/"
      );
      const data = response.data.allSubCategories;
      setSubCategories(data);
      // console.log(subCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("adminToken");

    try {
      setLoading(true);

      const formData = new FormData(e.target);

      const response = await axios.post(
        "https://ecommerce-backend-fm0r.onrender.com/product/uploadImage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Product created successfully");
        setFormData({
          subCategoryName: "",
          productName: "",
          productDescription: "",
          price: "",
          sellPrice: "",
          stock: "",
          images: [],
        });
      } else {
        throw new Error(response.data.message || "Failed to create product");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };
  // console.log(subCategories)

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <select
          id="subcategory"
          value={formData.subCategoryName}
          onChange={handleInputChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          name="subCategoryName"
          required
        >
          <option value="">Select Subcategory</option>
          {subCategories.map((subcategory, index) => (
            <option key={index} value={subcategory.subCategoryName}>
              {subcategory.subCategoryName}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          placeholder="Product Name"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <textarea
          name="productDescription"
          value={formData.productDescription}
          onChange={handleInputChange}
          placeholder="Product Description"
          className="mb-4 p-2 border border-gray-300 rounded w-full h-32 resize-none"
          required
        ></textarea>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="number"
          name="sellPrice"
          value={formData.sellPrice}
          onChange={handleInputChange}
          placeholder="Sell Price"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleInputChange}
          placeholder="Stock"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center"
          disabled={loading} // Disable the button when loading
        >
          {loading ? (
            <TailSpin color="#ffffff" height={20} width={20} />
          ) : (
            "Create Product"
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateProduct;
