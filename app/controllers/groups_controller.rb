class GroupsController < ApplicationController

  def create
    new_group = Group.new( name: params[:name])


    new_group.users << current_user

    new_group.save
  end


end
