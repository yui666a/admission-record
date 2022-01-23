import Log from "../Type/Log";

interface Props {
  data: Log[];
}

function Table(props: Props) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>所属</th>
            <th>会員名</th>
            <th>会員番号</th>
            <th>年齢</th>
            <th>性別</th>
            <th>時間</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((log) => {
            return (
              <tr key={log.date + log.time + log.name}>
                <td>{log.date}</td>
                <td>{log.group}</td>
                <td>{log.name}</td>
                <td>{log.id}</td>
                <td>{log.age}</td>
                <td>{log.sex}</td>
                <td>{log.time}</td>
                <td>{log.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Table;
