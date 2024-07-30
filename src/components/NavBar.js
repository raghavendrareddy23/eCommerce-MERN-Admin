import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RiCouponLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import {FaBloggerB } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
// import { BiCategoryAlt } from "react-icons/bi";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from "./admin/reuse";
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            {/* <span className="sm-logo">DC</span> */}
            <span className="lg-logo">RR</span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            navigate(key);
          }}
          items={[
            {
              key: "",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Dashboard",
            },
            {
              key: "category",
              icon: <AiOutlineShoppingCart className="fs-4" />,
              label: "Category",
              children: [
                {
                  key: "create",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Add Category",
                },
                {
                  key: "categories",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Categories",
                },
                {
                  key: "category-update",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Update Category",
                },
              ],
            },
            {
              key: "subcategory",
              icon: <RiCouponLine className="fs-4" />,
              label: "Sub Category",
              children: [
                {
                  key: "subcategory/create",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add SubCategory",
                },
                {
                  key: "subcategories",
                  icon: <RiCouponLine className="fs-4" />,
                  label: "SubCategories",
                },
                {
                  key: "subcategory-update",
                  icon: <RiCouponLine className="fs-4" />,
                  label: "Update SubCategories",
                },
              ],
            },
            {
              key: "product",
              icon: <FaBloggerB className="fs-4" />,
              label: "Products",
              children: [
                {
                  key: "create-product",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Product",
                },
                {
                  key: "products",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Products",
                },
                {
                  key: "product-update",
                  icon: <ImBlog className="fs-4" />,
                  label: "Update Product",
                },
              ],
            },
            {
              key: "notifications",
              icon: <FaBloggerB className="fs-4" />,
              label: "Notifications",
              children: [
                {
                  key: "notification",
                  icon: <ImBlog className="fs-4" />,
                  label: "Notifications",
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <p className="text-3xl uppercase my-2 font-semibold text-green-700">Company Name</p>
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex gap-3 align-items-center dropdown">
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
              <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/"
                  >
                    <LogoutButton onLogout={handleLogout} />
                  </Link>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
