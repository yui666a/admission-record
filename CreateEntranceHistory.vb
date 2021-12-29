Private Const customerIdColumn As Integer = 4
Private Const customerNameColumn As Integer = 3
Private Const sheetCustomerName As String = "会員名簿"

Private Sub Worksheet_Change(ByVal Target As Range)
  Application.ScreenUpdating = False ' 画面の更新を抑制
  Application.EnableEvents= False ' イベントの発生を無効

  ' D列に変化があった時
  If Not Intersect(Target, Range("D:D")) Is Nothing Then
    lastRowIdNum = Cells(Rows.Count, customerIdColumn).End(xlUp).Row
    ' ' 名前を入力されることを想定して記述．当分利用されないと思われるため，コメントアウト
    lastRowNameNum = Cells(Rows.Count, customerNameColumn).End(xlUp).Row
    If lastRowIdNum > lastRowNameNum Then lastRowNum = lastRowIdNum Else lastRowNum = lastRowNameNum
    ' lastRowNum = lastRowIdNum

    ' 会員DBから会員番号で会員情報を取得
    Dim sheetCustomerList As Worksheet
    Set sheetCustomerList = Worksheets(sheetCustomerName)
    Set customerId = Cells(lastRowNum, 4)
    Cells(lastRowNum, 4) = StrConv(customerId, vbNarrow)
    Set rowNum = sheetCustomerList.Range("A:A").Find(What:=customerId, LookAt:=xlWhole)

    If rowNum Is Nothing Then
      ' 一致する会員番号が存在しなかった
      Cells(lastRowNum, 1) = Format(Date, "yyyy/mm/dd") 'column A(参拝日付)
      Cells(lastRowNum, 7) = Format(Time, "hh:mm:ss") 'column G(参拝時間)
    Else
      ' 会員情報を取得できた
      Set customerData = sheetCustomerList.Range("A" & rowNum.Row).Resize(1, 9)
      Dim before(3 - 1) ' A~C列
      Dim after(3 - 1) ' E~G列
      before(0) = Format(Date, "yyyy/mm/dd") 'column A(参拝日付)
      before(1) = customerData(6) ' 所属
      before(2) = customerData(2) ' 氏名

      after(0) = CInt(GetAge(customerData(4))) ' 年齢
      after(1) = customerData(5) ' 性別
      after(2) = Format(Time, "hh:mm:ss") 'column G(参拝時間)

      ' 値を出力する範囲を指定
      Set inputAreaBefore = Range("A" & lastRowNum).Resize(1, 3)
      Set inputAreaAfter  = Range("E" & lastRowNum).Resize(1, 3)
      '配列を代入
      inputAreaBefore.Value = before
      inputAreaAfter.Value = after
    End If
  End If

  Application.ScreenUpdating = True ' 画面の更新を復活
  Application.EnableEvents= True 'イベントの発生を有効
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