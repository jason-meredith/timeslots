class Task < ApplicationRecord

  has_many :scheduled_tasks, dependent: :delete_all
  belongs_to :group

  # Return how many more times this Task must be scheduled in the term
  # starting at start_date to complete term obligation
  def unscheduled_num(start_date)

    end_date = start_date + occurrence_term.days

    already_scheduled = times_scheduled_between_dates(start_date, end_date)

    occurrence_num - already_scheduled

  end

  # Returns num of times scheduled between two dates
  def times_scheduled_between_dates(start_date, end_date)
    scheduled_tasks.where(start: start_date..end_date).count
  end


  def autoschedule(start_date)

  end



end
