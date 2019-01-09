Rails.application.routes.draw do




  devise_for :users, controllers: { sessions: 'users/sessions' }
  # Open the website to our welcome page
  root 'welcome#index'


  resources :tasks
  #resources :external_calendars


  get 'schedule', to: 'schedule#index'

  get 'schedule/:groupId/:groupName',
      to: 'schedule#calendar',
      constraints: { groupId: /[0-9]{8}/ }

  post 'schedule/add', to: 'schedule#schedule_task'




  get 'schedule/:groupId/:groupName/calendars',
      to: 'external_calendars#index',
      as: :external_calendars,
      constraints: { groupId: /[0-9]{8}/ }

  post 'schedule/:groupId/:groupName/calendars',
       to: 'external_calendars#create',
       as: :create_external_calendar,
       constraints: { groupId: /[0-9]{8}/ }

  delete 'schedule/:groupId/:groupName/calendars',
         to: 'external_calendars#destroy',
         as: :delete_external_calendars,
         constraints: { groupId: /[0-9]{8}/ }


  post 'group/create',
       to: 'groups#create'



  namespace :api do
    scope '/schedule' do

      get 'events',
          to: 'schedule#external_events'


      get 'scheduled_tasks',
          to: 'schedule#scheduled_tasks'

      get 'freetime(/:week_offset)',
          to: 'schedule#freetime',
          defaults: { week_offset: 0},
          constraints: { week_offset: /[\-]?\d/ }

      get 'ical', to: 'schedule#generated_calendar'

    end

    scope '/tasks' do

      get 'queued',
          to: 'tasks#queued'



    end

  end

end
