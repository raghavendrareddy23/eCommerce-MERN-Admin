import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./components/admin/AdminLogin";
// import Navbar from "./components/NavBar";
import Home from "./components/Home";
import "./App.css";
import ImageUpload from "./components/category/createCategory";
import CategoryStatus from "./components/category/categoryStatus";
// import TopNav from "./components/topNav";
import CategoryUpdate from "./components/category/categoryUpdate";
import SubCategoryUpload from "./components/subCategory/createSubCategory";
import SubCategoryStatus from "./components/subCategory/subCategoryStatus";
import SubcategoryUpdate from "./components/subCategory/subCategoryUpdate";
import CreateProduct from "./components/Products/createProduct";
import ProductStatus from "./components/Products/productStatus";
import ProductUpdate from "./components/Products/productUpdate";
import MainLayout from "./components/NavBar";
import { LogoutButton } from "./components/admin/reuse";
import NotificationBar from "./components/Notifications/Notification";
// import UpdateCategoryForm from "./components/dummy";
// import Navbar from "./components/NavBar";


function App() {
  return (
    <Router>
      <div>
        {/* <TopNav /> */}
        {/* <Navbar/> */}
        <div className="flex-grow bg-gray-200">
          <Routes>
            <Route path="/" exact element={<AdminLogin />} />
            <Route path="/admin" element={<MainLayout/>}>
              <Route index  element={<Home/>}/>
              <Route path="create" element={<ImageUpload />} />
              <Route path="categories" element={<CategoryStatus />} />
              <Route path="category-update" element={<CategoryUpdate />} />
              <Route
                path="subcategory/create"
                element={<SubCategoryUpload />}
              />
              <Route path="subcategories" element={<SubCategoryStatus />} />
              <Route
                path="subcategory-update"
                element={<SubcategoryUpdate />}
              />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="products" element={<ProductStatus />} />
              <Route path="product-update" element={<ProductUpdate />} />
              <Route path="logout" element={<LogoutButton/>}/>
              <Route path="notification" element={<NotificationBar/>} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
