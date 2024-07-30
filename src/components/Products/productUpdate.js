import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import axios from 'axios';

const ProductUpdate = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const subCategoryNameRef = useRef(null);
  const productNameRef = useRef(null);
  const productDescriptionRef = useRef(null);
  const productStatusRef = useRef(null);
  const priceRef = useRef(null);
  const sellPriceRef = useRef(null);
  const stockRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubcategories(currentPage);
  }, [currentPage]);

  const fetchSubcategories = async (page) => {
    try {
      const response = await axios.get(`https://ecommerce-backend-fm0r.onrender.com/product/?page=${page}`);
      const data = response.data;
      setProducts(data.data.allProducts);
      setTotalPages(response.data.data.totalPages);
      setLoading(false);
      const uniqueSubCategories = [
        ...new Set(
          data.data.allProducts.map((product) => product.subCategoryId.subCategoryName)
        ),
      ];
      // Set the subCategories state
      setSubCategories(uniqueSubCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      setDeleteLoading(true); // Set delete loading to true
      const response = await axios.delete(
        `https://ecommerce-backend-fm0r.onrender.com/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to the request
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete subcategory");
      }
      // Remove the deleted subcategory from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
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
    formData.append(
      "images",
      e.target.elements.images.files[0] || selectedProduct.imageGallery
    );
    formData.append(
      "subCategoryName",
      subCategoryNameRef.current.value || selectedProduct.subCategoryName
    );
    formData.append(
      "productName",
      productNameRef.current.value || selectedProduct.productName
    );
    formData.append(
      "productDescription",
      productDescriptionRef.current.value || selectedProduct.productDescription
    );
    formData.append("price", priceRef.current.value || selectedProduct.price);
    formData.append(
      "sellPrice",
      sellPriceRef.current.value || selectedProduct.sellPrice
    );
    formData.append("stock", stockRef.current.value || selectedProduct.stock);
    formData.append(
      "productStatus",
      productStatusRef.current.value || selectedProduct.productStatus
    );

    try {
      const token = sessionStorage.getItem("adminToken");
      const response = await axios.put(
        `https://ecommerce-backend-fm0r.onrender.com/product/${selectedProduct._id}`,
        formData,
        {
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
      fetchSubcategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subcategory");
    } finally {
      setUpdateLoading(false);
    }
  };

  const navigateToImagesPage = () => {
    // Navigate to the page where you can view images
    navigate("/create-product");
  };

  return (
    <div>
      <button
        onClick={navigateToImagesPage}
        className="m-3 py-3 px-5 bg-blue-500 text-white font-bold rounded focus:outline-none focus:shadow-outline"
      >
        Back to Upload File
      </button>
      <div className="flex flex-wrap justify-center p-5">
        {loading ? (
          <ThreeDots color="#0c6602" height={50} width={50} />
        ) : (
          products.map((product, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 justify-center m-10">
                <div className="w-full relative">
                  <Slide autoplay={true} duration={5000}>
                    {product.imageGallery.map((image, index) => (
                      <div key={index} className="each-slide">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="object-contain w-full h-60"
                        />
                      </div>
                    ))}
                  </Slide>
                </div>
                <div className="w-2/3 p-4">
                  <h3 className="text-xl font-semibold">
                    {product.productName}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {product.productDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discount && (
                        <p className="text-gray-500 line-through">
                          ${product.price}
                        </p>
                      )}
                      <p className="text-sm text-lime-600 font-semibold">
                        Discount:{" "}
                        <span className="font-bold">{product.discount}%</span>
                      </p>
                      <p className="text-green-600 font-semibold">
                        ${product.sellPrice}
                      </p>
                    </div>
                    {/* <p className="text-sm text-gray-600">Discount: {product.discount} %</p> */}
                    <p className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </p>
                  </div>
                  <p
                    className={`text-xl font-semibold ${
                      product.productStatus === "active"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {product.productStatus}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => handleUpdate(product)}
                  className="mr-2 bg-blue-500 text-white py-1 px-3 rounded"
                >
                  {updateLoading && selectedProduct === product ? (
                    <TailSpin color="#FFFFFF" height={20} width={20} />
                  ) : (
                    "Update"
                  )}
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  {deleteLoading && selectedProduct === product ? (
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
          <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Update Product</h2>
              <form onSubmit={handleSubmitUpdate}>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  //   defaultValue={selectedProduct.imageGallery}
                  className="mb-4"
                />
                <select
                  id="subcategory"
                  className="p-2 border border-gray-300 rounded"
                  ref={subCategoryNameRef}
                  // defaultValue={selectedProduct?.subCategoryName}
                  name="subCategoryName"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((subcategory, index) => (
                    <option key={index} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Product Name"
                  className="mb-4 p-2 border border-gray-300 rounded"
                  ref={productNameRef}
                  defaultValue={selectedProduct.productName}
                  name="productName"
                />
                <textarea
                  placeholder="Product Description"
                  className="mb-4 p-2 border border-gray-300 rounded"
                  ref={productDescriptionRef}
                  defaultValue={selectedProduct.productDescription}
                  name="productDescription"
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="mb-4 p-2 border border-gray-300 rounded"
                  ref={priceRef}
                  defaultValue={selectedProduct.price}
                  name="price"
                />
                <input
                  type="number"
                  placeholder="Selling Price"
                  className="mb-4 p-2 border border-gray-300 rounded"
                  ref={sellPriceRef}
                  defaultValue={selectedProduct.sellPrice}
                  name="sellPrice"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  className="mb-4 p-2 border border-gray-300 rounded"
                  ref={stockRef}
                  defaultValue={selectedProduct.stock}
                  name="stock"
                />
                <input
                  type="text"
                  placeholder="Product Status"
                  className="mb-4 p-2 border border-gray-300 rounded"
                  ref={productStatusRef}
                  defaultValue={selectedProduct.productStatus}
                  name="productStatus"
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
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <TailSpin color="#FFFFFF" height={20} width={20} />
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mr-2 border bg-gray-200 text-gray-700 rounded-md hover:bg-blue-500 hover:text-white`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductUpdate;
