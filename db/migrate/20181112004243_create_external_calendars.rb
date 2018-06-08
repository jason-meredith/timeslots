class CreateExternalCalendars < ActiveRecord::Migration[5.1]
  def change
    create_table :external_calendars do |t|

      t.timestamps

      t.string :name         # Calendar name
      t.string :url          # *.ics download URL
      t.string :color        # Color that the calendar appears as
      t.string :hash         # Hash value of last download to check for changes

    end
  end
end
