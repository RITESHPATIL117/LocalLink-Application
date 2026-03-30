-- SQL Script to synchronize categories in the localhub_db with the Elite Smart Catalog.

USE localhub_db;

-- Wipe out current broken unstructured categories
DELETE FROM categories;

-- Reset Auto-Increment
ALTER TABLE categories AUTO_INCREMENT = 1;

-- Insert 12 Elite Smart Categories
INSERT INTO categories (id, name, icon, is_material, color, slug, image)
VALUES 
(1, 'Home Services', 'hammer-outline', 0, '#6366F1', 'home-services', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400'),
(2, 'Appliance Repair', 'snow-outline', 0, '#06B6D4', 'appliance-repair', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400'),
(3, 'Cleaning & Pest', 'sparkles-outline', 0, '#3B82F6', 'cleaning-pest', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400'),
(4, 'Beauty & Grooming', 'cut-outline', 0, '#EC4899', 'beauty-grooming', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400'),
(5, 'Packers & Movers', 'bus-outline', 0, '#F59E0B', 'packers-movers', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400'),
(6, 'Health & Medical', 'medical-outline', 0, '#10B981', 'health-medical', 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=400'),
(7, 'Automobile', 'car-sport-outline', 0, '#EF4444', 'automobile', 'https://images.unsplash.com/photo-1487754164641-a095905fd481?q=80&w=400'),
(8, 'Events & Weddings', 'calendar-outline', 0, '#8B5CF6', 'events-weddings', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400'),
(9, 'Tutors & Education', 'book-outline', 0, '#F43F5E', 'tutors-education', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400'),
(10, 'Emergency', 'alert-circle-outline', 0, '#EF4444', 'emergency', 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=400'),
(11, 'Real Estate', 'business-outline', 0, '#0F172A', 'real-estate', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400'),
(12, 'Daily Needs', 'basket-outline', 0, '#0EA5E9', 'daily-needs', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    icon = VALUES(icon),
    color = VALUES(color),
    image = VALUES(image),
    slug = VALUES(slug);
