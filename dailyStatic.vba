Private Const sheetCustomerName = "参拝者集計"

Sub aaa()
' Private Sub Workbook_Open()
  ' ファイル起動時に実行
'
' ここに説明文記述
'

  Application.ScreenUpdating = False ' 画面の更新を抑制
  Application.EnableEvents = False ' イベントの発生を無効

  Set sheetCustomerList = Worksheets(sheetCustomerName)
  today = Format(Date, "yyyy/mm/dd")
  lastExportedDate = sheetCustomerList.Cells(Rows.Count, 1).End(xlUp)

  checkDate = lastExportedDate
  ' 前日まで繰り返す
  While DateDiff("d", checkDate, today)
    MsgBox checkDate
    checkDate = DateAdd("d", 1, Format(checkDate, "yyyy/mm/dd") + " 00:00:00")
  Wend

  Application.ScreenUpdating = True ' 画面の更新を復活
  Application.EnableEvents = True 'イベントの発生を有効
End Sub

