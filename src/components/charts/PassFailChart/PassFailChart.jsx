// npm install recharts

import "./PassFailChart.css";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const defaultData = [
    { name: "Matched", value: 1245 },
    { name: "Mismatch", value: 38 },
];

const COLORS = ["#28a745", "#dc3545"];

function PassFailChart({ data = defaultData }) {
    return (
        <div className="passfail-chart-container">

            <div className="chart-header">
                <h3>Matched vs Mismatch</h3>
                <span>Today's Inspection</span>
            </div>

            <ResponsiveContainer width="100%" height={260}>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        left: 0,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />
                        ))}
                    </Bar>

                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}

export default PassFailChart;
