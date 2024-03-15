class HotpepperApi
  require 'net/http'
  require 'uri'
  require 'json'

  class << self
    def search_shops(params = {})
      query = URI.encode_www_form(params)
      api_key = Rails.application.credentials.hotpepper[:api_key]
      uri = URI.parse("http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{api_key}&#{query}")
      json = Net::HTTP.get(uri)
      data_list = JSON.parse(json, symbolize_names: true)
      data_list.map do |data|
        AccessLog.new(data)
      end
    end
  end
end
