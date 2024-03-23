class TopsController < ApplicationController
  def index; end

  def search
    @google_places = GooglePlace.search(params[:lat], params[:lng])
    render json: @google_places
  end
end
