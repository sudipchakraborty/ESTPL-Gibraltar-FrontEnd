import "./EventTypeChart.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const defaultData = [
  { event: "OCR", count: 845 },
  { event: "Helmet", count: 176 },
  { event: "Person", count: 210 },
  { event: "Vehicle", count: 98 },
  { event: "Fire", count: 18 },
  { event: "Smoke", count: 9 },
];

const COLORS = [
  "#1565C0",
  "#43A047",
  "#FB8C00",
  "#8E24AA",
  "#E53935",
  "#546E7A",
];

function EventTypeChart({ data = defaultData }) {
  return (
    <div className="event-chart-container">

      <ResponsiveContainer width="100%" height={300}>

        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="event" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default EventTypeChart;