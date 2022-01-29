import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      type: "line" as const,
      label: "Dataset 1",
      borderColor: "rgb(255, 99, 132)",
      borderWidth: 2,
      fill: false,
      data: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      type: "bar" as const,
      label: "Dataset 2",
      backgroundColor: "rgb(75, 192, 192)",
      data: [1, 2, 3, 4, 5, 6, 7],
      borderColor: "white",
      borderWidth: 2,
    },
    {
      type: "bar" as const,
      label: "Dataset 3",
      backgroundColor: "rgb(53, 162, 235)",
      data: [1, 2, 3, 4, 5, 6, 7],
    },
  ],
};

export function App() {
  return <Chart type="bar" data={data} />;
}
