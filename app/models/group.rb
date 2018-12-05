class Group < ApplicationRecord

  has_and_belongs_to_many :users
  has_many :external_calendars, dependent: :delete_all

  def get_group_id
    (name.hash + created_at.hash).abs.to_s[0..7]
  end


  def self.find_group(group_name, group_id)
    group = nil

    # Look through each group matching the group_name and find the ones whose group_id matches
    Group.where(name:group_name).find_each do |g|
      if g.get_group_id == group_id
        group = g
        break
      end
    end

    group
  end

end
