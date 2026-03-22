class ApplicationController < ActionController::API
  def authenticate_request
    token = request.headers["Authorization"]&.split(" ")&.last

    if token.nil?
      render json: { error: "No token provided" }, status: :unauthorized and return
    end

    begin
      decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: "HS256")
      @current_user = User.find(decoded[0]["user_id"])
    rescue JWT::ExpiredSignature
      render json: { error: "Token expired" }, status: :unauthorized
    rescue JWT::DecodeError
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end
end