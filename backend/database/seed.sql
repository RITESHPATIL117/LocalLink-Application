-- 1. Create a sample provider user if not exists
INSERT INTO users (name, email, password, role, phone) VALUES 
('John Doe Services', 'provider@example.com', '$2a$10$Xm7B4uPy9e9qj6Xo.L/h5.9yZ6j8eW3y8N9C.iC1eO6k7o5h5.iYq', 'provider', '1234567890')
ON DUPLICATE KEY UPDATE email=email;

-- 2. Clear and Update Categories with proper icons and colors
DELETE FROM categories;
ALTER TABLE categories AUTO_INCREMENT = 1;

INSERT INTO categories (name, icon, is_material, color, slug) VALUES 
('Plumbing', 'water', 1, '#3B82F6', 'plumbing'),
('Electrician', 'lightning-bolt', 1, '#F59E0B', 'electrician'),
('Cleaning', 'broom', 1, '#06B6D4', 'cleaning'),
('Landscaping', 'flower', 0, '#10B981', 'landscaping'),
('Pest Control', 'bug', 0, '#EF4444', 'pest-control'),
('Handyman', 'hammer-wrench', 1, '#8B5CF6', 'handyman'),
('Auto Repair', 'car-wrench', 1, '#F43F5E', 'auto-repair'),
('Salon', 'content-cut', 1, '#EC4899', 'salon');

-- 3. Get IDs for seeding businesses
SET @plumbing_id = (SELECT id FROM categories WHERE slug = 'plumbing' LIMIT 1);
SET @electrician_id = (SELECT id FROM categories WHERE slug = 'electrician' LIMIT 1);
SET @cleaning_id = (SELECT id FROM categories WHERE slug = 'cleaning' LIMIT 1);
SET @landscaping_id = (SELECT id FROM categories WHERE slug = 'landscaping' LIMIT 1);
SET @pest_control_id = (SELECT id FROM categories WHERE slug = 'pest-control' LIMIT 1);
SET @handyman_id = (SELECT id FROM categories WHERE slug = 'handyman' LIMIT 1);
SET @provider_id = (SELECT id FROM users WHERE email = 'provider@example.com' LIMIT 1);

-- 4. Clear and Insert Sample Businesses with proper image URLs
DELETE FROM businesses;
ALTER TABLE businesses AUTO_INCREMENT = 1;

INSERT INTO businesses (provider_id, name, description, category_id, address, city, rating, review_count, image_url) VALUES 
(@provider_id, 'Quick Fix Plumbing', 'Expert plumbing services for all your needs. 24/7 emergency support.', @plumbing_id, '123 Water St', 'New York', 4.8, 25, 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400'),
(@provider_id, 'Elite Pipes', 'Professional drain cleaning and pipe repair.', @plumbing_id, '456 Flow Ave', 'New York', 4.9, 220, 'https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=400'),
(@provider_id, 'Sparky Pro', 'Licensed electricians for residential and commercial projects.', @electrician_id, '789 Voltage Dr', 'New York', 4.9, 40, 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=400'),
(@provider_id, 'Sparkle Squad', 'Complete home cleaning services for a spotless living space.', @cleaning_id, '555 Clean Rd', 'New York', 4.7, 89, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400'),
(@provider_id, 'Glow Salon', 'Beautiful landscape design and regular maintenance.', @landscaping_id, 'Saket, New Delhi', 'New Delhi', 4.9, 442, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400');
