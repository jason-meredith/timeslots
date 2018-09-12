class AddValidColumn < ActiveRecord::Migration[5.1]
  def change

    add_column :external_calendars, :valid_ics, :boolean
  end
end
