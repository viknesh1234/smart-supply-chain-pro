--  Insert sample purchase orders
INSERT INTO purchase_order (id, po_number, supplier_name, supplier_email, created_date, expected_date, status, total_amount, progress)
VALUES
(1, 'PO-101', 'Apple Inc.', 'apple@supplier.com', '2024-06-01', '2024-06-10', 'approved', 125000, 100),
(2, 'PO-102', 'Samsung', 'samsung@supplier.com', '2024-06-02', '2024-06-12', 'in-progress', 85000, 75),
(3, 'PO-103', 'Sony Corp.', 'sony@supplier.com', '2024-06-03', '2024-06-15', 'in-review', 45000, 50),
(4, 'PO-104', 'Dell Tech.', 'dell@supplier.com', '2024-06-04', '2024-06-18', 'pending', 75000, 25);

--  Insert sample purchase items
INSERT INTO purchase_item (id, product_id, quantity, unit_price, total, purchase_order_id)
VALUES
(1, 1, 50, 2500, 125000, 1),
(2, 2, 100, 850, 85000, 2),
(3, 3, 150, 300, 45000, 3),
(4, 4, 75, 1000, 75000, 4);

--  Insert sample shipment tracking data (optional if you have a separate table)
-- If you have `shipment` table, insert like this:
-- INSERT INTO shipment (id, tracking_number, carrier, origin, destination, progress, eta, value, status)
-- VALUES
-- (1, 'SH-001', 'DHL Express', 'Shenzhen, China', 'New York, USA', 75, '2024-06-12', 45000, 'In Transit'),
-- (2, 'SH-002', 'FedEx', 'Seoul, South Korea', 'London, UK', 85, '2024-06-11', 32000, 'Customs'),
-- (3, 'SH-003', 'UPS', 'Cupertino, USA', 'Berlin, Germany', 100, '2024-06-08', 67000, 'Delivered');
