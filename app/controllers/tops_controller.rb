class TopsController < ApplicationController
  def index
    @google_places = GooglePlaces.all
  end
end
