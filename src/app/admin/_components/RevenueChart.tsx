import { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { Column } from "@ant-design/charts";
import { getRevenueDashBoard } from "@/apis/modules/dashboard";

const { Option } = Select;

interface RevenueData {
  quarter: string;
  revenue: number;
}

const RevenueChart = () => {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState(2024);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const quarters = [1, 2, 3, 4];

        const requests = quarters.map(async (quarter) => {
          try {
            const result = await getRevenueDashBoard(quarter, year);
            return {
              quarter: `Q${result.data.quarter}`,
              revenue: result.data.orders.revenue,
            };
          } catch (error: any) {
            if (error.response) {
              return {
                quarter: `Q${quarter}`,
                revenue: 0, // Mặc định 0 nếu không có dữ liệu
              };
            }
            throw error;
          }
        });

        const results = await Promise.all(requests);
        setData(results);
      } catch (err) {
        setError("Failed to fetch revenue data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [year]);

  const config = {
    data,
    xField: "quarter",
    yField: "revenue",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    meta: {
      quarter: { alias: "Quarter" },
      revenue: { alias: "Revenue ($)" },
    },
  };

  return (
    <div>
      {/* Dropdown chọn năm */}
      <Select
        value={year}
        onChange={(value) => setYear(value)} // Cập nhật giá trị năm
        style={{ width: 120, marginBottom: 20 }}
      >
        {/* Tùy chọn các năm */}
        <Option value={2022}>2022</Option>
        <Option value={2023}>2023</Option>
        <Option value={2024}>2024</Option>
        <Option value={2025}>2025</Option>
      </Select>

      {/* Hiển thị biểu đồ hoặc thông báo đang load */}
      {loading ? <Spin /> : <Column {...config} />}

      {/* Hiển thị lỗi nếu có */}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default RevenueChart;
