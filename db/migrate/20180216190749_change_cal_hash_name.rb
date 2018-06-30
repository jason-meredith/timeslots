class ChangeCalHashName < ActiveRecord::Migration[5.1]
  def change
    rename_column :external_calendars, :hash, :diffhash
  end
end
