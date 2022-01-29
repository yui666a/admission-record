import LogPage from "./Pages/LogPage";
import MonthlyStatistic from "./Pages/MonthlyStatistic";
import CompareLastYearStatistic from "./Pages/CompareLastYearStatistic";
import Sidebar from "./Components/Sidebar";
import InitialDisplay from "./Pages/InitialDisplay";
import { useMemo, useState } from "react";
import styled from "styled-components";
import Log from "./Type/Log";

// excelの時間を変換するための定数
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

  function onInput(data: string) {
    const dateLogs: Log[] = JSON.parse(data).map((log: any) => {
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
        dateLogs.map((log) => [log.date + log.time + log.name, log])
      ).values()
    );
    const sortedData = filteredData.sort(function (a: Log, b: Log) {
      return a.date > b.date ? -1 : 1;
    });
    setData(sortedData);
    setMode("log");
  }

  return (
    <Body className="App">
      {sideBar}
      {mode === "init" && <InitialDisplay onFilesInput={onInput} />}
      {mode === "log" && <LogPage data={data} />}
      {mode === "static" && <MonthlyStatistic data={data} />}
      {mode === "compareLastYear" && <CompareLastYearStatistic data={data} />}
    </Body>
  );
}

export default App;
const Body = styled.div`
  display: flex;
`;
