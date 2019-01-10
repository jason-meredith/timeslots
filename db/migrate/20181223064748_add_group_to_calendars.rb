class AddGroupToCalendars < ActiveRecord::Migration[5.1]
  def change
    add_reference :external_calendars, :group, foreign_key: true
  end
end
