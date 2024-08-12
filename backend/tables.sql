CREATE TABLE events (
    event_id INT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    timezone VARCHAR(64) NOT NULL
);

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    event_id INT not NULL,
    name VARCHAR(64) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    UNIQUE (event_id, name)
);

CREATE TABLE availability (
    user_id INT NOT NULL,
    available DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    unique (user_id, available)
);

insert into events values 
(1, 'Test Event', '2024-08-11 09:00:00', '2024-08-11 09:00:00', 'PST'),
(2, 'Test Event2', '2024-08-11 09:00:00', '2024-08-11 09:00:00', 'PST'),
(3, 'Test Event3', '2024-08-11 09:00:00', '2024-08-11 09:00:00', 'PST');

insert into users values
(1, 1, 'Ronald'),
(2, 1, 'Brrr'),
(3, 1, 'Brr'),
(4, 2, 'Ronald'),
(5, 2, 'Brrr'),
(6, 2, 'Brr');

insert into availability values
(1, '2024-08-11 09:00:00'),
(1, '2024-08-11 09:01:00');
