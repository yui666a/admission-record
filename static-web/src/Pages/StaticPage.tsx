import styled from "styled-components";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  registerables,
} from "chart.js";
// import chartjsPluginDatalabels from "chartjs-plugin-datalabels";
import { Chart, Pie } from "react-chartjs-2";
import Log from "../Type/Log";
import { useCallback, useState } from "react";
import moment from "moment";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  ...registerables,
  // chartjsPluginDatalabels
);

interface Props {
  onFileLoad?: Function;
  data: Log[];
}

const today = moment();
const ages = [
  "～10",
  "10～19",
  "20～29",
  "30～39",
  "40～49",
  "50～59",
  "60～69",
  "70～79",
  "80～89",
  "90～",
];
const StaticPage = function (props: Props) {
  const [selectedMonth, setMonth] = useState(moment(today).format("YYYY/MM"));
  const moveMonth = useCallback(
    (move: number) => {
      setMonth(moment(selectedMonth).add(move, "month").format("YYYY/MM"));
    },
    [selectedMonth]
  );

  let monthLabels: string[] = [];
  for (let i = -12; i <= 0; ++i) {
    monthLabels.push(moment(selectedMonth).add(i, "month").format("YYYY/MM"));
  }

  const graphData = {
    labels: monthLabels,
    datasets: [
      {
        type: "bar" as const, // グラフタイプを指定

        data: monthLabels.map((month) => {
          // 月別の参拝者数を計算
          return props.data.filter((log) => {
            return log.date.slice(0, 7) === month && log.sex === "男";
          }).length;
        }),
        label: "男性",
        borderColor: "rgba(54,164,235,0.8)",
        backgroundColor: "rgba(54,164,235,0.5)",
      },
      {
        type: "bar" as const, // グラフタイプを指定

        data: monthLabels.map((month) => {
          // 月別の参拝者数を計算
          return props.data.filter((log) => {
            return log.date.slice(0, 7) === month && log.sex === "女";
          }).length;
        }),
        label: "女性",
        borderColor: "rgba(254,97,132,0.8)",
        backgroundColor: "rgba(254,97,132,0.5)",
      },

      {
        type: "line" as const, // グラフタイプを指定

        data: monthLabels.map((month) => {
          // 月別の参拝者数を計算
          return props.data.filter((log) => {
            return log.date.slice(0, 7) === month;
          }).length;
        }),
        label: "全体",
        lineTension: 0,
        fill: false,
        borderColor: "rgba(100, 100, 100, 0.5)",
      },
    ],
  };

  let a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  monthLabels.forEach((month) => {
    props.data.forEach((log) => {
      if (log.date.slice(0, 7) === month) {
        let generation = (parseInt(log.age) / 10) | 0;
        if (generation > 9) generation = 9;
        a[generation]++;
      }
    });
  });

  const graphData2 = {
    labels: ages,
    datasets: [
      {
        data: a,
        hoverOffset: 4,
        backgroundColor: [
          "#de9610",
          "#c93a40",
          "#f2cf01",
          "#0074bf",
          "#65ace4",
          "#a0c238",
          "#56a764",
          "#d16b16",
          "#cc528b",
          "#9460a0",
        ],
      },
    ],
  };

  return (
    <Content>
      <Header>
        <button onClick={() => moveMonth(-1)}>＜</button>
        <button onClick={() => moveMonth(1)}>＞</button>
      </Header>
      <Chart type="bar" data={graphData} />
      <GenerationArea style={{ width: "40%", marginTop: "100px" }}>
        年齢別
        <Pie data={graphData2} />
      </GenerationArea>
    </Content>
  );
};
export default StaticPage;

const Content = styled.div`
  width: calc(100vw - 200px);
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 50px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 28px;
  margin-bottom: 20px;
`;
const GenerationArea = styled.div`
  font-size: 28px;
  margin-bottom: 20px;
`;
