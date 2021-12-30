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
  lastExportedDate = sheetCustomerList.Cells(Rows.Count, 1).End(xlUp)

  Set rowNum = sheetVisitLog.Range("A:A").Find(What:=lastExportedDate, LookAt:=xlWhole, SearchDirection:=xlPrevious)
  lastRowNum= sheetVisitLog.Cells(Rows.Count, 1).End(xlUp).Row
  Set newData = sheetVisitLog.Range("A" & rowNum.Row + 1).Resize(lastRowNum - rowNum.Row, 7)

  checkDate = lastExportedDate
  ' 前日まで繰り返す
  While DateDiff("d", checkDate, today)
    MsgBox checkDate

    ' 該当日(checkDate)を全件取得
    Dim FoundCell As Range, FirstCell As Range, Target As Range
    Set FoundCell = newData.Find(What:=checkDate)
    If FoundCell Is Nothing Then
        MsgBox "見つかりません"
    Else
        Set FirstCell = FoundCell
        Set Target = FoundCell
    End If
    Do While Not FoundCell Is Nothing
        Set FoundCell = newData.FindNext(FoundCell)
        If FoundCell.Address = FirstCell.Address Then
            Exit Do
        Else
            MsgBox FoundCell.Value
        End If
    Loop

    checkDate = DateAdd("d", 1, Format(checkDate, "yyyy/mm/dd") + " 00:00:00")
  Wend

  Application.ScreenUpdating = True ' 画面の更新を復活
  Application.EnableEvents = True 'イベントの発生を有効
End Sub