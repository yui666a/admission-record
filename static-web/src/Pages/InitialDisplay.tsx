interface Props {
  onFilesInput: Function;
}

const InitialDisplay = function (props: Props) {
  return (
    <div>
      ようこそ<br/>
      下の「ファイルを選択」ボタンをクリックして「dailyLog」ディレクトリを選択し，<br/>
      過去の履歴ファイルをアップロードしてください
      <br /><br/>
      ※画面上部に警告が出る場合があります．<br/>
      ネット上に公開されないので，アップロードをしてください．<br/><br/>
      <input
        type="file"
        id="file"
        name="upfile[]"
        /* @ts-expect-error */
        webkitdirectory=""
        onChange={(e) => props.onFilesInput(e)}
      />
    </div>
  );
};

export default InitialDisplay;
