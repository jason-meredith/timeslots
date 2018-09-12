class AddEndToScheduledTasks < ActiveRecord::Migration[5.1]
  def change

    add_column :scheduled_tasks, :end, :datetime


  end
end
