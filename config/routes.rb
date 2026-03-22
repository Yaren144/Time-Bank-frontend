Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "/profile",  to: "users#profile"
  patch "/profile", to: "users#update"

  post "/auth/register", to: "auth#register"
  post "/auth/login",    to: "auth#login"

  get "/admin/users", to: "admin#users"
end
