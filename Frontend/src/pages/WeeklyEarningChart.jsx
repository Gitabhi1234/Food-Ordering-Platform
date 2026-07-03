import React from "react";
import CustomTooltip from "../components/CustomTooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#10b981",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const WeeklyEarningChart = ({ data = [] }) => {
  // Convert FastAPI response
  const chartData = data.map((item) => ({
    day: new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    earnings: item.earnings,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-center items-center h-[300px]">
        <p className="text-gray-500 text-lg">No Earnings Data</p>
      </div>
    );
 
  };


  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-center mb-6">
        Weekly Earnings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-gray-50 rounded-xl p-4">

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip content={<CustomTooltip />} />

              <Legend />

              <Bar
                dataKey="earnings"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-gray-50 rounded-xl p-4">

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip content={<CustomTooltip />} />

              <Legend />

              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#6366f1"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="bg-gray-50 rounded-xl p-4 mt-6">

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={chartData}
              dataKey="earnings"
              nameKey="day"
              outerRadius={110}
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
   
  );
};

export default WeeklyEarningChart;