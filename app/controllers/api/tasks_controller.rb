class Api::TasksController < ApplicationController

  # Unscheduled Tasks that need to be scheduled in a given week
  def queued

    start_date = DateTime.now.beginning_of_day + ( params[:week_offset].to_i * 7.day )

    queue = []


    Task.all.each do |t|
      unscheduled_num = t.unscheduled_num(start_date)

      if unscheduled_num > 0
        task = t.attributes
        task['unscheduled_num'] = unscheduled_num
        queue << task
      end
    end


    render json: queue
  end


end
