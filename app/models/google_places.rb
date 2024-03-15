class GooglePlaces
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :latitude, :float
  attribute :longitude, :float
  attribute :name, :string
  attribute :opening_hours, :string
  attribute :place_id, :string
  attribute :rating, :float
  attribute :vicinity, :string

  class << self
    def all
      GooglePlacesApi.search_shops
    end
  end
end
