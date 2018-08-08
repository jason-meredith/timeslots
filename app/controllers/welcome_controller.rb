class WelcomeController < ApplicationController
  def index

    @calendars = ExternalCalendar.all
    @tasks = Task.all

  end
end
