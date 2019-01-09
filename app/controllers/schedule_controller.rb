class ScheduleController < ApplicationController

  def calendar

    groups = nil

    if user_signed_in?
      groups = current_user.groups
    else
      redirect_to :new_user_session
    end

    group_name = params[:groupName]
    group_id = params[:groupId]

    group = Group.find_group(group_name, group_id)

    # Group better exist
    if group == nil
      render status: 404
    end

    # And user better be part of that group
    unless groups.include?(group)
      render status: 403
    end

    @group_id = group_id
    @group_name = group_name

    session[:group] = group.id


    render 'index'
  end

  def schedule_task

    year = DateTime.now.year
    month = params[:date][:monthNum]
    day = params[:date][:dateNum]
    hour = Time.parse(params[:time]).hour
    minute = Time.parse(params[:time]).min
    start_time = Time.new(year, month, day, hour, minute)

    task_id = params[:taskId]

    new_event = ScheduledTask.new
    new_event.task = Task.find(task_id)
    new_event.start = start_time
    new_event.end = start_time + new_event.task.duration.minute


    result = new_event.save

    if result

      render json: { body: 'Successfully added Task to schedule', status: 200 }
    else
      render json: { body: 'Unable to schedule Task', status: 500 }
    end


  end

end
