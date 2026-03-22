class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :role, inclusion: { in: %w[user admin] }

  before_create :set_default_role
  before_create :set_default_credits

  private

  def set_default_role
    self.role ||= "user"
  end

  def set_default_credits
    self.time_credits ||= 0
  end
end
