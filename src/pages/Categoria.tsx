
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CategoryService from '../services/CategoryService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import SkeletonLoader from '../components/SkeletonLoader';
import { findIndexById } from '../utils';


export interface Category {
  id?: number;
  name?: string;
  description?: string;
}

export default function ListaCategoriaComponent() {

  const emptyCategory: Category = {
    id: undefined,
    name: '',
    description: ''
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryDialog, setCategoryDialog] = useState<boolean>(false);
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState<boolean>(false);
  const [category, setCategory] = useState<Category>(emptyCategory);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Category[]>>(null);

  useEffect((): void => {
    setLoading(true);
    CategoryService.findAll().then((response: { data: Category[] }) => {
      setCategories(response.data);
      setLoading(false);
    }).catch((error: Error) => {
      console.error('Error: ', error);
    });
  }, []);

  const saveCategoryToDatabase = (category: Category) => {
    if (category.id) {
      CategoryService.update(category.id, category).then((response: { data: any; }) => {
        console.log('Category updated successfully:', response.data);
      }).catch((error: Error) => {
        console.error('Error updating category:', error);
      });
    } else {
      const { id, ...newCategory } = category;
      console.log('Saving category to database:', newCategory);
      CategoryService.create(newCategory).then((response: { data: Category; }) => {
        console.log('Category created successfully:', response.data);
        setCategories((prevCategories) => [...prevCategories, response.data]);
      }).catch((error: Error) => {
        console.error('Error creating category:', error);
      });
    }
  }

  const openNew = () => {
    setCategory(emptyCategory);
    setSubmitted(false);
    setCategoryDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCategoryDialog(false);
  };

  const hideDeleteCategoryDialog = () => {
    setDeleteCategoryDialog(false);
  };

  const saveCategory = () => {
    setSubmitted(true);

    if (category.name?.trim()) {
      let _categories = [...categories];
      let _category = { ...category };

      if (category.id) {
        const index = findIndexById(category.id, categories);

        _categories[index] = _category;
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
      } else {
        _categories.push(_category);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
      }


      saveCategoryToDatabase(_category);
      setCategories(_categories);
      setCategoryDialog(false);
      setCategory(emptyCategory);
    }
  };

  const editCategory = (category: Category) => {
    console.log('Editing category:', category);
    setCategory({ ...category });
    setCategoryDialog(true);
  };

  const confirmDeleteCategory = (category: Category) => {
    setCategory(category);
    setDeleteCategoryDialog(true);
  };

  const deleteCategory = () => {
    if (category.id) {
      CategoryService.delete(category.id)
        .then(() => {
          let _categories = categories.filter((val) => val.id !== category.id);
          setCategories(_categories);
          setDeleteCategoryDialog(false);
          setCategory(emptyCategory);
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });
        })
        .catch((error: Error) => {
          console.error('Error deleting category:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category', life: 3000 });
        });
    } else {
      setDeleteCategoryDialog(false);
      setCategory(emptyCategory);
    }
  };


  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement> | RadioButtonChangeEvent, name: string) => {
    const val = (e.target && e.target.value) || (e as RadioButtonChangeEvent).value || '';
    let _category = { ...category };

    // @ts-ignore
    _category[name] = val;

    setCategory(_category);
  };

  const onInputTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _category = { ...category };

    // @ts-ignore
    _category[name] = val;

    setCategory(_category);
  };

  const leftToolbarTemplate = () => {
    return (
      <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };


  const actionBodyTemplate = (rowData: Category) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCategory(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCategory(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Gestionar Categorias</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" placeholder="Buscar..." onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
      </IconField>
    </div>
  );
  const categoryDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveCategory} />
    </React.Fragment>
  );
  const deleteCategoryDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCategoryDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteCategory} />
    </React.Fragment>
  );


  return (
    <>
      {loading && (
        <SkeletonLoader />
      )}
      {!loading && (
        <>
          <Toast ref={toast} />
          <div className="card">
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable ref={dt} value={categories}
              dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categoryos" globalFilter={globalFilter} header={header}
            >
              <Column field="id" header="ID" sortable></Column>
              <Column field="name" header="Nombre" sortable></Column>
              <Column field="description" header="Descripción" sortable></Column>
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>
          </div>
          <Dialog visible={categoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Categoryo" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
            <div className="field">
              <label htmlFor="name" className="font-bold">
                Nombre
              </label>
              <InputText id="name" value={category.name} maxLength={15} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !category.name })} />
              {submitted && !category.name && <small className="p-error">El nombre es obligatorio.</small>}
            </div>

            <div className="field">
              <label htmlFor="description" className="font-bold">
                Descripción
              </label>
              <InputTextarea id="description" maxLength={255} value={category.description} onChange={(e) => onInputTextAreaChange(e, 'description')} rows={3} cols={20} />
            </div>
          </Dialog>

          <Dialog visible={deleteCategoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {category && (
                <span>
                  Seguro que queres borrar <b>{category.name}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </>)
      }
    </>
  );
}





