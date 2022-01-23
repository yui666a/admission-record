import styled from "styled-components";
import Test from "./Test";

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
interface Props {
  onFileLoad: Function;
  data: Log[];
}

const StaticPage = function (props: Props) {
  return (
    <Content>
      <button
        id="file"
        type="button"
        onClick={() => {
          props.onFileLoad();
        }}
      >
        表示
      </button>
      <Test data={props.data} />
    </Content>
  );
};
export default StaticPage;

const Content = styled.div`
  // background: blue;
  height: 100vh;
  width: calc(100vw - 400px);
`;
