class ExternalEvent < ApplicationRecord
  include Week_Viewable
  require 'schedule/Freetime'
  require 'schedule/EventPositioner'


  belongs_to :external_calendar


  def self.week_freetime( week_offset )

    time_period_start = Time.now.beginning_of_day + ( week_offset * 7.day )

    freetime_chunks = []

    all_week_events = ExternalEvent.where(start: time_period_start..time_period_start + 7.day)

    all_scheduled_tasks = ScheduledTask.where(start: time_period_start..time_period_start + 7.day)


    7.times do |weekday|
      day = time_period_start + weekday.day
      day_events = []

      all_week_events.where(start: time_period_start + weekday.day..time_period_start.end_of_day + weekday.day).each do |event|
        day_events << {
            start: event.start,
            end: event.end
        }
      end


      all_scheduled_tasks.where(start: time_period_start + weekday.day..time_period_start.end_of_day + weekday.day).each do |event|
        day_events << {
            start: event.start,
            end: event.end
        }
      end


      freetime_chunks << {
          date: {
              dateNum: day.day,
              monthNum: day.month,
              weekDayStr: day.strftime('%a'),
              monthStr: day.strftime('%^b')
          },
          freetime: Freetime.freetime(time_period_start.beginning_of_day + weekday.day, day_events)
      }

    end

    return freetime_chunks

  end
end
