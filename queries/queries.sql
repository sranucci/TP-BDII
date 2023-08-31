-- ex1
SELECT nro_cliente, nombre, apellido
FROM E01_CLIENTE
WHERE nombre = 'Wanda' AND apellido = 'Baker';

-- ex2
SELECT DISTINCT nro_cliente, nombre, apellido, direccion, activo
FROM E01_CLIENTE NATURAL JOIN E01_FACTURA;

-- ex3
EXPLAIN ANALYZE
SELECT * FROM E01_CLIENTE
WHERE nro_cliente NOT IN (
    SELECT nro_cliente FROM E01_FACTURA
    );

-- ex4
SELECT DISTINCT codigo_producto, marca, marca, nombre, descripcion, precio, stock
FROM E01_PRODUCTO NATURAL JOIN E01_DETALLE_FACTURA;

-- ex5
SELECT nro_cliente, nombre, apellido, direccion, activo, nro_telefono
FROM E01_CLIENTE NATURAL JOIN E01_TELEFONO;

-- ex6
SELECT E01_CLIENTE.nro_cliente, nombre, apellido, direccion, activo, count(E01_FACTURA.nro_factura) AS facturas
FROM E01_CLIENTE LEFT OUTER JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente
GROUP BY E01_CLIENTE.nro_cliente;

-- ex7
SELECT nro_factura
FROM E01_CLIENTE NATURAL JOIN E01_FACTURA
WHERE E01_CLIENTE.nombre = 'Pandora' AND E01_CLIENTE.apellido = 'Tate';

-- ex8
SELECT DISTINCT nro_factura
FROM E01_FACTURA NATURAL JOIN E01_DETALLE_FACTURA NATURAL JOIN E01_PRODUCTO
WHERE E01_PRODUCTO.marca = 'In Faucibus Inc.';

-- ex9
SELECT nro_telefono, nro_cliente, nombre, apellido, direccion, activo
FROM E01_CLIENTE NATURAL JOIN E01_TELEFONO;

-- ex10
SELECT nombre, apellido, sum(coalesce(total_con_iva, 0)) as gasto_total
FROM E01_CLIENTE LEFT OUTER JOIN E01_FACTURA ON E01_CLIENTE.nro_cliente = E01_FACTURA.nro_cliente
GROUP BY E01_CLIENTE.nro_cliente;