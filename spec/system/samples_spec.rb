require 'rails_helper'

RSpec.describe "Samples", type: :system do
  it 'sample' do
    visit root_path
    expect(page).to have_content 'Hello world'
  end
end
