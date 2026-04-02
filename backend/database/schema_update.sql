-- System-Wide API Stabilization Schema Update
USE localhub_db;

-- 1. Create LEADS table (Used in Provider Dashboard for Booking History)
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    category_id INT,
    user_id INT,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20) NOT NULL,
    message TEXT,
    address VARCHAR(255),
    booking_date DATE,
    booking_time TIME,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    payment_method VARCHAR(100) DEFAULT 'Pay After Service',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 2. Create REPORTS table (Used in Admin Dashboard for Moderation)
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT,
    type VARCHAR(100) NOT NULL, -- 'Flagged Review', 'Suspicious Listing', 'User Conduct'
    entity VARCHAR(255) NOT NULL, -- e.g. "Review #123 on Business #45"
    description TEXT,
    status ENUM('Pending', 'In Progress', 'Resolved', 'Dismissed') DEFAULT 'Pending',
    severity ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL
);
