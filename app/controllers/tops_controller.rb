class TopsController < ApplicationController
  def index
    @google_places = GooglePlace.all
  end
end
