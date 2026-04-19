class UsersController < ApplicationController
  before_action :authenticate_request

  def profile
    render json: {
      id: @current_user.id,
      email: @current_user.email,
      first_name: @current_user.first_name,
      last_name: @current_user.last_name,
      role: @current_user.role,
      time_credits: @current_user.time_credits
    }, status: :ok
  end

  def update
    if @current_user.update(update_params)
      render json: {
        message: "Profile updated",
        user: {
          id: @current_user.id,
          email: @current_user.email,
          first_name: @current_user.first_name,
          last_name: @current_user.last_name
        }
      }, status: :ok
    else
      render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def update_params
    params.permit(:first_name, :last_name, :email, :password)
  end
end
