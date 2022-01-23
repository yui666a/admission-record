import StaticPage from "./Pages/StaticPage";
import Sidebar from "./Pages/Sidebar";
import InitialDisplay from "./Pages/InitialDisplay";
import { useState } from "react";
import styled from "styled-components";

interface Log {
  date: string;
  group: string;
  name: string;
  id: string;
  age: string;
  sex: string;
  time: string;
  note?: string;
}

function App() {
  const [data, setData] = useState<Log[]>([]);
  const [files, setFiles] = useState<File[]>([]);

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
    }
  }

  function onFileLoad(files: File[]): void {
    let newLogs: Log[] = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let fileReader = new FileReader();
      fileReader.readAsText(file, "Shift_JIS");

      fileReader.onload = function () {
        let data = parseCSV(fileReader.result as string);
        let offset = 1;
        let dateLogs: Log[] = [];
        while (data.length - offset - 1 !== 0) {
          const newLog = {
            date: data[offset][0],
            group: data[offset][1],
            name: data[offset][2],
            id: data[offset][3],
            age: data[offset][4],
            sex: data[offset][5],
            time: data[offset][6],
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

  return (
    <Body className="App">
      <Sidebar />
      {files.length === 0 ? (
        <InitialDisplay onFilesInput={onFilesInput} />
      ) : (
        <StaticPage onFileLoad={() => onFileLoad(files)} data={data} />
      )}
    </Body>
  );
}

export default App;
const Body = styled.div`
  display: flex;
`;
