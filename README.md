- 入場者.xlsm

  - 参拝者を記録するエクセルマクロファイル

- static-web

  - 集計用ブラウザアプリ
  - React.js & typescript
  - build した静的ファイルは static-web/build

- CreateEntranceHistory.vba

  - 会員番号を入力されたら自動的に他の情報を入力するためのマクロ

- Static.vba
  - 過去の遺産

# 使用方法

1. エクセルファイルの会員名簿に必要情報を入力する
2. シート「参拝者履歴」を開き，D 列（会員名簿列）の列にポインタをあてて，バーコードを読む
3. 必要であれば備考列に内容を記入
4. ブラウザで index.html を開き，入力したエクセルファイルを読み込む