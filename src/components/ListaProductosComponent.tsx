
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProductService from '../services/ProductService';
import CategoryService from '../services/CategoryService';
import { Category } from './ListaCategoriaComponent';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

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
  category: { id: number };
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Product[]>>(null);

  useEffect((): void => {
    ProductService.findAll().then((response: { data: Product[] }) => {
      setProducts(response.data);

      CategoryService.findAll().then((response: { data: Category[] }) => {
        setCategories(response.data);
      }).catch((error: Error) => {
        console.error('Error fetching categories: ', error);
      });
    }
    ).catch((error: Error) => {
      console.error('Error: ', error);
    }
    );
  }, []);

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
        _products.push(_product);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }


 if (_product.id) {
      ProductService.update(_product.id, _product).then((response) => {
        console.log('Product updated successfully:', response.data);
        setProducts(response.data);
      }).catch((error) => {
        console.error('Error updating product:', error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update product', life: 3000 });
      });
    } else {
      const { id, ...newProduct } = _product;
      console.log('Saving product to database:', newProduct);
      ProductService.create(newProduct).then((response) => {
        console.log('Product created successfully:', response.data);
        setProducts([...products, response.data]);
      }).catch((error) => {
        console.error('Error creating product:', error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create product', life: 3000 });
      });
    }
      


      
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product: Product) => {
    console.log('Editing product:', product);
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    if (product.id) {
      ProductService.delete(product.id)
        .then(() => {
          let _products = products.filter((val) => val.id !== product.id);
          setProducts(_products);
          setDeleteProductDialog(false);
          setProduct(emptyProduct);
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
        });
    } else {
      setDeleteProductDialog(false);
      setProduct(emptyProduct);
    }
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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement> | RadioButtonChangeEvent, name: string) => {
    const val = (e.target && e.target.value) || (e as RadioButtonChangeEvent).value || '';
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

  const categoryBodyTemplate = (rowData: Product) => {
    const categoryId = rowData.category.id;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : `Categoría ${categoryId}`;
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
          <Column body={categoryBodyTemplate} field="category.id" header="Categoría" sortable></Column>
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
          <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required maxLength={100} autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
          {submitted && !product.name && <small className="p-error">El nombre es obligatorio.</small>}
        </div>

        <div className="field">
          <label htmlFor="description" className="font-bold">
            Descripción
          </label>
          <InputTextarea id="description" value={product.description} maxLength={255} onChange={(e) => onInputTextAreaChange(e, 'description')} rows={3} cols={20} />
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
            maxLength={100}
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
        
        <div className="field">
          <label htmlFor="category" className="font-bold">
            Categoría
          </label>
          <div className="p-fluid">
            <Dropdown
              id="category"
              value={product.category.id}
              options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
              onChange={(e) => {
          let _product = { ...product };
          _product.category = { id: e.value };
          setProduct(_product);
              }}
              placeholder="Seleccione una categoría"
              className={classNames({ 'p-invalid': submitted && !product.category.id })}
            />
            {submitted && !product.category.id && <small className="p-error">La categoría es obligatoria.</small>}
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
              Seguro que queres borrar <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>


    </div>
  );
}





