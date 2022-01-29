import styled from "styled-components";
import Log from "../Type/Log";
import Table from "./Table";

interface Props {
  onFileLoad?: Function;
  data: Log[];
}

const LogPage = function (props: Props) {
  return (
    <Content>
      <Table data={props.data} />
    </Content>
  );
};
export default LogPage;

const Content = styled.div`
  // background: blue;
  height: 100vh;
  width: calc(100vw - 200px);
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 50px;
`;
