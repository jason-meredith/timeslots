class CreateGroups < ActiveRecord::Migration[5.1]
  def change
    create_table :groups do |t|

      t.timestamps
      t.string      :name             # Name of the group
    end

    create_table :groups_users, id: false do |t|
      t.belongs_to :group, index: true
      t.belongs_to :user, index: true
    end

  end
end
