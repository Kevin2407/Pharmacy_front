
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProductService from '../services/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import SkeletonLoader from '../components/SkeletonLoader';
import NewMovementModal from '../components/NewMovementModal';
import MovementService from '../services/MovementService';


interface StockProduct {
  id?: number;
  name: string;
  price: number;
  stock?: number;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  created_by?: number;
  updated_by?: number;
}

interface MovementItem {
  id?: number;
  product_id: number;
  product_name: string;
  description: string;
  quantity: number;
  price?: number;
  stock: number;
  expiration_date?: Date | null;
  batch_number?: string;
}

export default function ListaStock() {

  const emptyProduct: StockProduct = {
    id: undefined,
    name: '',
    price: 0,
    stock: 0,
    description: ''
  };

  const [stockProducts, setStockProducts] = useState<StockProduct[]>([]);
  const [defaultItem, setDefaultItem] = useState<MovementItem | null>(null);
  const [visibleEntry, setVisibleEntry] = useState<boolean>(false);
  const [visibleSale, setVisibleSale] = useState<boolean>(false);
  const [visibleAdjustment, setVisibleAdjustment] = useState<boolean>(false);
  const [visibleReturn, setVisibleReturn] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(visibleEntry || visibleSale || visibleAdjustment || visibleReturn);


  const [stockProduct, setStockProduct] = useState<StockProduct>(emptyProduct);
  const [productsToChoose, setProductsToChoose] = useState<StockProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [stockErrorLines, setStockErrorLines] = useState<any[]>([]);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<StockProduct[]>>(null);

  const fetchProducts = () => {
    setLoading(true);
    ProductService.findAllStockProducts()
      .then((response: { data: StockProduct[] }) => {
        setStockProducts(response.data);
        setProductsToChoose(response.data.map((product: StockProduct) => ({
          id: product.id!,
          name: product.name,
          description: product.description || '',
          price: product.price,
          stock: product.stock
        })));
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error: Error) => {
        console.error('Error fetching Stock products: ', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      fetchProducts();
    }
  }, [refreshKey]);

  useEffect(() => {
    const isAnyModalOpen = visibleEntry || visibleSale || visibleAdjustment || visibleReturn;

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visibleEntry, visibleSale, visibleAdjustment, visibleReturn]);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const saveMovement = (items: any[], additionalInfo: any) => {
    setSubmitted(true);
    const newMovementDTO = {
      movementType: additionalInfo.movementType.toUpperCase(),
      supplier: additionalInfo.supplier,
      // paymentMethod: additionalInfo.paymentMethod,
      lines: items.map((item: any) => ({
        product: {
          id: item.product_id
        },
        quantity: item.quantity,
        bachNumber: item.bachNumber,
        expirationDate: item.expirationDate,
      })),
    };

    console.log(newMovementDTO);

    MovementService.createWithLines(newMovementDTO)
      .then((response: { data: StockProduct[] }) => {
        toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Movimiento guardado', life: 3000 });
        setVisibleEntry(false);
        setVisibleSale(false);
        setVisibleAdjustment(false);
        setVisibleReturn(false);
        setRefreshKey(prevKey => prevKey + 1);
      })
      .catch((error: {
        response: {
          status: number; data: {
            [x: string]: any; message: string
          }, badLines: any[]
        }
      }) => {
        const errorMessage = error.response.data.message;
        console.log(error)
        if (errorMessage === "INSUFFICIENT_STOCK" && error.response.status === 422) {
          const badLines = error.response.data.badItems;
          console.log(badLines)
          const badLinesNames = badLines.map((line: any) => stockProducts.find((product: StockProduct) => product.id === line.product.id)?.name);
          setStockErrorLines(badLines);
          console.log(badLinesNames)
          console.error('Stock Error: ', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: "Stock insuficiente", life: 3000 });
        } else {
          console.error('Error saving movement: ', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar movimiento', life: 3000 });
        }
      });

  }

  const leftToolbarTemplate = () => {
    return (
      <div className="flex gap-2">
        <Button
          label="Nueva Venta"
          severity="success"
          onClick={() => {
            setStockProduct(emptyProduct);
            setSubmitted(false);
            setVisibleSale(true);
          }} />
        <Button
          label="Nueva Entrada"
          severity="warning"
          onClick={() => {
            setStockProduct(emptyProduct);
            setSubmitted(false);
            setVisibleEntry(true);
          }} />

      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };


  const actionBodyTemplate = (rowData: StockProduct) => {
    console.log(rowData)
    return (
      <React.Fragment>
        <Button
          icon="pi pi-plus"
          tooltip="Devolución de producto"
          tooltipOptions={{ position: 'top' }}
          rounded
          outlined
          className="mr-2"
          onClick={() => {
            setDefaultItem({
              id: rowData.id,
              product_id: rowData.id!,
              product_name: rowData.name,
              description: rowData.description || '',
              quantity: 1,
              price: rowData.price,
              stock: rowData.stock ?? 0
            });
            setStockProduct(emptyProduct);
            setSubmitted(false);
            setVisibleReturn(true);
          }} />
        <Button
          icon="pi pi-minus"
          tooltip="Ajuste de cantidad"
          tooltipOptions={{ position: 'top' }}
          rounded
          outlined
          severity="danger"
          onClick={() => {
            setDefaultItem({
              id: rowData.id,
              product_id: rowData.id!,
              product_name: rowData.name,
              description: rowData.description || '',
              quantity: 1,
              price: rowData.price,
              stock: rowData.stock || 0
            });
            setStockProduct(emptyProduct);
            setSubmitted(false);
            setVisibleAdjustment(true);
          }} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Gestionar Productos</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" placeholder="Buscar..." onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
      </IconField>
    </div>
  );

  return (
    <>
      {loading && <SkeletonLoader />}
      {!loading && (
        <div>
          <Toast ref={toast} />
          <div className="card">
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
            <DataTable
              ref={dt}
              value={stockProducts}
              key={`stock-table-${refreshKey}`}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
              globalFilter={globalFilter} header={header}
            >
              <Column field="id" header="ID" sortable></Column>
              <Column field="name" header="Nombre" sortable></Column>
              <Column field="description" header="Descripción" sortable></Column>
              <Column field="stock" header="Stock Actual" sortable></Column>
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
          </div>
          <NewMovementModal
            visible={visibleEntry}
            onHide={() => setVisibleEntry(false)}
            type="entry"
            onSave={saveMovement}
            providers={[{ id: 1, name: "COFARAL" }, { id: 2, name: "Suizo s.a" }]}
            productsToChoose={productsToChoose}
            stockErrorLines={stockErrorLines}
          />
          <NewMovementModal
            visible={visibleSale}
            onHide={() => setVisibleSale(false)}
            type="sale"
            onSave={saveMovement}
            paymentMethods={[{ id: 1, name: "Efectivo" }, { id: 2, name: "Tarjeta" }]}
            productsToChoose={productsToChoose}
            stockErrorLines={stockErrorLines}
          />
          <NewMovementModal
            defaultItem={defaultItem}
            visible={visibleAdjustment}
            onHide={() => setVisibleAdjustment(false)}
            type="adjustment"
            onSave={saveMovement}
            productsToChoose={productsToChoose}
            stockErrorLines={stockErrorLines}
          />
          <NewMovementModal
            defaultItem={defaultItem}
            visible={visibleReturn}
            onHide={() => setVisibleReturn(false)}
            type="return"
            onSave={saveMovement}
            productsToChoose={productsToChoose}
            stockErrorLines={stockErrorLines}
          />
        </div>
      )}
    </>
  );
}


