import { getProductDashBoard } from "@/apis/modules/dashboard";
import { Select, Spin, Table } from "antd";
import { useEffect, useState } from "react";

interface ProductData {
  id: number;
  name: string;
  max_price: number;
  min_price: number;
  total_sold: number;
  total_rating: number;
  count_reviews: number;
}

const TopSoldProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(2024);
  const [quarter, setQuarter] = useState<number>(1);
  const [quarters, setQuarters] = useState<number[]>([1, 2, 3, 4]);
  const [topSoldProductData, setTopSoldProductData] = useState<ProductData[]>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res: any = await getProductDashBoard(quarter, year);
        if (res?.code === 200) {
          setTopSoldProductData(res.data.top_sold_products);
        }
      } catch (error: any) {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [year, quarter]);

  useEffect(() => {
    setQuarter(1);
  }, []);

  const productColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: { id: number }, b: { id: number }) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: { name: string }, b: { name: any }) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Max Price",
      dataIndex: "max_price",
      key: "max_price",
      sorter: (a: { max_price: number }, b: { max_price: number }) =>
        a.max_price - b.max_price,
    },
    {
      title: "Min Price",
      dataIndex: "min_price",
      key: "min_price",
      sorter: (a: { min_price: number }, b: { min_price: number }) =>
        a.min_price - b.min_price,
    },
    {
      title: "Sold",
      dataIndex: "total_sold",
      key: "total_sold",
      sorter: (a: { total_sold: number }, b: { total_sold: number }) =>
        a.total_sold - b.total_sold,
    },
    {
      title: "Rating",
      dataIndex: "total_rating",
      key: "total_rating",
      sorter: (a: { total_rating: number }, b: { total_rating: number }) =>
        a.total_rating - b.total_rating,
    },
    {
      title: "Reviews",
      dataIndex: "count_reviews",
      key: "count_reviews",
      sorter: (a: { count_reviews: number }, b: { count_reviews: number }) =>
        a.count_reviews - b.count_reviews,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Select
          placeholder="Select Year"
          value={year}
          onChange={(value) => {
            setYear(value);
            setQuarter(0);
          }}
          style={{ width: 120, marginRight: 20 }}
        >
          <Select.Option value={2022}>2022</Select.Option>
          <Select.Option value={2023}>2023</Select.Option>
          <Select.Option value={2024}>2024</Select.Option>
          <Select.Option value={2025}>2025</Select.Option>
        </Select>

        {/* Dropdown chọn quý (bị disable nếu chưa chọn năm) */}
        <Select
          placeholder="Select Quarter"
          value={quarter}
          onChange={(value) => setQuarter(value)}
          style={{ width: 120 }}
          disabled={year === null} // Disable khi chưa chọn năm
        >
          {quarters.map((q) => (
            <Select.Option key={q} value={q}>
              {`Q${q}`}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Hiển thị biểu đồ hoặc loading */}
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={
            Array.isArray(topSoldProductData) ? topSoldProductData : []
          }
          columns={productColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default TopSoldProduct;
