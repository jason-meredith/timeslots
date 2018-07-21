module EventPositioner

  MINUTES_IN_DAY = 1440


  # Converts a time of day to a percentage of time into a day (ex: 6am=25%, 12pm=50%, 6pm=75%)
  def EventPositioner.to_percent(time)
    num_minutes = time.hour * 60
    num_minutes += time.min

    result = (num_minutes.to_f / MINUTES_IN_DAY.to_f) * 100

    result.to_i
  end

  def EventPositioner.length_percent(starttime, endtime)
    to_percent(endtime) - to_percent(starttime)
  end

end