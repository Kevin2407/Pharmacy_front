
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

export default function ListaStock() {

  const emptyProduct: StockProduct = {
    id: undefined,
    name: '',
    price: 0,
    stock: 0,
    description: ''
  };

  const [stockProducts, setStockProducts] = useState<StockProduct[]>([]);
  const [visiblePurchase, setVisiblePurchase] = useState<boolean>(false);
  const [visibleSale, setVisibleSale] = useState<boolean>(false);
  const [visibleAdjustment, setVisibleAdjustment] = useState<boolean>(false);
  const [visibleReturn, setVisibleReturn] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(visiblePurchase||visibleSale||visibleAdjustment||visibleReturn);


  const [stockProduct, setStockProduct] = useState<StockProduct>(emptyProduct);
  const [productsToChoose, setProductsToChoose] = useState<StockProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false); //para validacion de formulario
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<StockProduct[]>>(null);

  useEffect((): void => {
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
        setLoading(false);
      }
      ).catch((error: Error) => {
        console.error('Error fetching Stock products: ', error);
      }
      );
  }, []);

  useEffect(() => {
    const isAnyModalOpen = visiblePurchase || visibleSale || visibleAdjustment || visibleReturn;

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visiblePurchase, visibleSale, visibleAdjustment, visibleReturn]);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const saveMovement = (items: any[], additionalInfo: any) => {
    setSubmitted(true);
    console.log(items)
    console.log(additionalInfo)
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
            setVisiblePurchase(true);
          }} />

      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };


  const actionBodyTemplate = (rowData: StockProduct) => {
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
            <DataTable ref={dt} value={stockProducts}
              dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos" globalFilter={globalFilter} header={header}
            >
              <Column field="id" header="ID" sortable></Column>
              <Column field="name" header="Nombre" sortable></Column>
              <Column field="description" header="Descripción" sortable></Column>
              <Column field="stock" header="Stock Actual" sortable></Column>
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
          </div>
          <NewMovementModal
            visible={visiblePurchase}
            onHide={() => setVisiblePurchase(false)}
            type="purchase"
            onSave={saveMovement}
            providers={[{ id: 1, name: "pachi" }, { id: 2, name: "pepe" }]}
            productsToChoose={productsToChoose}
          />
          <NewMovementModal
            visible={visibleSale}
            onHide={() => setVisibleSale(false)}
            type="sale"
            onSave={saveMovement}
            paymentMethods={[{ id: 1, name: "pachi" }, { id: 2, name: "pepe" }]}
            productsToChoose={productsToChoose}
          />
          <NewMovementModal
            visible={visibleAdjustment}
            onHide={() => setVisibleAdjustment(false)}
            type="adjustment"
            onSave={saveMovement}
            productsToChoose={productsToChoose}
          />
          <NewMovementModal
            visible={visibleReturn}
            onHide={() => setVisibleReturn(false)}
            type="return"
            onSave={saveMovement}
            productsToChoose={productsToChoose}
          />
        </div>
      )}
    </>
  );
}


