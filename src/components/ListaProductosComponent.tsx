
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProductService  from '../services/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';

enum ProductType {
  GENERAL = 'GENERAL',
  MEDICATION = 'MEDICATION',
  PRESCRIPTION_MEDICATION = 'PRESCRIPTION_MEDICATION',
}

interface Product {
  id?: number;
  name: string;
  price: number;
  current_stock: number;
  category: {id:number};
  product_type: ProductType;
  image?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  created_by?: number;
  updated_by?: number;
}

export default function ListaProductosComponent() {

  const emptyProduct: Product = {
    id: undefined,
    name: '',
    price: 0,
    current_stock: 0,
    category: { id: 1 },
    product_type: ProductType.GENERAL,
    image: '',
    description: ''
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [productDialog, setProductDialog] = useState<boolean>(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
  const [product, setProduct] = useState<Product>(emptyProduct);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Product[]>>(null);

  useEffect((): void => {
    ProductService.findAll().then((response: { data: Product[] }) => {
      setProducts(response.data);
    }
    ).catch((error: Error) => {
      console.error('Error: ', error);
    }
    );
  }, []);

  const saveProductToDatabase = (product: Product) => {
    if (product.id) {
      ProductService.update(product.id, product).then((response) => {
        console.log('Product updated successfully:', response.data);
      }).catch((error) => {
        console.error('Error updating product:', error);
      });
    } else {
      const { id, ...newProduct } = product;
      console.log('Saving product to database:', newProduct);
      ProductService.create(newProduct).then((response) => {
        console.log('Product created successfully:', response.data);
      }).catch((error) => {
        console.error('Error creating product:', error);
      });
    }
  }


  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };

      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      } else {
        _product.image = 'product-placeholder.svg';
        _products.push(_product);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }


      saveProductToDatabase(_product);
      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product: Product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);

    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
  };

  const findIndexById = (id: number) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };


  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const onCategoryChange = (e: RadioButtonChangeEvent) => {
    let _product = { ...product };

    _product['category'] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    // @ts-ignore
    _product[name] = val;

    setProduct(_product);
  };

  const onInputTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    // @ts-ignore
    _product[name] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
    const val = e.value ?? 0;
    let _product = { ...product };

    // @ts-ignore
    _product[name] = val;

    setProduct(_product);
  };

  const leftToolbarTemplate = () => {
    return (
        <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };


  const actionBodyTemplate = (rowData: Product) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
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
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
    </React.Fragment>
  );


  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={products} 
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos" globalFilter={globalFilter} header={header}
        >
          <Column field="id" header="ID" sortable></Column>
          <Column field="name" header="Nombre" sortable></Column>
          <Column field="price" header="Precio" sortable></Column>
          <Column field="current_stock" header="Stock Actual" sortable></Column>
          <Column field="category_id" header="ID Categoria" sortable></Column>
          <Column field="product_type" header="Tipo de Producto" sortable></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>
      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        {product.image && <img src={product.image} alt={product.name} className="product-image block m-auto pb-3 max-h-10rem" />}
        
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Nombre
          </label>
          <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
          {submitted && !product.name && <small className="p-error">El nombre es obligatorio.</small>}
        </div>
        
        <div className="field">
          <label htmlFor="description" className="font-bold">
            Descripción
          </label>
          <InputTextarea id="description" value={product.description} onChange={(e) => onInputTextAreaChange(e, 'description')} rows={3} cols={20} />
        </div>

        {/* <div className="field">
          <label htmlFor="image" className="font-bold">
            Imagen
          </label>
          <FileUpload
            mode="basic"
            name="image"
            accept="image/*"
            maxFileSize={1000000}
            chooseLabel="Seleccionar"
            className="mt-2"
            onUpload={(e) => {
              const val = e.files[0].name;
              let _product = { ...product };
              _product['image'] = val;
              setProduct(_product);
            }}
          />
        </div> */}

        <div className="field">
          <label htmlFor="image" className="font-bold">
            Imagen (URL)
          </label>
          <InputText
            id="image"
            value={product.image || ''}
            onChange={(e) => onInputChange(e, 'image')}
            placeholder="Ingrese la URL de la imagen (ej: https://ejemplo.com/imagen.jpg)"
            className="w-full mt-2"
          />
          <small className="text-muted">Ingrese un enlace directo a la imagen hasta que el sistema de carga esté disponible.</small>
        </div>

        <div className="field">
          <label className="mb-3 font-bold">Tipo de Producto</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-4">
              <RadioButton inputId="type1" name="product_type" value={ProductType.GENERAL} onChange={(e) => onInputChange(e, 'product_type')} checked={product.product_type === ProductType.GENERAL} />
              <label htmlFor="type1">General</label>
            </div>
            <div className="field-radiobutton col-4">
              <RadioButton inputId="type2" name="product_type" value={ProductType.MEDICATION} onChange={(e) => onInputChange(e, 'product_type')} checked={product.product_type === ProductType.MEDICATION} />
              <label htmlFor="type2">Medicamento</label>
            </div>
            <div className="field-radiobutton col-4">
              <RadioButton inputId="type3" name="product_type" value={ProductType.PRESCRIPTION_MEDICATION} onChange={(e) => onInputChange(e, 'product_type')} checked={product.product_type === ProductType.PRESCRIPTION_MEDICATION} />
              <label htmlFor="type3">Receta</label>
            </div>
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="category_id" className="font-bold">
              ID de Categoría
            </label>
            <InputNumber id="category" value={product.category.id} onValueChange={(e) => onInputNumberChange(e, 'category')} />
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="price" className="font-bold">
              Precio
            </label>
            <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="ARS" locale="en-US" />
          </div>
          <div className="field col">
            <label htmlFor="current_stock" className="font-bold">
              Existencias
            </label>
            <InputNumber id="current_stock" value={product.current_stock} onValueChange={(e) => onInputNumberChange(e, 'current_stock')} />
          </div>
        </div>
            </Dialog>

      <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>


    </div>
  );
}





