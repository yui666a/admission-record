import styled from "styled-components";
interface Props {
  onClick: Function;
}

const Sidebar = function (props: Props) {
  return (
    <Bar>
      <ul>
        <li onClick={() => props.onClick("init")}>Top</li>
        <li onClick={() => props.onClick("log")}>参拝履歴</li>
        {/* <li onClick={() => props.onClick("static")}>日別参拝者比較</li> */}
        <li onClick={() => props.onClick("static")}>月別参拝者比較</li>
        <li onClick={() => props.onClick("compareLastYear")}>
          前年同月との比較
        </li>
      </ul>
    </Bar>
  );
};
export default Sidebar;

const Bar = styled.div`
  border-right: 1px solid grey;
  width: 200px;
  min-width: 200px;
  min-height: 100vh;
  & ul {
    padding: 0;
    & li
    list-style-type: none;
  }
`;
