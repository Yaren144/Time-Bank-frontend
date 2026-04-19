class AdminController < ApplicationController
  before_action :authenticate_request
  before_action :authorize_admin

  def users
    users = User.all
    render json: users.map { |u| {
      id: u.id,
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      role: u.role,
      time_credits: u.time_credits,
      created_at: u.created_at
    }}, status: :ok
  end

  private

  def authorize_admin
    unless @current_user.role == "admin"
      render json: { error: "Access denied. Admins only." }, status: :forbidden
    end
  end
end
