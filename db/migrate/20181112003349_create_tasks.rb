class CreateTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :tasks do |t|

      t.timestamps
      t.string      :name             # Name of the task
      t.text        :description      # Description of the task

      t.text        :category         # Category of task for organizing internally
      t.text        :tags             # List of tags, separated by commas, for searching tasks

      t.integer     :priority         # How important it is to schedule this as num/10

      t.integer     :duration         # Approximate length of task, in minutes

      t.integer     :occurrence_term  # Length of time, in days, that you are counting occurrences
      t.integer     :occurrence_num   # # of times task should be scheduled in occurrence term

    end
  end
end
