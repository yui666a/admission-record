import { useCallback, useState } from "react";
import styled from "styled-components";
import moment from "moment";
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
import { Chart, Pie } from "react-chartjs-2";
import Log from "../Type/Log";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  ...registerables
);

interface Props {
  data: Log[];
}

const today = moment();
const generationLabels = [
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
const backgroundColor = [
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
];

const MonthlyStatistic = function (props: Props) {
  const [selectedMonth, setMonth] = useState(moment(today).format("YYYY/MM"));
  const moveMonth = useCallback(
    (move: number) => {
      setMonth(moment(selectedMonth).add(move, "month").format("YYYY/MM"));
    },
    [selectedMonth]
  );

  //2次元配列を転置させる関数
  const transpose = (a: number[][]) => a[0].map((_, c) => a.map((r) => r[c]));

  // 選択されている月から過去一年分の月を格納
  let monthLabels: string[] = [];
  for (let i = -12; i <= 0; ++i) {
    monthLabels.push(moment(selectedMonth).add(i, "month").format("YYYY/MM"));
  }

  /**
   * 月別の参拝者数を計算
   *
   * @returns number[][]
   * ex) [[boy1, girl1, total1], [boy2, girl2, total2], ...]
   */
  const monthlyAdmissions = monthLabels.map((month) => {
    let count = [0, 0, 0]; // [man, woman, all]
    props.data.forEach((log) => {
      if (log.date.slice(0, 7) === month) {
        switch (log.sex) {
          case "男":
            count[0]++;
            break;
          case "女":
            count[1]++;
            break;
        }
        // If gender is not stated, it also be counted.
        count[2]++;
      }
    });
    return count;
  });
  const genderAdmissions = transpose(monthlyAdmissions);

  // 世代別は要素数が確定しているため　list
  let generations = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // groupは未知のため　object
  let groups = {};
  props.data.forEach((log) => {
    if (log.date.slice(0, 7) === selectedMonth) {
      // 世代別集計
      let generation = (parseInt(log.age) / 10) | 0; // integer
      if (generation > 9) generation = 9; // 100+ years old is included in 90+ years old.
      generations[generation]++;

      // グループ別集計
      if (log.group in groups) {
        const key = log.group as keyof typeof groups;
        groups = { ...groups, [key]: groups[key] + 1 };
      } else {
        groups = { ...groups, [log.group]: 1 };
      }
    }
  });
  const groupLabels = Object.keys(groups);
  const groupValues = Object.values(groups);

  const genderData = {
    labels: monthLabels,
    datasets: [
      {
        type: "bar" as const,
        data: genderAdmissions[0],
        label: "男性",
        borderColor: "rgba(54,164,235,0.8)",
        backgroundColor: "rgba(54,164,235,0.5)",
      },
      {
        type: "bar" as const,
        data: genderAdmissions[1],
        label: "女性",
        borderColor: "rgba(254,97,132,0.8)",
        backgroundColor: "rgba(254,97,132,0.5)",
      },
      {
        type: "line" as const,
        data: genderAdmissions[2],
        label: "全体",
        fill: false,
        borderColor: "rgba(100, 100, 100, 0.5)",
      },
    ],
  };

  const generationData = {
    labels: generationLabels,
    datasets: [
      {
        data: generations,
        hoverOffset: 4,
        backgroundColor: backgroundColor,
      },
    ],
  };

  const groupData = {
    labels: groupLabels,
    datasets: [
      {
        data: groupValues,
        hoverOffset: 10,
        backgroundColor: backgroundColor,
      },
    ],
  };

  return (
    <>
      <Header>
        <button onClick={() => moveMonth(-1)}>＜</button>
        <button onClick={() => moveMonth(1)}>＞</button>
      </Header>

      {/* 男女別 */}
      <Chart type="bar" data={genderData} />

      <DetailArea>
        <div style={{ width: "100%" }}>
          {moment(selectedMonth).format("YYYY年MM月")}
        </div>

        <Category>
          年齢別
          <Pie data={generationData} />
        </Category>

        <Category>
          グループ別
          <Pie data={groupData} />
        </Category>
      </DetailArea>
    </>
  );
};
export default MonthlyStatistic;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 28px;
  margin-bottom: 20px;
`;

const DetailArea = styled.div`
  font-size: 28px;
  margin-bottom: 20px;
  width: 100%;
  margin-top: 100px;
  display: flex;
  flex-wrap: wrap;
`;

const Category = styled.div`
  width: 50%;
  & span {
    padding: 100px;
  }
`;
