-- USER

CREATE TYPE role_type AS ENUM ('basic', 'admin', 'owner');

CREATE TABLE users(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	first_name VARCHAR (50) NOT NULL,
	last_name VARCHAR (50) NOT NULL,
	password VARCHAR (256) NOT NULL,
	email VARCHAR (100) UNIQUE NOT NULL,
	telephone VARCHAR (100) UNIQUE NOT NULL,
	role role_type NOT NULL DEFAULT 'basic',
	active BOOLEAN NOT NULL DEFAULT TRUE,
	verified BOOLEAN NOT NULL DEFAULT FALSE,
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP,
	last_login TIMESTAMP
);

CREATE TABLE address(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	alamat VARCHAR (150) NOT NULL,
	kelurahan VARCHAR (100) NOT NULL,
	kota VARCHAR (100) NOT NULL,
	provinsi VARCHAR (100) NOT NULL,
	user_id uuid NOT NULL REFERENCES users(id),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

-- CART

CREATE TABLE cart(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id uuid NOT NULL REFERENCES users(id),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

CREATE TABLE detail_cart(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	order_price INT NOT NULL CHECK (order_price > 0),
	qty SMALLINT NOT NULL CHECK (qty > 0),
	note TEXT,
	product_id uuid NOT NULL REFERENCES product(id),
	cart_id uuid NOT NULL REFERENCES cart(id),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

-- PRODUCT

CREATE TABLE product_category(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	name VARCHAR (100) NOT NULL,
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

CREATE TABLE product(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	name VARCHAR (100) NOT NULL,
	description TEXT NOT NULL ,
	stock SMALLINT NOT NULL DEFAULT 0 CHECK (stock > 0),
	price INT NOT NULL CHECK (price > 0),
	product_category_id uuid NOT NULL REFERENCES product_category(id),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

CREATE TABLE product_image(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	image VARCHAR (100) NOT NULL,
	product_id uuid NOT NULL REFERENCES product(id),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);


-- ORDER
CREATE TYPE order_status AS ENUM ('menunggu pembayaran', 'sedang dikonfirmasi', 'sedang dikirim');

CREATE TABLE orders(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	status order_status NOT NULL DEFAULT 'menunggu pembayaran',
	resi_code VARCHAR (100),
	total_order_price INT NOT NULL CHECK (total_order_price >= 0),
	delivery_fee INT NOT NULL CHECK (delivery_fee >= 0),
	delivery_method_id uuid NOT NULL REFERENCES delivery_method(id),
	user_id uuid NOT NULL REFERENCES users(id),
	address_id uuid NOT NULL REFERENCES address(id),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

CREATE TABLE detail_orders(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	order_price INT NOT NULL CHECK (order_price > 0),
	qty SMALLINT NOT NULL CHECK (qty > 0),
	note TEXT,
	orders_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
	product_id uuid NOT NULL REFERENCES product(id),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

-- PRODUCT RIVIEW

CREATE TABLE product_riview(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	order_price INT NOT NULL CHECK (order_price > 0),
	rate SMALLINT NOT NULL CHECK (rate > 0 AND rate <= 10),
	field TEXT NOT NULL,
	product_id uuid NOT NULL REFERENCES product(id),
	orders_id uuid NOT NULL REFERENCES orders(id),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

--PAYMENT
CREATE TYPE payment_status AS ENUM ('menunggu pembayaran', 'pembayaran berhasil', 'pembayaran gagal');

CREATE TABLE payment(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	payment_value INT NOT NULL CHECK (payment_value > 0),
	payment_method_id uuid NOT NULL REFERENCES payment_method(id),
	status payment_status NOT NULL DEFAULT 'menunggu pembayaran',
	orders_id uuid NOT NULL REFERENCES orders(id),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

CREATE TABLE payment_method(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	name VARCHAR (100) NOT NULL,
	transfer_code VARCHAR (100) NOT NULL,
	provider VARCHAR (100) NOT NULL,
	description TEXT,
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

CREATE TABLE payment_advidance(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	payment_id uuid NOT NULL REFERENCES payment(id),
	payment_advidance_code VARCHAR (100),
	payment_advidance_image VARCHAR (100),
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);

--DELIVERY
CREATE TABLE delivery_method(
	id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	name VARCHAR (100) NOT NULL,
	description TEXT,
	create_at TIMESTAMP NOT NULL DEFAULT Now(),
	update_at TIMESTAMP
);



