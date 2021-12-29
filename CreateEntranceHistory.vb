Private Const customerIdColumn As Integer = 4
Private Const customerNameColumn As Integer = 3
Private Const sheetCustomerName As String = "会員名簿"

Private Sub Worksheet_Change(ByVal Target As Range)
  ' 画面の更新を抑制（False）
  Application.ScreenUpdating = False

  ' D列に変化があった時
  If Not Intersect(Target, Range("C:D")) Is Nothing Then
    lastRowIdNum = Cells(Rows.Count, customerIdColumn).End(xlUp).Row
    lastRowNameNum = Cells(Rows.Count, customerNameColumn).End(xlUp).Row
    If lastRowIdNum > lastRowNameNum Then lastRowNum = lastRowIdNum Else lastRowNum = lastRowNameNum
    Cells(lastRowNum, 1) = Format(Date, "yyyy/mm/dd") 'column A(参拝日付)
    Cells(lastRowNum, 7) = Format(Time, "hh:mm:ss") 'column G(参拝時間)

    ' 会員DBから会員番号で会員情報を取得
    Dim sheetCustomerList As Worksheet
    Set sheetCustomerList = Worksheets(sheetCustomerName)
    Set rowNum = sheetCustomerList.Range("A:A").Find(What:=Cells(lastRowNum, 4), LookAt:=xlWhole)

    If rowNum Is Nothing Then
      ' MsgBox "みつかりませんでした。"
    Else
      ' MsgBox rowNum.Row
      Cells(lastRowNum, 2) = sheetCustomerList.Cells(rowNum.Row, 6) ' 所属
      Cells(lastRowNum, 3) = sheetCustomerList.Cells(rowNum.Row, 2) ' 氏名
      Cells(lastRowNum, 5) = GetAge(sheetCustomerList.Cells(rowNum.Row, 4)) ' 年齢
      Cells(lastRowNum, 6) = sheetCustomerList.Cells(rowNum.Row, 5) ' 性別
    End If
  End If

  ' 画面の更新を復活（True）
  Application.ScreenUpdating = True
End Sub

Function GetAge(ByVal birthday As String) As Integer
  Dim age As Integer
  If IsDate(birthday) = False Then
      GetAge = -1
      Exit Function
  End If

  age = DateDiff("yyyy", birthday, Now)
  '// 引数月日がシステム日付に達していない場合
  If Date < DateSerial(Year(Now), Month(birthday), Day(birthday)) Then
      age = age - 1
  End If
  GetAge = CInt(age)
End Function