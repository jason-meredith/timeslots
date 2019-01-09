class TasksController < ApplicationController

  # Show a list of all Tasks, if and when they are scheduled
  def index

    @tasks = Task.all


  end

  # Using post data create a index Task
  def create

    new_task = params.require(:task).permit(:name, :description, :duration, :category, :tags, :priority,
                                            :duration, :occurrence_term, :occurrence_num)


    #t.save

    t = Task.new(new_task)
    t.group=Group.find(session[:group])

    #t[:group_id] = session[:group_id]

    t.save



    render json: params[:task]
  end

  # Show the form for creating a index task
  def new
    @action = "create"
    @task = Task.new
  end

  def edit
    @action = "update"
    @task = Task.find(params[:id])
    render "new"
  end

  # Show a report for a Task
  def show
  end

  # Using post data save changes to a Task
  def update
    task = Task.find(params[:id])

    updated_task = params.require(:task).permit(:name, :description, :duration, :category, :tags, :priority,
                                                :duration, :occurrence_term, :occurrence_num)

    if task.update(updated_task)
      render plain: "Success"
    else
      render plain: "Fail"
    end
  end

  # Delete a Task
  def destroy
    Task.destroy(params[:id])
  end

end
