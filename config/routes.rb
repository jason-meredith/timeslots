Rails.application.routes.draw do




  # Open the website to our welcome page
  root 'welcome#index'


  resources :tasks


end
