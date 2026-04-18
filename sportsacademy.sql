-- Academy
CREATE TABLE Academy (
    academy_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(100)
);

-- Sport
CREATE TABLE Sport (
    sport_id SERIAL PRIMARY KEY,
    academy_id INT REFERENCES Academy(academy_id),
    sport_name VARCHAR(50)
);

-- Court
CREATE TABLE Court (
    court_id SERIAL PRIMARY KEY,
    sport_id INT REFERENCES Sport(sport_id),
    court_name VARCHAR(50)
);

-- Client
CREATE TABLE Client (
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15)
);

-- Booking
CREATE TABLE Booking (
    booking_id SERIAL PRIMARY KEY,
    client_id INT REFERENCES Client(client_id),
    court_id INT REFERENCES Court(court_id),
    date DATE,
    time_slot VARCHAR(20),
    status VARCHAR(20),
    total_amount NUMERIC(10,2)
);

-- Payment
CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES Booking(booking_id),
    amount_paid NUMERIC(10,2),
    payment_status VARCHAR(20)
);

-- Equipment
CREATE TABLE Equipment (
    equipment_id SERIAL PRIMARY KEY,
    sport_id INT REFERENCES Sport(sport_id),
    name VARCHAR(50),
    price NUMERIC(10,2)
);

-- Booking_Equipment
CREATE TABLE Booking_Equipment (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES Booking(booking_id),
    equipment_id INT REFERENCES Equipment(equipment_id)
);
SELECT table_name 
FROM information_schema.tables
WHERE table_schema = 'public';

INSERT INTO Academy (name, location)
VALUES 
('prostar Academy', 'Mangalore');

INSERT INTO Sport (academy_id, sport_name)
VALUES 
(1, 'Football'),
(1, 'Cricket'),
(1, 'Badminton'),
(1, 'Pickleball');

INSERT INTO Court (sport_id, court_name)
VALUES
-- Football
(1, 'Football Court 1'),
(1, 'Football Court 2'),

-- Cricket
(2, 'Cricket Ground 1'),
(2, 'Cricket Ground 2'),

-- Badminton
(3, 'Badminton Court 1'),
(3, 'Badminton Court 2'),

-- Pickleball
(4, 'Pickleball Court 1'),
(4, 'Pickleball Court 2');
INSERT INTO Client (name, email, phone)
VALUES 
('Rahul Sharma', 'rahul@gmail.com', '9876543210'),
('Priya Singh', 'priya@gmail.com', '9123456780'),
('Arjun Mehta', 'arjun@gmail.com', '9988776655');
INSERT INTO Equipment (sport_id, name, price)
VALUES 
-- Football
(1, 'Football Kit', 200),

-- Cricket
(2, 'Cricket Bat', 300),
(2, 'Cricket Kit', 500),

-- Badminton
(3, 'Racket', 150),
(3, 'Shuttlecock Pack', 50),

-- Pickleball
(4, 'Paddle', 250);
INSERT INTO Booking (client_id, court_id, date, time_slot, status, total_amount)
VALUES 
(1, 1, '2026-04-20', '10:00-11:00', 'Confirmed', 500),
(2, 3, '2026-04-20', '11:00-12:00', 'Confirmed', 600);
INSERT INTO Payment (booking_id, amount_paid, payment_status)
VALUES 
(1, 250, 'Partial'),
(2, 300, 'Partial');
INSERT INTO Booking_Equipment (booking_id, equipment_id)
VALUES 
(1, 1),
(2, 4);
SELECT * FROM Sport;
SELECT * FROM Court;
SELECT * FROM Client;
SELECT * FROM Booking;
SELECT * FROM Booking
WHERE court_id = 1
AND date = '2026-04-20'
AND time_slot = '10:00-11:00';
INSERT INTO Booking (client_id, court_id, date, time_slot, status, total_amount)
VALUES (2, 1, '2026-04-20', '10:00-11:00', 'Confirmed', 600);

DELETE FROM Booking
WHERE booking_id NOT IN (
    SELECT MIN(booking_id)
    FROM Booking
    GROUP BY court_id, date, time_slot
);
SELECT * FROM Booking;
ALTER TABLE Booking
ADD CONSTRAINT unique_booking
UNIQUE (court_id, date, time_slot);
INSERT INTO Booking (client_id, court_id, date, time_slot, status, total_amount)
VALUES (3, 1, '2026-04-20', '10:00-11:00', 'Confirmed', 700);
SELECT 
    b.booking_id,
    c.name,
    b.date,
    b.time_slot,
    b.status
FROM Booking b
JOIN Client c ON b.client_id = c.client_id;
SELECT 
    court_id,
    date,
    time_slot,
    status
FROM Booking
ORDER BY date;
SELECT * FROM Booking
WHERE court_id = 1
AND date = '2026-04-20';