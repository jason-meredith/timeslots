class AddCalendarToEvents < ActiveRecord::Migration[5.1]
  def change
    add_reference :external_events, :external_calendar, foreign_key: true
  end
end