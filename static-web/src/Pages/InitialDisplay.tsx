interface Props {
  onFilesInput: Function;
}

const InitialDisplay = function (props: Props) {
  return (
    <div>
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
