class CreateScheduledTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :scheduled_tasks do |t|

      t.timestamps
    end
  end
end
