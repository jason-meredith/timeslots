class ScheduledTask < ApplicationRecord
  include Week_Viewable

  belongs_to :task



  def group
    task.group
  end


end
