class AddRawCalColumn < ActiveRecord::Migration[5.1]
  def change
    add_column :external_calendars, :raw_ics_data, :text, :limit=>16777214
  end
end
