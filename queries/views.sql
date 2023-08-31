create view FACTURAS_ORDENADAS as
(select * from E01_FACTURA
order by fecha );

create view PRODUCTOS_NO_FACTURADOS as
(
select *
from E01_PRODUCTO
where codigo_producto not in
      (select codigo_producto
       from E01_DETALLE_FACTURA)
);