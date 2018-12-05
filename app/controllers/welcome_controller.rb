class WelcomeController < ApplicationController
  def index


    if user_signed_in?
      @user = current_user
      @groups = current_user.groups
    else
      redirect_to :new_user_session
    end


  end
end
