import styled from "styled-components";
import Log from "../Type/Log";
import moment from "moment";
import { useCallback, useState } from "react";

interface Props {
  onFileLoad?: Function;
  data: Log[];
}
const today = moment();

const LogPage = function (props: Props) {
  const [selectedMonth, setMonth] = useState(moment(today).format("YYYY/MM"));
  const monthlyData = props.data.filter((log) => {
    // format YYYY/MM
    return log.date.slice(0, 7) === selectedMonth;
  });

  const moveMonth = useCallback(
    (move: number) => {
      setMonth(moment(selectedMonth).add(move, "month").format("YYYY/MM"));
    },
    [selectedMonth]
  );

  return (
    <>
      <Header>
        <button onClick={() => moveMonth(-1)}>＜</button>
        {moment(selectedMonth).format("YYYY年MM月")}
        <button onClick={() => moveMonth(1)}>＞</button>
      </Header>
      <TableWarpper>
        <thead>
          <tr>
            <th>日付</th>
            <th>時間</th>
            <th>所属</th>
            <th>会員名</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          {monthlyData.map((log) => {
            return (
              <Row key={log.date + log.time + log.name}>
                <MediumRow>
                  <Tip>
                    {
                      monthlyData.filter((data) => {
                        return data.date === log.date;
                      }).length
                    }
                    名
                  </Tip>
                  {log.date.substring(5)}
                </MediumRow>
                <SmallRow>{log.time}</SmallRow>
                <MediumRow>{log.group}</MediumRow>
                <MediumRow>
                  <Tip>
                    会員番号：{log.id}
                    <br />
                    年齢： {log.age} <br />
                    性別：{log.sex}
                  </Tip>
                  {log.name}
                </MediumRow>
                <td>{log.note}</td>
              </Row>
            );
          })}
        </tbody>
      </TableWarpper>
    </>
  );
};
export default LogPage;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 28px;
  margin-bottom: 20px;
`;

const TableWarpper = styled.table``;
const Row = styled.tr`
  position: relative;
  &:nth-child(odd) {
    background-color: #add8e6;
  }
`;

const SmallRow = styled.td`
  position: relative;
  width: 75px;
`;
const MediumRow = styled.td`
  position: relative;
  width: 75px;
  min-width: 120px;
`;

const Tip = styled.div`
  position: absolute;
  bottom: 30px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-weight: bold;
  border-radius: 4px;
  margin: 4px;
  display: none;
  z-index: 5;
  ${MediumRow}:hover & {
    display: block;
  }
  ${SmallRow}:hover & {
    display: block;
  }
`;
