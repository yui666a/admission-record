import ExcelInput from "../Components/ExcelInput";

interface Props {
  onFilesInput: Function;
}

const InitialDisplay = function (props: Props) {
  return (
    <div>
      ようこそ
      <br />
      はじめにエクセルファイルを選択してください
      <br />
      <br />
      ※画面上部に警告が出る場合があります．
      <br />
      ネット上に公開されないので，安心してアップロードをしてください．
      <br />
      <ExcelInput
        onInput={(a: any) => {
          props.onFilesInput(a);
        }}
      />
      {/* <input
        type="file"
        id="file"
        name="upfile[]"
        / * @ts-expect-error * /
        webkitdirectory=""
        onChange={(e) => props.onFilesInput(e)}
      /> */}
    </div>
  );
};

export default InitialDisplay;
