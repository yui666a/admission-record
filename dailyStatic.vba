Private Sub Workbook_Open()
  ' ファイル起動時に実行
  Application.ScreenUpdating = False ' 画面の更新を抑制
  Application.EnableEvents = False ' イベントの発生を無効

  Application.ScreenUpdating = True ' 画面の更新を復活
  Application.EnableEvents = True 'イベントの発生を有効
End Sub