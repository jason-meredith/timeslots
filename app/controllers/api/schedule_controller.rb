class Api::ScheduleController < ApplicationController
  require 'icalendar'

  require 'schedule/EventPositioner'
  require 'schedule/Freetime'


  def external_events

    group = Group.find_group(params[:group_name], params[:group_id])


    events = ExternalEvent.week( group, params[:week_offset].to_i ) do |event|

      {
          id: event.id,
          name: event.name,
          start_datetime: event.start,
          end_datetime: event.end,
          start_time_str: event.start.strftime('%l:%M %P').to_s,
          start_pos: EventPositioner.to_percent(event.start),
          end_time_str: event.end.strftime('%l:%M %P').to_s,
          end_pos: EventPositioner.to_percent(event.end),
          duration_minutes: ((event.end - event.start)/60).round,
          duration_pos: EventPositioner.length_percent(event.start, event.end),
          cal_name: event.external_calendar.name,
          cal_color: event.external_calendar.color
      }

    end

    render json: events

  end

  def scheduled_tasks


    group = Group.find_group(params[:group_name], params[:group_id])

    events = ScheduledTask.week( group, params[:week_offset].to_i ) do |event|

      {
          id: event.id,
          name: event.task.name,
          start_datetime: event.start,
          end_datetime: event.end,
          start_time_str: event.start.strftime('%l:%M %P').to_s,
          start_pos: EventPositioner.to_percent(event.start),
          end_time_str: event.end.strftime('%l:%M %P').to_s,
          end_pos: EventPositioner.to_percent(event.end),
          duration_minutes: event.task.duration,
          duration_pos: EventPositioner.length_percent(event.start, event.end),
      }

    end

    render json: events

  end

  def freetime
    render json: ExternalEvent.week_freetime( params[:week_offset].to_i )
  end





  def generated_calendar

    cal = Icalendar::Calendar.new
    cal.prodid = 'timeslots'

    ScheduledTask.all.each do |t|

      event = Icalendar::Event.new
      event.dtstart = t.start
      event.summary = t.task.name
      event.description = t.task.description

      cal.add_event(event)

    end

    render plain: cal.to_ical
  end



end
