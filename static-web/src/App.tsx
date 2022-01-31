import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import Log from "./Type/Log";
import LogPage from "./Pages/LogPage";
import MonthlyStatistic from "./Pages/MonthlyStatistic";
import CompareLastYearStatistic from "./Pages/CompareLastYearStatistic";
import Sidebar from "./Components/Sidebar";
import InitialDisplay from "./Pages/InitialDisplay";

// excelの時間を変換するための定数
// 1日を 0~約1で表す
// const constantSec = 0.000011572734491;
const constantMin = 0.000694364069444;
// const constantHour = 0.041661844166667;

type Page = "init" | "static" | "log" | "compareLastYear";

function App() {
  const [data, setData] = useState<Log[]>([]);
  const [mode, setMode] = useState<Page>("init");

  const sideBar = useMemo(() => {
    return (
      <Sidebar
        onClick={(value: Page) => {
          setMode(value);
        }}
      />
    );
  }, []);

  const onInput = useCallback((data: string) => {
    const dateLogs: Log[] = JSON.parse(data).map((log: any) => {
      // 時間は計算による若干の誤差あり
      const time = Number(log.参拝時間) / constantMin;
      const hour = ("0" + ((time / 60) | 0)).slice(-2);
      const min = ("0" + (time % 60 | 0)).slice(-2);
      return {
        date: log.参拝日付,
        group: log.所属,
        name: log.参拝者,
        id: log.会員番号,
        age: log.年齢,
        sex: log.性別,
        time: hour + " : " + min,
        note: log.備考_参拝理由など,
      };
    });
    const filteredData = Array.from(
      new Map(
        // 参拝日時，参拝者が同一のログを省く（１度に複数回記録されたとみなす）
        dateLogs.map((log) => [log.date + log.time + log.name, log])
      ).values()
    );
    const sortedData = filteredData.sort(function (a: Log, b: Log) {
      return a.date > b.date ? -1 : 1;
    });
    setData(sortedData);
    setMode("log");
  }, []);

  return (
    <Body className="App">
      {sideBar}
      <Content>
        {mode === "init" && <InitialDisplay onFilesInput={onInput} />}
        {mode === "log" && <LogPage data={data} />}
        {mode === "static" && <MonthlyStatistic data={data} />}
        {mode === "compareLastYear" && <CompareLastYearStatistic data={data} />}
      </Content>
    </Body>
  );
}

export default App;
const Body = styled.div`
  display: flex;
`;

const Content = styled.div`
  width: calc(100vw - 200px);
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 50px;
`;
