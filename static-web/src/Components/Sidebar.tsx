import styled from "styled-components";

const Sidebar = function () {
  return (
    <Bar>
      <ul>
        <li>Top</li>
        <li>月別</li>
        <li>昨年との比較</li>
      </ul>
    </Bar>
  );
};
export default Sidebar;

const Bar = styled.div`
  // background: red;
  border: 1px solid grey;
  height: 100vh;
  width: 200px;
`;
