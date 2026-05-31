-- Auto-create all databases when MySQL container starts
-- This runs once on first docker-compose up

CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS appointment_db;
CREATE DATABASE IF NOT EXISTS notification_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON auth_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON user_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON appointment_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON notification_db.* TO 'root'@'%';

FLUSH PRIVILEGES;
