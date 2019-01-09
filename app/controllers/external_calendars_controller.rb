class ExternalCalendarsController < ApplicationController
  require 'external_calendars/CalendarParser'

  # Show a list of External Calendars
  def index


    @group_name = params[:groupName]
    @group_id = params[:groupId]

    group = Group.find_group(@group_name, @group_id)

    @calendars = group.external_calendars

  end

  def create


    # Download the calendars ics file and get timeslots
    parser = CalendarParser.new(params[:url])
    parser.download_calendar
    parser.get_events

    # Get group
    group = Group.find_group(params["groupName"], params["groupId"])

    # If success, Convert parser hashes to ExternalEvents
    if parser.status[:code] == CalendarParser::SUCCESS
      new_cal = ExternalCalendar.new(name: params[:name], color: params[:color], url: params[:url], group: group)

      group.save

      new_cal.save


      ExternalEvent.transaction do

        parser.events.each do |event|
          new_cal.external_events.create(event)
        end

      end
      render json: { result: parser.status, id: new_cal.id}
      # If the parser fails, just return the status messages
    else
      render json: { result: parser.status }
    end


  end

  def destroy
    ExternalCalendar.destroy(params[:id])

    render plain: params[:id]
  end

end

