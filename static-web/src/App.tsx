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
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<Page>("init");

  function parseCSV(data: string): string[][] {
    return data
      .split("\r\n")[0]
      .split("\r")
      .map((row) => row.split(","));
  }

  function onFilesInput(ev: React.ChangeEvent<HTMLInputElement>) {
    let pushedFiles: File[] = [];
    if (ev.target.files) {
      for (let i = 0; i < ev.target.files!.length; i++) {
        pushedFiles.push(ev.target.files[i]);
      }
      setFiles(pushedFiles);
      onFileLoad(pushedFiles);
      setMode("log");
    }
  }

  function onFileLoad(files: File[]): void {
    let newLogs: Log[] = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file.name.slice(-4) !== ".csv") continue;
      let fileReader = new FileReader();
      fileReader.readAsText(file, "Shift_JIS");

      fileReader.onload = function () {
        let data = parseCSV(fileReader.result as string);
        let offset = 1;
        let dateLogs: Log[] = [];
        while (data.length - offset - 1 !== 0) {
          const time = Number(data[offset][6]) / constantMin;
          const hour = ("0" + ((time / 60) | 0)).slice(-2);
          const min = ("0" + (time % 60 | 0)).slice(-2);
          const newLog = {
            date: data[offset][0],
            group: data[offset][1],
            name: data[offset][2],
            id: data[offset][3],
            age: data[offset][4],
            sex: data[offset][5],
            time: hour + " : " + min,
            note: data[offset][7],
          };
          dateLogs.push(newLog);
          offset++;
        }
        newLogs.push(...dateLogs);
        const filteredData = Array.from(
          new Map(
            newLogs.map((log) => [log.date + log.time + log.name, log])
          ).values()
        );
        const sortedData = filteredData.sort(function (a, b) {
          return a.date > b.date ? -1 : 1;
        });
        setData(sortedData);
      };
    }
  }

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
    let dateLogs: Log[] = [];
    JSON.parse(data).forEach((d: any) => {
      const time = Number(d.参拝時間) / constantMin;
      const hour = ("0" + ((time / 60) | 0)).slice(-2);
      const min = ("0" + (time % 60 | 0)).slice(-2);

      const newLog = {
        date: d.参拝日付,
        group: d.所属,
        name: d.参拝者,
        id: d.会員番号,
        age: d.年齢,
        sex: d.性別,
        time: hour + " : " + min,
        note: d.備考,
      };
      dateLogs.push(newLog);
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
