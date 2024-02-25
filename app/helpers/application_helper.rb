module ApplicationHelper
  def default_meta_tags
    {
      site: 'とりナビ',
      title: :title,
      reverse: true,
      description: 'とりナビ（ToriNavi）は、焼き鳥愛好者のための店舗検索・情報共有アプリケーションです。',
      keywords: '焼き鳥,とりなび,とりナビ,焼き鳥屋,焼き鳥店,焼き鳥情報,焼き鳥ランキング,焼き鳥検索',
      canonical: request.original_url,
      separator: '|',
      og: {
        title: :title,
        type: 'website',
        url: request.original_url,
        site_name: :site,
        description: :description,
        image: image_url('torinavi_ogp.png'),
      },
      twitter: {
        card: 'summary_large_image',
        site: '@torinavi',
      }
    }
  end
end
