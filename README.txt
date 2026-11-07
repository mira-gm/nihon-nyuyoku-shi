日本入浴史 サイト一式

■ ファイル構成
index.html       トップページ
eras.html        時代選択ページ
period.html      作品・解説ページ（CSVから表示）
references.html  参考資料ページ
css/style.css    共通デザイン
js/main.js       CSV読み込み・作品表示・画像拡大
data/works.csv   作品データ（24件）
images/          作品画像24枚＋トップ画像1枚

■ 確認方法
GitHub Pagesなど、HTTPで配信される場所にフォルダ内のファイルをそのまま配置してください。
period.html は fetch() で data/works.csv を読み込むため、HTMLファイルを直接開く（file://）方法では作品データが表示されない場合があります。

■ 注意
CSVの画像ファイル名と images/ 内のファイル名は一致させてください。
フォルダ名・階層を変更しないでください。
年齢確認は自己申告のチェックであり、実際の年齢認証ではありません。
