class AddGroupToTask < ActiveRecord::Migration[5.1]
  def change
    add_reference :tasks, :group, foreign_key: true
  end
end
