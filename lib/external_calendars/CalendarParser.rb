# JOURNAL [NOT STARTED] Downloading *.ics files to be parsed into Event objects using the icalendar gem

class CalendarParser
  require 'down'
  require 'date'
  require 'icalendar/recurrence'

  # Largest calendar file size, in bytes, downloadable (5MB)
  MAX_FILE_SIZE = 5_191_680

  SUCCESS = 0
  WARNING = 1
  FAILURE = 2


  attr_reader :url
  attr_reader :ics
  attr_reader :status
  attr_reader :events



  def initialize(url)
    @url = url
    @events = []
  end


  def download_calendar

    @ics = nil

    begin
      # Attempt to download file
      res = Down.download(@url, max_size: MAX_FILE_SIZE)

      # If the calendar is valid
      if res.status.first == '200' and res.content_type == 'text/calendar'
        @ics = res.read

        # Close and delete tempfile
        res.close
        res.unlink

        @status = { code: SUCCESS, text: 'File successfully downloaded' }

      end

    rescue Down::TooLarge
      @status = { code: FAILURE, text: 'File too large' }

    rescue Down::NotFound
      @status = { code: FAILURE, text: 'File not found' }
    end

    # Return the raw ICS string if success, nil if not
    @ics
  end

  def get_events
    calendar = Array(Icalendar::Calendar.parse(@ics)).first

    # If calendar is not nil (valid parsing)
    if calendar
      # For each event in the calendar
      calendar.events.each do |event|
        # If its not a recurring event
        if event.rrule.first == nil
          dtstart = DateTime.parse(event.dtstart.to_s)
          dtend = if event.dtend == nil
                    dtstart + 10.minutes
                  else
                    DateTime.parse(event.dtend.to_s)
                  end

          # Add directly to array
          new_event = { name: event.summary, start: dtstart,
                        end: dtend }

          @events << new_event

          # If its a recurring event (has rrule)
        else
          # For each occurrence add hash to array
          event.occurrences_between(event.dtstart, Date.today + 365).each do |occurrence|
            @events << { name: event.summary, start: DateTime.parse(occurrence.start_time.to_s),
                         end: DateTime.parse(occurrence.end_time.to_s) }
          end
        end
      end
      @status = if @events.length > 0
                  { code: SUCCESS, text: 'Parsing complete, events imported'}
                else
                  { code: WARNING, text: 'Parsing complete, no events found'}
                end
    else
      @status = { code: FAILURE, text: 'Parsing fail, invalid icalendar file'}
    end

  end

end

