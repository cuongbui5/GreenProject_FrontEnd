import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/charts";
import { Select, Spin } from "antd";
import { getOrderDashBoard } from "@/apis/modules/dashboard";

type OrderStatus = {
  count: number; // Số lượng đơn hàng
  percentage: string; // Phần trăm đơn hàng
  status: string; // Trạng thái đơn hàng
};

const OrderStatusChart = () => {
  const [data, setData] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(2024);
  const [quarter, setQuarter] = useState<number>(1);
  const [quarters, setQuarters] = useState<number[]>([1, 2, 3, 4]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getOrderDashBoard(quarter, year);
        const statuses = result?.data?.orders?.statuses || [];
        // Chuyển đổi dữ liệu trạng thái thành định dạng phù hợp
        const newData = statuses.map(
          (status: { count: any; percentage: any; status: any }) => ({
            count: status.count ?? 0, // Số lượng đơn hàng
            percentage: status.percentage ?? "0%", // Phần trăm
            status: status.status ?? "Unknown", // Trạng thái
          })
        ) as OrderStatus[];
        setData(newData);
      } catch (error: any) {
        if (error.response) {
          setData([{ count: 0, percentage: "0%", status: "Unknown" }]);
        } else {
          setError("Failed to fetch order data.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [year, quarter]);

  useEffect(() => {
    setQuarter(1);
  }, []);

  const config = {
    appendPadding: 10,
    data,
    angleField: "count",
    colorField: "status",
    radius: 1,
    innerRadius: 0.6,
  };

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
      {loading ? <Spin /> : <Pie {...config} />}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default OrderStatusChart;
