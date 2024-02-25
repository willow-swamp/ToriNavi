module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.js'
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#e85d04",     // オレンジ焼き色。主要なボタンやリンクに使う。
          "secondary": "#353535",   // 炭の灰。背景やサブ要素に使うと良い。
          "accent": "#6a994e",      // シソの緑。特別なボタンやハイライトに使う。
          "neutral": "#ab884c",     // 既存の色。タレの色のようなイメージ。
          "base-100": "#f8c56e",   // 既存の色。焼き鳥の焼き上がった色のような明るいイメージ。
          "info": "#4c8aab",       // 落ち着いた青色。情報の提供や通知に使う。
          "success": "#9bc53d",    // 明るい緑色。成功のメッセージや通知に使う。
          "warning": "#f39237",    // 明るいオレンジ色。警告メッセージに使う。
          "error": "#d83367",      // 落ち着いたピンク赤。エラーメッセージや注意が必要な部分に使う。
        },
      },
    ],
  },
  plugins: [
    require("daisyui")
  ]
}
