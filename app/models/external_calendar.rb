class ExternalCalendar < ApplicationRecord
  has_many :external_events, dependent: :delete_all
end
