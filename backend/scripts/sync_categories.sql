-- SQL Script to synchronize categories in the localhub_db with the expanded catalog.

USE localhub_db;

-- Clear old categories if needed (Optional: uncomment if you want a clean state)
-- DELETE FROM categories;

-- Insert 14 comprehensive categories
INSERT INTO categories (id, name, icon, is_material, color, slug, image)
VALUES 
(1, 'Cleaning', 'sparkles-outline', 0, '#3B82F6', 'cleaning', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400'),
(2, 'Plumbing', 'water-outline', 0, '#3B82F6', 'plumbing', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400'),
(3, 'Electrical', 'flash-outline', 0, '#F59E0B', 'electrical', 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=400'),
(4, 'HVAC', 'snow-outline', 0, '#06B6D4', 'hvac', 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=400'),
(5, 'Pet Care', 'paw-outline', 0, '#EC4899', 'pet-care', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400'),
(6, 'Automobile', 'car-sport-outline', 0, '#EF4444', 'automobile', 'https://images.unsplash.com/photo-1487754164641-a095905fd481?q=80&w=400'),
(7, 'Events', 'calendar-outline', 0, '#8B5CF6', 'events', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400'),
(8, 'Health', 'fitness-outline', 0, '#10B981', 'health', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400'),
(9, 'Home Design', 'home-outline', 0, '#6366F1', 'home-design', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400'),
(10, 'Legal', 'briefcase-outline', 0, '#374151', 'legal', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400'),
(11, 'Education', 'school-outline', 0, '#F43F5E', 'education', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400'),
(12, 'Real Estate', 'home-city-outline', 0, '#6366F1', 'real-estate', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400'),
(13, 'Laundry', 'shirt-outline', 0, '#0EA5E9', 'laundry', 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=400'),
(14, 'Restaurants', 'restaurant-outline', 0, '#EAB308', 'restaurants', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    icon = VALUES(icon),
    color = VALUES(color),
    image = VALUES(image);

-- You can also run the following to verify:
-- SELECT * FROM categories;
