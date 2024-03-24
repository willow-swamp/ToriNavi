class TopsController < ApplicationController
  def index
    params = {
      v: 'beta',
      libraries: 'marker,places',
      callback: 'initMap'
    }
    query = URI.encode_www_form(params)
    api_key = Rails.application.credentials.google_map[:api_key]
    @uri = URI.parse("https://maps.googleapis.com/maps/api/js?key=#{api_key}&#{query}")
  end

  def search
    @google_places = GooglePlace.search(params[:lat], params[:lng])
    render json: @google_places
  end
end
