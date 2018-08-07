class ScheduledTask < ApplicationRecord
  include Week_Viewable

  belongs_to :task


end
