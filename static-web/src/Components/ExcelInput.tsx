import React, { useRef, useState } from "react";
import XLSX from "xlsx";

interface Props {
  onInput: Function;
}

const ExcelInput = (props: Props) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const targetSheet = "参拝者履歴";

  const handleTriggerReadFile = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleReadFile = (fileObj: File) => {
    if (fileObj) {
      setFileName(fileObj.name);
      fileObj.arrayBuffer().then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "buffer", bookVBA: true });
        // const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[targetSheet];
        const data = XLSX.utils.sheet_to_json(worksheet);
        props.onInput(JSON.stringify(data));
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ paddingBottom: "20px" }}>Excelファイルをアップロードする</p>
      <button onClick={() => handleTriggerReadFile()}>ファイル選択</button>
      {!!fileName && <span>ファイル名：{fileName}</span>}
      <form style={{ display: "none" }}>
        <input
          type="file"
          // xlsm, slsxを許可
          // xlsm：application/vnd.ms-excel.sheet.macroenabled.12
          // slsx：application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroenabled.12"
          ref={fileInput}
          onChange={(e) => {
            e.preventDefault();
            handleReadFile(e.currentTarget.files![0]);
          }}
        />
      </form>
    </div>
  );
};
export default ExcelInput;
