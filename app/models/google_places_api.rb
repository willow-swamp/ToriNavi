class GooglePlacesApi
  require 'net/http'
  require 'uri'
  require 'json'

  class << self
    def search_shops
      params = { keyword: '焼き鳥', location: '36.64311,138.18873', radius: '500', language: 'ja' }
      query = URI.encode_www_form(params)
      api_key = Rails.application.credentials.google_map[:api_key]
      uri = URI.parse("https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=#{api_key}&#{query}")
      json = Net::HTTP.get(uri)
      data_list = JSON.parse(json, symbolize_names: true)
      data_list[:results].map do |data|
        GooglePlaces.new(
          latitude: data.dig(:geometry, :location, :lat),
          longitude: data.dig(:geometry, :location, :lng),
          name: data[:name],
          opening_hours: data.dig(:opening_hours, :open_now).to_s,
          place_id: data[:place_id],
          rating: data[:rating].to_f,
          vicinity: data[:vicinity]
        )
      end
    end
  end
end
