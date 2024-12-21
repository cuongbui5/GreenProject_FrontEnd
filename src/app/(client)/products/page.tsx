"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHeart as faHeartEmpty } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Dropdown,
  Checkbox,
  Pagination,
  Spin,
  Rate,
  Input,
  Tree,
  MenuProps,
} from "antd";
import "../../../app/globals.css";
import "antd/dist/reset.css";
import { PRODUCT_ITEM_PAGE_SIZE } from "@/app/util/constant";
import {
  getAllProductsSort,
  getAllProductsView,
  getProductByStarRating,
  getProductOnTopSold,
} from "@/apis/modules/product";
import Link from "next/link";
import { useCategoryStore } from "@/app/store/CategoryStore";
import { SortAscendingOutlined } from "@ant-design/icons";

export default function page() {
  // ---------------Fix tạm------------------
  const topSoldPageNum: number = 1;
  const topSoldPageSize: number = 20;
  // ----------------------------------------

  const [searchQuery, setSearchQuery] = useState("");
  const [activeButton, setActiveButton] = useState("popular");
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [productsView, setProductsView] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [topSold, setTopSole] = useState(false);
  const [rating, setRating] = useState(false);
  const [starRating, setStarRating] = useState(1);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { getAllCategories, categoriesTree } = useCategoryStore(
    (state) => state
  );
  const [sortOption, setSortOption] = useState("");

  const fetchProduct = async (page: number, categoryId = 0, search = "") => {
    setLoading(true);
    const res: any = await getAllProductsView(page, search, categoryId);
    console.log(res);
    setLoading(false);
    if (res.code == 200) {
      setProductsView(res.data.content);
      setCurrentPage(res.data.currentPage);
      setTotal(res.data.totalElements);
    }
  };

  const fetchProductOnTopSold = async (page: number) => {
    setLoading(true);
    // ---------------Fix tạm------------------
    const res: any = await getProductOnTopSold(topSoldPageNum, topSoldPageSize);
    // ----------------------------------------

    setLoading(false);
    if (res.code == 200) {
      console.log(res);
      setProductsView(res.data.content);
      setCurrentPage(res.data.currentPage);
      setTotal(res.data.totalElements);
    }
  };

  const handleMenuClick = async (e: { key: string }) => {
    if (e.key === "ascMinPrice") {
      setSortByPrice(true);
      setSortOption("ascMinPrice");
      await fetchProductSortPrice(1, "ascMinPrice");
    } else if (e.key === "descMinPrice") {
      setSortByPrice(true);
      setSortOption("descMinPrice");
      await fetchProductSortPrice(1, "descMinPrice");
    } else if (e.key === "ascMaxPrice") {
      setSortByPrice(true);
      setSortOption("ascMaxPrice");
      await fetchProductSortPrice(1, "ascMaxPrice");
    } else if (e.key === "descMaxPrice") {
      setSortByPrice(true);
      setSortOption("descMaxPrice");
      await fetchProductSortPrice(1, "descMaxPrice");
    } else if (e.key === "reviewCount") {
      setSortByPrice(true);
      setSortOption("reviewCount");
      await fetchProductSortPrice(1, "reviewCount");
    } else if (e.key === "totalRating") {
      setSortByPrice(true);
      setSortOption("totalRating");
      await fetchProductSortPrice(1, "totalRating");
    } else {
      setSortByPrice(false);
    }
  };

  // const sortOptions = (
  //   <Menu onClick={handleMenuClick}>
  //     <Menu.Item key="1">Tất cả</Menu.Item>
  //     <Menu.Item key="2">Giá</Menu.Item>
  //   </Menu>
  // );
  const fetchProductSortPrice = async (page: number, option: string) => {
    setLoading(true);
    const res: any = await getAllProductsSort(page, option);
    setLoading(false);
    if (res.code == 200) {
      setProductsView(res.data.content);
      setCurrentPage(res.data.currentPage);
      setTotal(res.data.totalElements);
      console.log(currentPage);
    }
  };
  const convertTreeData = (data: any[]): any => {
    return data.map((item) => ({
      title: item.title,
      key: item.value, // Chuyển 'value' thành 'key'
      children: item.children ? convertTreeData(item.children) : undefined,
    }));
  };

  useEffect(() => {
    if (categoriesTree.length == 0) {
      getAllCategories();
    }
  }, []);

  useEffect(() => {
    fetchProduct(currentPage, selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleButtonClick = async (buttonType: SetStateAction<string>) => {
    setActiveButton(buttonType);

    if (buttonType == "latest") {
    } else if (buttonType == "best-seller") {
      setTopSole(true);
      await fetchProductOnTopSold(1);
    } else {
      await fetchProduct(1, 0, "");
    }
  };

  const onSelectCategory = async (selectedKeys: any) => {
    if (selectedKeys.length > 0) {
      const categoryId = selectedKeys[0];
      console.log(categoryId);
      await fetchProduct(1, categoryId, "");
    }
  };

  const toggleLike = (productId: number) => {
    setLikedProducts((prevLikes) => {
      const newLikes = new Set(prevLikes);
      if (newLikes.has(productId)) {
        newLikes.delete(productId);
      } else {
        newLikes.add(productId);
      }
      return newLikes;
    });
  };

  const handlePageChange = async (value: any) => {
    if (sortByPrice) {
      if (sortOption === "ascMinPrice") {
        await fetchProductSortPrice(value, "ascMinPrice");
      }
      if (sortOption === "descMinPrice") {
        await fetchProductSortPrice(value, "descMinPrice");
      }
      if (sortOption === "ascMaxPrice") {
        await fetchProductSortPrice(value, "ascMaxPrice");
      }
      if (sortOption === "descMaxPrice") {
        await fetchProductSortPrice(value, "descMaxPrice");
      }
      if (sortOption === "reviewCount") {
        await fetchProductSortPrice(value, "reviewCount");
      }
      if (sortOption === "totalRating") {
        await fetchProductSortPrice(value, "totalRating");
      }
    } else if (topSold) {
      await fetchProductOnTopSold(value);
    } else if (rating) {
      await getProductByStarRating(value, starRating);
    } else {
      if (selectedCategory && searchQuery) {
        await fetchProduct(value, selectedCategory, searchQuery);
      }
      if (selectedCategory) {
        await fetchProduct(value, selectedCategory, "");
      }
      if (searchQuery) {
        await fetchProduct(value, 0, searchQuery);
      } else {
        await fetchProduct(value, 0, "");
      }
    }
  };

  const handleSearchClick = async () => {
    setSelectedCategory(0);
    setCurrentPage(1);
    await fetchProduct(1, 0, searchQuery);
  };

  // Hàm đệ quy để render các category con
  const items: MenuProps["items"] = [
    {
      key: "ascMinPrice",
      label: "Giá thấp nhất tăng dần",
    },
    {
      key: "descMinPrice",
      label: "Giá thấp nhất giảm dần",
    },
    {
      key: "ascMaxPrice",
      label: "Giá cao nhất tăng dần",
    },
    {
      key: "descMaxPrice",
      label: "Giá cao nhất giảm dần",
    },
    {
      key: "reviewCount",
      label: "Số lượng sao đánh giá",
    },
    {
      key: "totalRating",
      label: "Tổng sao đánh giá",
    },
  ];

  const handleSearchRating = async (e: any, star: number) => {
    const isChecked = e.target.checked;
    setSelectedRating(star === selectedRating ? null : star);
    setStarRating(star);

    if (isChecked) {
      const res: any = await getProductByStarRating(1, star);
      if (res.code == 200) {
        setRating(true);
        setProductsView(res.data.content);
        setCurrentPage(res.data.currentPage);
        setTotal(res.data.totalElements);
      }
    }
  };

  return (
    <div className="mx-0 px-0">
      <div className="relative mb-16">
        <img
          src="/client/products/slidebg.jpg"
          alt=""
          width={250}
          height={100}
          className="object-cover w-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h2 className="text-3xl font-bold uppercase">GREENNOVA</h2>
          <p className="mt-2 text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit
            amet accumsan arcu. Proin vitae neque urna.
          </p>
        </div>
      </div>
      <div className="flex flex-col mt-5 px-9 mb-32">
        <div className="flex">
          {/* Thanh bên trái */}
          <aside className="w-1/4 h-min bg-[#F5F5F5] p-4 rounded py-10">
            <h2 className="text-xl font-semibold mb-4">Tìm Kiếm</h2>
            <div className="flex mb-4">
              {/* Input search */}
              <Input
                type="text"
                placeholder="Bạn muốn mua gì..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded w-full focus:border-transparent focus:outline-none focus:ring-0"
              />
              {/* Button search */}
              <Button
                type="primary"
                className="ml-2"
                onClick={handleSearchClick} // Gọi hàm tìm kiếm khi nhấn nút
              >
                Tìm kiếm
              </Button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Danh Mục</h2>

            <Tree
              treeData={convertTreeData(categoriesTree)}
              className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-lg" // Thêm các class Tailwind
              defaultExpandAll
              onSelect={onSelectCategory}
            />

            {/* Đánh giá */}
            <h2 className="text-xl font-semibold mt-6 mb-4">Đánh Giá</h2>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center space-x-2">
                  <Checkbox
                    className="mr-2"
                    checked={selectedRating === star}
                    onChange={(e) => handleSearchRating(e, star)}
                  />
                  <div className="flex items-center">
                    <Rate value={star} disabled />
                  </div>
                  <span className="ml-2 text-gray-700">{star} sao</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Khu vực sản phẩm bên phải */}
          <main className="w-3/4 px-8 rounded">
            {/* Header với các button và dropdown */}
            <div className="flex items-center justify-between mb-4 mt-0 bg-[#F5F5F5] px-5 py-3">
              <div className="flex space-x-4">
                <Button
                  type={activeButton === "popular" ? "primary" : "default"}
                  onClick={() => handleButtonClick("popular")}
                >
                  Phổ biến
                </Button>
                <Button
                  type={activeButton === "latest" ? "primary" : "default"}
                  onClick={() => handleButtonClick("latest")}
                >
                  Mới nhất
                </Button>
                <Button
                  type={activeButton === "best-seller" ? "primary" : "default"}
                  onClick={() => handleButtonClick("best-seller")}
                >
                  Bán chạy
                </Button>
              </div>
              <Dropdown
                menu={{ items, onClick: handleMenuClick }} // Sử dụng items cho menu
                trigger={["click"]}
              >
                <Button>
                  Sắp xếp <SortAscendingOutlined className="ml-2" />
                </Button>
              </Dropdown>

              {/*dropdown here*/}
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 rounded cursor-pointer">
                {productsView.map((product: any) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="border rounded overflow-hidden shadow-md flex flex-col">
                      <img
                        src={product.imageCover}
                        alt={product.name}
                        className="object-cover w-full h-45 object-center aspect-square"
                      />
                      <div className="p-4 flex-1">
                        <h3 className="text-lg font-semibold mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                          {product.name}
                        </h3>
                        <p className="text-brand-primary mb-2 font-bold">
                          {product.minPrice}đ-{product.maxPrice}đ
                        </p>
                        <div className="flex justify-between">
                          <div className="flex items-center mb-2">
                            <Rate
                              allowHalf
                              defaultValue={
                                product.totalRating / product.totalReviews
                              }
                              disabled
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <FontAwesomeIcon
                              icon={
                                likedProducts.has(product.id)
                                  ? faHeartFilled
                                  : faHeartEmpty
                              }
                              className={`cursor-pointer ${
                                likedProducts.has(product.id)
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                              onClick={() => toggleLike(product.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Phân trang */}
            <div className="flex justify-center mt-8 space-x-2">
              {currentPage && (
                <Pagination
                  onChange={handlePageChange}
                  current={currentPage}
                  defaultPageSize={PRODUCT_ITEM_PAGE_SIZE}
                  total={total}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
