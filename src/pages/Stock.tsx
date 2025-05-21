
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
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import SkeletonLoader from '../components/SkeletonLoader';
import NewMovementModal from '../components/NewMovementModal';


interface StockProduct {
  id?: number;
  name: string;
  price: number;
  stock: number;
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
  const [visible, setVisible] = useState<boolean>(false);

  const [stockProduct, setStockProduct] = useState<StockProduct>(emptyProduct);
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
        setLoading(false);
      }
      ).catch((error: Error) => {
        console.error('Error fetching Stock products: ', error);
      }
      );
  }, []);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const leftToolbarTemplate = () => {
    return (
      <Button
        label="Nuevo"
        icon="pi pi-plus"
        severity="success"
        onClick={() => {
          setStockProduct(emptyProduct);
          setSubmitted(false);
          setVisible(true);
        }} />
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };


  const actionBodyTemplate = (rowData: StockProduct) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-plus" rounded outlined className="mr-2" onClick={() => console.log("pepe")} />
        <Button icon="pi pi-minus" rounded outlined severity="danger" onClick={() => console.log("pepe")} />
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
            visible={visible}
            onHide={() => setVisible(false)}
            type="purchase"
            onSave={() => {console.log("pachi")}}
            providers={[{id:1,name: "pachi"}, {id:2,name: "pepe"}]}
          />
        </div>
      )}
    </>
  );
}


