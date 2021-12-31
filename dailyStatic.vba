Private Const sheetCustomerName = "参拝者集計"
Private Const sheetNameVisitLog = "参拝者履歴"
Sub aaa()
' Private Sub Workbook_Open()
  ' ファイル起動時に実行
'
' ここに説明文記述
'

  Application.ScreenUpdating = False ' 画面の更新を抑制
  Application.EnableEvents = False ' イベントの発生を無効

  Set sheetCustomerList = Worksheets(sheetCustomerName)
  Set sheetVisitLog = Worksheets(sheetNameVisitLog)

  today = Format(Date, "yyyy/mm/dd")
  lastRowNumReport = sheetCustomerList.Cells(Rows.Count, 1).End(xlUp).Row
  lastExportedDate = Cells(lastRowNumReport, 1)
  offsetLine = 0
  If lastExportedDate = "参拝日付" Then ' 過去の集計情報が存在しなかった場合
    lastExportedDate = sheetVisitLog.Cells(2, 1)
    offsetLine = offsetLine + 1
  End If
  If lastExportedDate = "" Then ' 過去の参拝者履歴が存在しなかった場合
    MsgBox "シート「参拝者履歴」のA2セルに参拝者履歴が存在しなかったため，統計情報を出力しませんでした"
    Exit Sub
  End If

  Set rowNum = sheetVisitLog.Range("A:A").Find(What:=lastExportedDate, LookAt:=xlWhole, SearchDirection:=xlNext)
  lastRowNum = sheetVisitLog.Cells(Rows.Count, 1).End(xlUp).Row


  checkDate = lastExportedDate
  If DateDiff("d", checkDate, today) = 0 Then
    Exit Sub
  End If
  Set newData = sheetVisitLog.Range("A" & rowNum.Row + 1).Resize(lastRowNum - rowNum.Row + 1, 7)
  ' 前日まで繰り返す
  Do While DateDiff("d", checkDate, today)
    Dim womanNum As Integer, manNum As Integer
    womanNum = 0
    manNum = 0
    Dim generations(12) As Integer
    Erase generations

    ' 該当日(checkDate)を全件取得
    Dim FoundCell As Range, FirstCell As Range, Target As Range
    Set FoundCell = newData.Find(What:=checkDate)
    If FoundCell Is Nothing Then
      Range("A" & lastRowNumReport + offsetLine).Value = checkDate
      Dim aaa(12) As Integer
      Set inputAreaBefore = Range("B" & lastRowNumReport + offsetLine).Resize(1, 13)
      inputAreaBefore.Value = aaa
      GoTo Continue ' Continue: の行へ処理を飛ばす
    Else
        Set FirstCell = FoundCell
        Set Target = FoundCell
        If FoundCell.Offset(0, 5).Value = "女" Then
          womanNum = womanNum + 1
        Else
          manNum = manNum + 1
        End If
        generation = FoundCell.Offset(0, 4).Value ¥ 10
        generations(generation) = generations(generation) + 1

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
        End If
    Loop
    Dim newLine(13)
    newLine(0) = checkDate
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
    Set inputAreaBefore = Range("A" & lastRowNumReport + offsetLine).Resize(1, 14)
    inputAreaBefore.Value = newLine
Continue:
    checkDate = DateAdd("d", 1, Format(checkDate, "yyyy/mm/dd") + " 00:00:00")
    offsetLine = offsetLine + 1
  Loop

  Application.ScreenUpdating = True ' 画面の更新を復活
  Application.EnableEvents = True 'イベントの発生を有効
End Sub
