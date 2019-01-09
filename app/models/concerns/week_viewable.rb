module Week_Viewable
  extend ActiveSupport::Concern

  module ClassMethods

    def week(group, week_offset=0)
      time_period_start = Time.now.beginning_of_day + ( week_offset * 7.day )

      week_events = []

      all_week_events = self.where(start: time_period_start..time_period_start + 7.day)

      7.times do |weekday|
        day = time_period_start + weekday.day
        day_events = {
            date: {
                dateNum: day.day,
                monthNum: day.month,
                weekDayStr: day.strftime('%a'),
                monthStr: day.strftime('%^b')
            }
        }
        day_events['events'] = []
        all_week_events.where(start: time_period_start + weekday.day..time_period_start.end_of_day + weekday.day).each do |event|

          if event.group == group
            output = yield event
            day_events['events'] << output
          end

        end
        week_events << day_events
      end

      return week_events

    end


  end

end