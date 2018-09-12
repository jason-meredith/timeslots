class CreateScheduledTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :scheduled_tasks do |t|

      t.timestamps

      t.datetime :start

    end

    add_reference :scheduled_tasks, :task, foreign_key: true

  end
end
