class CreateExternalEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :external_events do |t|

      t.timestamps

      t.string :name          # Name of external event
      t.datetime :start       # Event start time
      t.datetime :end         # Event end time

    end
  end
end
