Private Const sheetNameDailyTotalization = "参拝者日別集計"
Private Const sheetNameMonthlyTotalization = "参拝者月別集計"
Private Const sheetNameVisitLog = "参拝者履歴"
Private Const sheetNameCompareWithLastYear = "前年同月との比較"


Private Sub Workbook_Open()
  '
  ' ファイル起動時に実行
  '
  Application.ScreenUpdating = False ' 画面の更新を抑制
  Application.EnableEvents = False ' イベントの発生を無効

  dailyStatic
  monthlyStatic
  compareWithLastYear

  Application.ScreenUpdating = True ' 画面の更新を復活
  Application.EnableEvents = True 'イベントの発生を有効
End Sub

Sub dailyStatic()

  Set sheetDailyTotalization = Worksheets(sheetNameDailyTotalization)
  Set sheetVisitLog = Worksheets(sheetNameVisitLog)

  today = Format(Date, "yyyy/mm/dd")
  lastRowNumReport = sheetDailyTotalization.Cells(Rows.Count, 1).End(xlUp).Row
  checkingDate = sheetDailyTotalization.Cells(lastRowNumReport, 1)
  offsetLine = 0
  If checkingDate = "参拝日付" Then ' 過去の集計情報が存在しなかった場合
    checkingDate = sheetVisitLog.Cells(2, 1)
    offsetLine = offsetLine + 1
  End If

  If checkingDate = "" Then ' 過去の参拝者履歴が存在しなかった場合
    MsgBox "シート「参拝者履歴」のA2セルに参拝者履歴が存在しなかったため，統計情報を出力しませんでした"
    Application.ScreenUpdating = True ' 画面の更新を復活
    Application.EnableEvents = True 'イベントの発生を有効
    Exit Sub
  End If
  checkingDate = Format(checkingDate, "yyyy/mm/dd")
  Set rowNum = sheetVisitLog.Range("A:A").Find(What:=checkingDate, LookAt:=xlWhole, SearchDirection:=xlNext)
  Do while rowNum Is Nothing and DateDiff("d", checkingDate, today) '存在しなかった場合，次の日を検索
    checkingDate = DateAdd("d", 1, Format(checkingDate, "yyyy/mm/dd") + " 00:00:00")
    checkingDate = Format(checkingDate, "yyyy/mm/dd")
    Set rowNum = sheetVisitLog.Range("A:A").Find(What:=checkingDate, LookAt:=xlWhole, SearchDirection:=xlNext)
  Loop
  lastRowNum = sheetVisitLog.Cells(Rows.Count, 1).End(xlUp).Row

  If DateDiff("d", checkingDate, today) = 0 Then
    Application.ScreenUpdating = True ' 画面の更新を復活
    Application.EnableEvents = True 'イベントの発生を有効
    Exit Sub
  End If

  Set newData = sheetVisitLog.Range("A" & rowNum.Row).Resize(lastRowNum - rowNum.Row + 1, 7)

  ' 前日まで繰り返す
  Do While DateDiff("d", checkingDate, today)
    ' ファイル出力ここから
    fileName = Replace(checkingDate, "/", "-")
    Dim csvFile As String
    splitedDate = Split(fileName, "-")
    dirName = splitedDate(0)
    ' csvFile = ActiveWorkbook.Path & "/dailyLog/" & dirName & "/" & fileName & ".csv"
    csvFile = ActiveWorkbook.Path & "/dailyLog/" & fileName & ".csv"
    Open csvFile For Output As #1
    Print #1, "日付,所属,参拝者,会員番号,年齢,性別,参拝時間,備考（参拝理由など）," & vbCr;
    Dim j As Long
    ' ファイル出力ここまで

    Dim womanNum As Integer, manNum As Integer
    womanNum = 0
    manNum = 0
    Dim generations(12) As Integer
    Erase generations

    ' 該当日(checkingDate)を全件取得
    Dim FoundCell As Range, FirstCell As Range
    Set FoundCell = newData.Find(What:=checkingDate)
    If FoundCell Is Nothing Then
      sheetDailyTotalization.Range("A" & lastRowNumReport + offsetLine).Value = Format(checkingDate, "yyyy/mm/dd")
      Dim zeros(12) As Integer
      Erase zeros
      Set inputArea = sheetDailyTotalization.Range("B" & lastRowNumReport + offsetLine).Resize(1, 13)
      inputArea.Value = zeros
      GoTo Continue
    Else
      Set FirstCell = FoundCell
      If FoundCell.Offset(0, 5).Value = "女" Then
        womanNum = womanNum + 1
      Else
        manNum = manNum + 1
      End If
      generation = FoundCell.Offset(0, 4).Value ¥ 10
      generations(generation) = generations(generation) + 1

      ' ファイル出力ここから
      j = 0
      Do While FoundCell.Offset(0, j+1).Value <> ""
        Print #1, FoundCell.Offset(0, j).Value & ",";
        j = j + 1
      Loop
      Print #1, FoundCell.Offset(0, j).Value & vbCr;
      ' ファイル出力ここまで
    End If

    Do While Not FoundCell Is Nothing
      Set FoundCell = newData.FindNext(FoundCell)
      If FoundCell.Address = FirstCell.Address Then
        Exit Do
      Else
        If FoundCell.Offset(0, 5).Value = "女" Then
          womanNum = womanNum + 1
        Else
          manNum = manNum + 1
        End If
        generation = FoundCell.Offset(0, 4).Value ¥ 10
        generations(generation) = generations(generation) + 1

        ' ファイル出力ここから
        j = 0
        Do While FoundCell.Offset(0, j+1).Value <> ""
          Print #1, FoundCell.Offset(0, j).Value & ",";
          j = j + 1
        Loop
        Print #1, FoundCell.Offset(0, j).Value & vbCr;
        ' ファイル出力ここまで
      End If
    Loop
    Dim newLine(13)
    newLine(0) = Format(checkingDate, "yyyy/mm/dd")
    newLine(1) = manNum + womanNum
    newLine(2) = manNum
    newLine(3) = womanNum
    newLine(4) = generations(0)
    newLine(5) = generations(1)
    newLine(6) = generations(2)
    newLine(7) = generations(3)
    newLine(8) = generations(4)
    newLine(9) = generations(5)
    newLine(10) = generations(6)
    newLine(11) = generations(7)
    newLine(12) = generations(8)
    newLine(13) = generations(9) + generations(10) + generations(11)
    Set inputArea = sheetDailyTotalization.Range("A" & lastRowNumReport + offsetLine).Resize(1, 14)
    inputArea.Value = newLine
