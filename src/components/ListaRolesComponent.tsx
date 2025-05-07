import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import RoleService from '../services/RoleService';

export interface Role {
  id?: number;
  name: string;
}

export default function ListaRolesComponent() {
  const emptyRole: Role = {
    id: undefined,
    name: ''
  };

  const [roles, setRoles] = useState<Role[]>([]);
  const [roleDialog, setRoleDialog] = useState<boolean>(false);
  const [deleteRoleDialog, setDeleteRoleDialog] = useState<boolean>(false);
  const [role, setRole] = useState<Role>(emptyRole);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Role[]>>(null);

  useEffect((): void => {
    RoleService.findAll().then((response: { data: Role[] }) => {
      setRoles(response.data);
    }).catch((error: Error) => {
      console.error('Error loading roles: ', error);
    });
  }, []);

  const openNew = () => {
    setRole(emptyRole);
    setSubmitted(false);
    setRoleDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setRoleDialog(false);
  };

  const hideDeleteRoleDialog = () => {
    setDeleteRoleDialog(false);
  };

  const saveRole = () => {
    setSubmitted(true);

    if (role.name.trim()) {
      let _roles = [...roles];
      let _role = { ...role };

      if (role.id) {
        const index = findIndexById(role.id);

        _roles[index] = _role;
        
        RoleService.update(_role.id as number, _role).then(() => {
          setRoles(_roles);
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Rol Actualizado', life: 3000 });
        }).catch((error) => {
          console.error('Error updating role:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el rol', life: 3000 });
        });
      } else {
        RoleService.create(_role).then((response) => {
          setRoles([...roles, response.data]);
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Rol Creado', life: 3000 });
        }).catch((error) => {
          console.error('Error creating role:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el rol', life: 3000 });
        });
      }

      setRoleDialog(false);
      setRole(emptyRole);
    }
  };

  const editRole = (role: Role) => {
    setRole({ ...role });
    setRoleDialog(true);
  };

  const confirmDeleteRole = (role: Role) => {
    setRole(role);
    setDeleteRoleDialog(true);
  };

  const deleteRole = () => {
    if (role.id) {
      RoleService.delete(role.id)
        .then(() => {
          let _roles = roles.filter((val) => val.id !== role.id);
          setRoles(_roles);
          setDeleteRoleDialog(false);
          setRole(emptyRole);
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Rol Eliminado', life: 3000 });
        })
        .catch((error) => {
          console.error('Error deleting role:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el rol', life: 3000 });
        });
    }
  };

  const findIndexById = (id: number) => {
    let index = -1;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _role = { ...role };
    // @ts-ignore
    _role[name] = val;
    setRole(_role);
  };

  const leftToolbarTemplate = () => {
    return (
      <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const actionBodyTemplate = (rowData: Role) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRole(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteRole(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Gestionar Roles</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" placeholder="Buscar..." onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
      </IconField>
    </div>
  );

  const roleDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveRole} />
    </React.Fragment>
  );

  const deleteRoleDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRoleDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteRole} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={roles}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} roles" globalFilter={globalFilter} header={header}
        >
          <Column field="id" header="ID" sortable style={{ width: '10%' }}></Column>
          <Column field="name" header="Nombre" sortable style={{ width: '25%' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ width: '20%' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={roleDialog} style={{ width: '450px' }} header="Detalles del Rol" modal className="p-fluid" footer={roleDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name" className="font-bold">Nombre</label>
          <InputText id="name" value={role.name} onChange={(e) => onInputChange(e, 'name')} required maxLength={50} 
            className={classNames({ 'p-invalid': submitted && !role.name })} />
          {submitted && !role.name && <small className="p-error">El nombre del rol es obligatorio.</small>}
        </div>

      </Dialog>

      <Dialog visible={deleteRoleDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteRoleDialogFooter} onHide={hideDeleteRoleDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {role && (
            <span>
              ¿Está seguro que desea eliminar el rol <b>{role.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
