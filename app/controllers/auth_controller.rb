class AuthController < ApplicationController
  def register
    user = User.new(
      first_name: params[:first_name],
      last_name: params[:last_name],
      email: params[:email],
      password: params[:password],
      role: "user"
    )

    if user.save
      token = generate_token(user)
      render json: {
        message: "Registration successful",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = generate_token(user)
      render json: {
        message: "Login successful",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  private

  def generate_token(user)
    payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, Rails.application.secret_key_base, "HS256")
  end
end
