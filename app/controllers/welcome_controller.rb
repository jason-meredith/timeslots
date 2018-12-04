class WelcomeController < ApplicationController
  def index


    unless user_signed_in?
      redirect_to :new_user_session
    end

    @calendars = ExternalCalendar.all
    @tasks = Task.all

  end
end
