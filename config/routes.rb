Rails.application.routes.draw do




  devise_for :users
  # Open the website to our welcome page
  root 'welcome#index'


  resources :tasks
  resources :external_calendars


  get 'schedule', to: 'schedule#index'

  post 'schedule/add', to: 'schedule#schedule_task'


  namespace :api do
    scope '/schedule' do

      get 'events(/:week_offset)',
          to: 'schedule#external_events',
          defaults: { week_offset: 0},
          constraints: { week_offset: /[\-]?\d/ }

      get 'scheduled_tasks(/:week_offset)',
          to: 'schedule#scheduled_tasks',
          defaults: { week_offset: 0},
          constraints: { week_offset: /[\-]?\d/ }

      get 'freetime(/:week_offset)',
          to: 'schedule#freetime',
          defaults: { week_offset: 0},
          constraints: { week_offset: /[\-]?\d/ }

      get 'ical', to: 'schedule#generated_calendar'

    end

    scope '/tasks' do

      get 'queued(/:week_offset)',
          to: 'tasks#queued',
          defaults: {week_offset: 0},
          constraints: { week_offset: /[\-]?\d/ }



    end

  end

end
