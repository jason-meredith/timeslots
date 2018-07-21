# JOURNAL Given a list of events throughout a day, how to find the unoccupied spaces in between

# This whole project is essentially a nice, presentable wrapper for what is contained within this module.
#
# Most peoples' calendar events are fairly sequential and don't contain many overlapping items, and in this
# case it is pretty straightforward to simply see when event ends and the next one begins. For example, if breakfast
# ends at 10am and the next event, Lunch, starts at 12pm you have a two hour unoccupied gap between 10am and 12pm.
# Repeat this for each event and you have all the gaps throughout the day.
#
# Now if one were to aggregate all the events of all the calendars of a collection of many different people there
# would most likely be quite a bit of overlapping events, events where the start of one events is before end of another
# or completely encases another, for example Person A has breakfast from 8am to 10 pm while Person B has breakfast from
# 9am to 9:30am. You are no longer able to simply piece together end to start times to find gaps that are available on
# everyone's calendar.
#
# The way I approached this problem was by dividing the entire day into an array of 5 minute blocks with an initial
# value of true, with each boolean value answering the question: is this 5 minute block available on every calendar?
# (Line 113:116).
#
# For each event I converted the start and end times into a Range, the first value being the start time, in
# minutes since midnight, divided by 5, and the same with the end time. (Line 34:40).
#
# I set all elements in my initial array between the two values of these Ranges to False (Line 124:126).
#
# Using the Enumerable .chunk method I grouped the elements of the array into a new array of hashes consisting of
#  {
#    available: true | false,
#    start: the array index this chunk started at,
#    end: the array index this chunk ended at
#  }
# (Lines 81:86)
#
# I remove any Hashes from the array containing the value { available: False } using .select! (Line 91)
#
# Finally I map the array of Hashes into a more detailed Hash Array by converting in the start and end array indices
# back into multiples of 5 minutes past minute and further into an actual Time of day. I also convert the time
# into a percentage of 24 hours past midnight, a value which is used to size and position the divs that represent
# the Events on the calendar page. (Lines 99:125)
#
# So what is finally returned is an Array of Hashes representing a duration of time that exists unoccupied by
# any event on anyones calendar that can easily be displaying using minimal HTML/CSS/JS.


module Freetime

  MINUTES_IN_DAY = 60 * 24

  BLOCK_SIZE = 5

  BLOCK_NUM = ((MINUTES_IN_DAY.to_f / BLOCK_SIZE.to_f) ).to_i

  # Take an event, and create a range of block that need to be marked as unavailable
  def self.unavailable_blocks(event)
    start_block = (event[:start].hour * 12) + (event[:start].min / BLOCK_SIZE).to_i
    end_block = (event[:end].hour * 12) + (event[:end].min / BLOCK_SIZE).to_i

    # Don't go out of range
    end_block = BLOCK_NUM if end_block > BLOCK_NUM

    start_block..end_block

  end




  # Converts a chunk index number to a real time
  def self.to_time(index, date)
    (date.beginning_of_day + (index * 60) * BLOCK_SIZE)
  end



  def self.round_minutes(minutes)
    if (60 - minutes).abs < 10 or (0 - minutes).abs < 10
      0
    end

    if (30 - minutes).abs < 10
      30
    end

    minutes

  end


  # Take an array of blocks of availability, trues and falses, and chunk together find remaining
  # chunks of Trues (time unused by External Events)
  def self.block_chunker(blocks_available, date)
    chunks = []
    current_block = 0
    blocks_available.chunk { |n| n }.each do |e|
      chunks << { available: e[0], start: current_block, end: current_block + e[1].length - 1 }
      current_block += e[1].length
    end

    # Remove all unavailable chunks
    chunks.select! { |chunk| chunk[:available]}

    # Convert block indices to Time objects
    chunks.map! do |e|

      start_time = Freetime.to_time(e[:start], date)
      end_time = Freetime.to_time(e[:end], date)

      start_pos = EventPositioner.to_percent(start_time)
      end_pos = EventPositioner.to_percent(end_time)

      duration = EventPositioner.length_percent(start_time, end_time)
      duration_str = Time.diff(start_time, end_time, '%H, %N')


      {
          start_time_str: start_time.strftime('%l:%M %P'),
          end_time_str: end_time.strftime('%l:%M %P'),
          start_pos: start_pos,
          end_pos: end_pos,
          start_datetime: start_time.to_s,
          end_datetime: end_time.to_s,
          duration_pos: duration,
          duration_minutes: Time.diff(start_time, end_time)[:minute] +
              (Time.diff(start_time, end_time)[:hour] * 60),
          duration_str: duration_str[:diff]
      }


    end


  end

  def Freetime.freetime(date, events, wakeup=9, bedtime=22)
    # Divide day into blocks of availability, initialize as all True
    blocks_available = []
    BLOCK_NUM.times do
      blocks_available << true
    end

    # For every event, mark its blocks as False
    events.each do |e|
      Freetime.unavailable_blocks(e).each do |block|
        blocks_available[block] = false
      end
    end

    Freetime.block_chunker(blocks_available, date)


  end

end