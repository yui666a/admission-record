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

    ' 会員DBから会員番号で会員情報を取得
    Dim sheetCustomerList As Worksheet
    Set sheetCustomerList = Worksheets(sheetCustomerName)
    Set rowNum = sheetCustomerList.Range("A:A").Find(What:=Cells(lastRowNum, 4), LookAt:=xlWhole)

    If rowNum Is Nothing Then
      MsgBox "会員情報が見つかりませんでした。登録お願いします"
    Else
      Set customerData = sheetCustomerList.Range("A" & rowNum.Row).Resize(1, 9)
      Dim before(3 - 1) As String
      Dim after(3 - 1) As String
      before(0) = Format(Date, "yyyy/mm/dd") 'column A(参拝日付)
      before(1) = customerData(6) ' 所属
      before(2) = customerData(2) ' 氏名

      after(0) = GetAge(customerData(4)) ' 年齢
      after(1) = customerData(5) ' 性別
      after(2) = Format(Time, "hh:mm:ss") 'column G(参拝時間)
      Set inputAreaBefore = Range("A" & lastRowNum).Resize(1, 3)
      Set inputAreaAfter  = Range("E" & lastRowNum).Resize(1, 3)

      '配列を代入
      inputAreaBefore.Value = before
      inputAreaAfter.Value = after
    End If
  End If

  ' 画面の更新を復活（True）
  Application.ScreenUpdating = True
End Sub

Function GetAge(ByVal birthday As String) As String
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
  GetAge = age
End Function