import { getTopUserDashBoard } from "@/apis/modules/dashboard";
import { Select, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import DefaultUser from "../../../../public/admin/default_user.jpg";

interface UserData {
  id: number;
  username: string;
  imageUrl?: string;
}

const TopUserTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(2024);
  const [quarter, setQuarter] = useState<number>(1);
  const [quarters] = useState<number[]>([1, 2, 3, 4]);
  const [topUserData, setTopUserData] = useState<UserData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res: any = await getTopUserDashBoard(quarter, year);
        if (res?.code === 200) {
          setTopUserData(res.data.users.content);
        } else {
          setError("Failed to load data");
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [year, quarter]);

  // Cột cho bảng Top 10 người dùng
  const userColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: UserData, b: UserData) => a.id - b.id,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a: UserData, b: UserData) =>
        a.username.localeCompare(b.username),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text: any, record: UserData) =>
        record.imageUrl ? (
          <img
            src={record.imageUrl}
            alt={record.username}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ) : (
          <img
            src={DefaultUser.src}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid black",
            }}
          />
        ),
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
            setQuarter(1); // Đặt lại quý khi thay đổi năm
          }}
          style={{ width: 120, marginRight: 20 }}
        >
          {[2022, 2023, 2024, 2025].map((year) => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Select Quarter"
          value={quarter}
          onChange={(value) => setQuarter(value)}
          style={{ width: 120 }}
          disabled={year === null}
        >
          {quarters.map((q) => (
            <Select.Option key={q} value={q}>
              {`Q${q}`}
            </Select.Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={Array.isArray(topUserData) ? topUserData : []}
          columns={userColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default TopUserTable;