Continue:
    checkingDate = DateAdd("d", 1, Format(checkingDate, "yyyy/mm/dd") + " 00:00:00")
    checkingDate = Format(checkingDate, "yyyy/mm/dd")
    offsetLine = offsetLine + 1
    ' ファイル出力ここから
    Close #1
    ' ファイル出力ここまで
  Loop
End Sub


Sub monthlyStatic()
  Set sheetDailyTotalization = Worksheets(sheetNameDailyTotalization)
  Set sheetMonthlyTotalization = Worksheets(sheetNameMonthlyTotalization)
  today = Format(Date, "yyyy/mm/dd")
  lastRowNumReport = sheetMonthlyTotalization.Cells(Rows.Count, 1).End(xlUp).Row
  checkingMonth = sheetMonthlyTotalization.Cells(lastRowNumReport, 1)
  offsetLine = 0
  If checkingMonth = "月" Then ' 過去の集計情報が存在しなかった場合
    checkingMonth = sheetDailyTotalization.Cells(3, 1)
    offsetLine = offsetLine + 1
  End If
  If checkingMonth = "" Then ' 過去の参拝者履歴が存在しなかった場合
    MsgBox "シート「参拝者履歴」のA2セルに参拝者履歴が存在しなかったため，統計情報を出力しませんでした"
    Application.ScreenUpdating = True ' 画面の更新を復活
    Application.EnableEvents = True 'イベントの発生を有効
    Exit Sub
  End If

  checkingMonth = Format(checkingMonth, "yyyy/mm/dd")
  Set rowNum = sheetDailyTotalization.Range("A:A").Find(What:=checkingMonth, LookAt:=xlPart, LookIn:=xlValues, SearchDirection:=xlNext)
  Do while rowNum Is Nothing and DateDiff("m", checkingMonth, today) > -1 '存在しなかった場合，次の日を検索
    sheetMonthlyTotalization.Range("A" & lastRowNumReport + offsetLine).Value = Format(checkingMonth, "yyyy/mm")
    Dim zeros(12) As Integer
    Erase zeros
    Set inputArea = sheetMonthlyTotalization.Range("B" & lastRowNumReport + offsetLine).Resize(1, 13)
    inputArea.Value = zeros

    checkingMonth = DateAdd("m", 1, Format(checkingMonth, "yyyy/mm/dd") + " 00:00:00")
    checkingMonth = Format(checkingMonth, "yyyy/mm")
    Set rowNum = sheetDailyTotalization.Range("A:A").Find(What:=checkingMonth, LookAt:=xlPart, LookIn:=xlValues, SearchDirection:=xlNext)
    offsetLine = offsetLine + 1
  Loop

  If rowNum Is Nothing Then
    Application.ScreenUpdating = True ' 画面の更新を復活
    Application.EnableEvents = True 'イベントの発生を有効
    Exit Sub
  end if

  lastRowNum = sheetDailyTotalization.Cells(Rows.Count, 1).End(xlUp).Row
  If DateDiff("m", checkingMonth, today) = 0 Then
    Application.ScreenUpdating = True ' 画面の更新を復活
    Application.EnableEvents = True 'イベントの発生を有効
    Exit Sub
  End If
  Set newData = sheetDailyTotalization.Range("A" & rowNum.Row).Resize(lastRowNum - rowNum.Row + 1, 14)
  ' 前月まで繰り返す
  Do While DateDiff("m", checkingMonth, today)
    Dim newLine(13)
    Erase newLine
    newLine(0) = Format(checkingMonth, "yyyy/mm")
    ' 該当月(checkingMonth)を全件取得
    Dim FoundCell As Range, FirstCell As Range
    Set FoundCell = newData.Find(What:=newLine(0), LookAt:=xlPart, LookIn:=xlValues, SearchDirection:=xlNext)
    If FoundCell Is Nothing Then
      sheetMonthlyTotalization.Range("A" & lastRowNumReport + offsetLine).Value = Format(checkingMonth, "yyyy/mm")
      Erase zeros
      Set inputArea = sheetMonthlyTotalization.Range("B" & lastRowNumReport + offsetLine).Resize(1, 13)
      inputArea.Value = zeros
      GoTo Continue
    Else
      Set FirstCell = FoundCell
      Dim i As Integer ' インデックス用の変数
      For i = 1 To 13
        newLine(i) = newLine(i) + FoundCell.Offset(0, i).Value
      Next
    End If
    Do While Not FoundCell Is Nothing
      Set FoundCell = newData.FindNext(FoundCell)
      If FoundCell.Address = FirstCell.Address Then
        Exit Do
      Else
        For i = 1 To 13
          newLine(i) = newLine(i) + FoundCell.Offset(0, i).Value
        Next
      End If
    Loop
    Set inputArea = sheetMonthlyTotalization.Range("A" & lastRowNumReport + offsetLine).Resize(1, 14)
    inputArea.Value = newLine
