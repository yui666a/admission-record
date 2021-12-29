Private Const customerIdColumn As Integer = 4
Private Const customerNameColumn As Integer = 3
Private Const sheetCustomerName As String = "会員名簿"

Private Sub Worksheet_Change(ByVal Target As Range)
' D列に変化があった時
  If Not Intersect(Target, Range("C:D")) Is Nothing Then
    lastRowIdNum = Cells(Rows.Count, customerIdColumn).End(xlUp).Row
    lastRowNameNum = Cells(Rows.Count, customerNameColumn).End(xlUp).Row
    If lastRowIdNum > lastRowNameNum Then lastRowNum = lastRowIdNum Else lastRowNum = lastRowNameNum
    userNum = Cells(lastRowNum, 4)
    Cells(lastRowNum, 1) = Format(Date, "yyyy/mm/dd") 'column A(参拝日付)
    Cells(lastRowNum, 7) = Format(Time, "hh:mm:ss") 'column G(参拝時間)

    ' 会員DBから会員番号で会員情報を取得
    Dim sheetCustomerList As Worksheet
    Set sheetCustomerList = Worksheets(customerSheetName)
    Set rowNum = sheetCustomerList.Range("A:A").Find(What:=userNum, LookAt:=xlWhole)

    If rowNum Is Nothing Then
      MsgBox "みつかりませんでした。"
    Else
      MsgBox rowNum.Row
    End If
  End If
End Sub