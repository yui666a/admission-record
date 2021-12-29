Private Const customerIdColumn As integer = 4
Private Const customerNameColumn As integer = 3

Private Sub Worksheet_Change(ByVal Target As Range)
' D列に変化があった時
  If Not Intersect(Target, Range("C:D")) Is Nothing Then
    lastRowIdNum = Cells(Rows.Count, customerIdColumn).End(xlUp).Row
    lastRowNameNum = Cells(Rows.Count, customerNameColumn).End(xlUp).Row
    If lastRowIdNum > lastRowNameNum Then lastRowNum = lastRowIdNum Else lastRowNum = lastRowNameNum
    userNum = Cells(lastRowNum, 1)
    MsgBox lastRowNum
    Cells(lastRowNum, 1) = Format(Date, "yyyy/mm/dd") 'column A(参拝日付)
    Cells(lastRowNum, 7) = Format(Time, "hh:mm:ss") 'column G(参拝時間)
  End If
End Sub