Continue:
    checkingMonth = DateAdd("m", 1, Format(checkingMonth, "yyyy/mm/dd") + " 00:00:00")
    offsetLine = offsetLine + 1
  Loop
End Sub

Sub compareWithLastYear()

  Set sheetCompareWithLastYear = Worksheets(sheetNameCompareWithLastYear)
  Set sheetMonthlyTotalization = Worksheets(sheetNameMonthlyTotalization)

  today = Format(Date, "yyyy/mm/dd")
  lastRowNumReport = sheetCompareWithLastYear.Cells(Rows.Count, 1).End(xlUp).Row
  checkingMonth = sheetCompareWithLastYear.Cells(lastRowNumReport, 1)
  checkingMonth = Format(checkingMonth, "yyyy/mm")

  offsetLine = 0
  if checkingMonth = "対象月" Then
    checkingMonth = DateAdd("m", -1, Format(today, "yyyy/mm/dd") + " 00:00:00")
    checkingMonth = Format(checkingMonth, "yyyy/mm")
    offsetLine = offsetLine + 1
  end If

  Set rowNum = sheetMonthlyTotalization.Range("A:A").Find(What:=checkingMonth, LookAt:=xlPart, LookIn:=xlValues, SearchDirection:=xlNext)
  Do while rowNum Is Nothing and DateDiff("m", checkingMonth, today) > -1 '存在しなかった場合，次の日を検索
    checkingMonth = DateAdd("m", 1, Format(checkingMonth, "yyyy/mm/dd") + " 00:00:00")
    checkingMonth = Format(checkingMonth, "yyyy/mm")
    Set rowNum = sheetMonthlyTotalization.Range("A:A").Find(What:=checkingMonth, LookAt:=xlPart, LookIn:=xlValues, SearchDirection:=xlNext)
  Loop

  If rowNum Is Nothing Then
    Application.ScreenUpdating = True ' 画面の更新を復活
    Application.EnableEvents = True 'イベントの発生を有効
    Exit Sub
  end if

  If DateDiff("m", checkingMonth, today) = -1 Then
    Application.ScreenUpdating = True ' 画面の更新を復活
    Application.EnableEvents = True 'イベントの発生を有効
    Exit Sub
  End If
  ' 前月まで繰り返す
  Do While DateDiff("m", checkingMonth, today)
    Dim newLine(14)
    Erase newLine
    newLine(0) = Format(checkingMonth, "yyyy/mm")
    monthOfLastYear = DateAdd("yyyy", -1, Format(checkingMonth, "yyyy/mm/dd") + " 00:00:00")
    monthOfLastYear = Format(monthOfLastYear, "yyyy/mm")
    newLine(1) = monthOfLastYear
    Dim targetYearCell As Range, lastYearCell As Range
    Set targetYearCell = sheetMonthlyTotalization.Range("A:A").Find(What:=newLine(0), LookAt:=xlPart, LookIn:=xlValues, SearchDirection:=xlNext)
    Set lastYearCell = sheetMonthlyTotalization.Range("A:A").Find(What:=newLine(1), LookAt:=xlPart, LookIn:=xlValues, SearchDirection:=xlNext)
    If targetYearCell Is Nothing Then
      sheetCompareWithLastYear.Range("A" & lastRowNumReport + offsetLine).Value = Format(checkingMonth, "yyyy/mm")
      sheetCompareWithLastYear.Range("B" & lastRowNumReport + offsetLine).Value = Format(monthOfLastYear, "yyyy/mm")
      Dim zeros(12) As Integer
      Erase zeros
      Set inputArea = sheetCompareWithLastYear.Range("C" & lastRowNumReport + offsetLine).Resize(1, 13)
      inputArea.Value = zeros
      GoTo Continue
    Else
      Dim i As Integer ' インデックス用の変数
      if lastYearCell Is Nothing Then
        For i = 2 To 14
          newLine(i) = targetYearCell.Offset(0, i - 1).Value
        Next
      else
        For i = 2 To 14
          newLine(i) = targetYearCell.Offset(0, i - 1).Value - lastYearCell.Offset(0, i - 1).Value
        Next
      end if
    End If
    Set inputArea = sheetCompareWithLastYear.Range("A" & lastRowNumReport + offsetLine).Resize(1, 15)
    inputArea.Value = newLine
Continue:
    checkingMonth = DateAdd("m", 1, Format(checkingMonth, "yyyy/mm/dd") + " 00:00:00")
    checkingMonth = Format(checkingMonth, "yyyy/mm")
    offsetLine = offsetLine + 1
  Loop
End Sub