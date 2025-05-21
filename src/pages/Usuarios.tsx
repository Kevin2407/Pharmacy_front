import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Role } from './Roles';
import UserService from '../services/UserService';
import RoleService from '../services/RoleService';
import { findIndexById } from '../utils';

interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  role: Role ;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
  created_by?: number;
  updated_by?: number;
}

export default function ListaUsuarios() {
  const emptyUser: User = {
    id: undefined,
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: { id: undefined, name: '' },
    active: true,
    created_by: undefined,
    updated_by: undefined
  };

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userDialog, setUserDialog] = useState<boolean>(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState<boolean>(false);
  const [user, setUser] = useState<User>(emptyUser);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<User[]>>(null);

  useEffect((): void => {
    UserService.findAll().then((response: { data: User[] }) => {
      setUsers(response.data);
    }).catch((error: Error) => {
      console.error('Error loading users: ', error);
    });
    RoleService.findAll().then((response: { data: Role[] }) => {
      console.log('Roles loaded: ', response.data);
      setRoles(response.data);
    }).catch((error: Error) => {
      console.error('Error loading roles: ', error);
    });
  }, []);

  const roleList = roles.map((role) => ({
    label: role.name,
    value: role
  }));

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const saveUser = () => {
    setSubmitted(true);
    console.log(user)

    if (user.username.trim() && user.email.trim() && user.first_name.trim() && user.last_name.trim()) {
      let _users = [...users];
      let _user = { ...user };

      if (user.id) {
        const index = findIndexById(user.id, users);

        _users[index] = _user;
        
        UserService.update(_user.id!, _user).then(() => {
          setUsers(_users);
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Actualizado', life: 3000 });
        }).catch((error) => {
          console.error('Error updating user:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario', life: 3000 });
        });
      } else {
        UserService.create(_user).then((response) => {
          setUsers([...users, response.data]);
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Creado', life: 3000 });
        }).catch((error) => {
          console.error('Error creating user:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario', life: 3000 });
        });
      }

      setUserDialog(false);
      setUser(emptyUser);
    }
  };

  const editUser = (user: User) => {
    // Create a copy without the password
    const userToEdit = { ...user, password: '' };
    setUser(userToEdit);
    setUserDialog(true);
  };

  const confirmDeleteUser = (user: User) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteUser = () => {
    if (user.id) {
      UserService.delete(user.id)
        .then(() => {
          let _users = users.filter((val) => val.id !== user.id);
          setUsers(_users);
          setDeleteUserDialog(false);
          setUser(emptyUser);
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Eliminado', life: 3000 });
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario', life: 3000 });
        });
    }
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement> | RadioButtonChangeEvent, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _user = { ...user };
    // @ts-ignore
    _user[name] = val;
    setUser(_user);
  };

  const onRoleChange = (e: { value: any }) => {
    let _user = { ...user };
    _user.role = e.value;
    setUser(_user);
  };

  const onActiveChange = (e: RadioButtonChangeEvent) => {
    let _user = { ...user };
    _user.active = e.value;
    setUser(_user);
  };

  const leftToolbarTemplate = () => {
    return (
      <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const actionBodyTemplate = (rowData: User) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData: User) => {
    return <span className={`user-badge status-${rowData.active ? 'active' : 'inactive'}`}>
      {rowData.active ? 'Activo' : 'Inactivo'}
    </span>;
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Gestionar Usuarios</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" placeholder="Buscar..." onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
      </IconField>
    </div>
  );

  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUser} />
    </React.Fragment>
  );

  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteUser} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={users}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios" globalFilter={globalFilter} header={header}
        >
          <Column field="id" header="ID" sortable style={{ width: '5%' }}></Column>
          <Column field="username" header="Usuario" sortable style={{ width: '15%' }}></Column>
          <Column field="first_name" header="Nombre" sortable style={{ width: '15%' }}></Column>
          <Column field="last_name" header="Apellido" sortable style={{ width: '15%' }}></Column>
          <Column field="email" header="Email" sortable style={{ width: '20%' }}></Column>
          <Column field="role.name" header="Rol" sortable style={{ width: '10%' }}></Column>
          <Column field="active" header="Estado" body={statusBodyTemplate} sortable style={{ width: '10%' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ width: '10%' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={userDialog} style={{ width: '450px' }} header="Detalles del Usuario" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="username" className="font-bold">Usuario</label>
          <InputText id="username" value={user.username} onChange={(e) => onInputChange(e, 'username')} required maxLength={50} 
            className={classNames({ 'p-invalid': submitted && !user.username })} />
          {submitted && !user.username && <small className="p-error">El nombre de usuario es obligatorio.</small>}
        </div>

        <div className="field">
          <label htmlFor="email" className="font-bold">Email</label>
          <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required maxLength={100}
            className={classNames({ 'p-invalid': submitted && !user.email })} />
          {submitted && !user.email && <small className="p-error">El email es obligatorio.</small>}
        </div>

        <div className="field">
          <label htmlFor="password" className="font-bold">{user.id ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}</label>
          <Password id="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} toggleMask 
            className={classNames({ 'p-invalid': submitted && !user.id && !user.password })}
            feedback={false} />
          {submitted && !user.id && !user.password && <small className="p-error">La contraseña es obligatoria para nuevos usuarios.</small>}
        </div>

        <div className="formgrid grid">
          <div className="field col-6">
            <label htmlFor="first_name" className="font-bold">Nombre</label>
            <InputText id="first_name" value={user.first_name} onChange={(e) => onInputChange(e, 'first_name')} required maxLength={100}
              className={classNames({ 'p-invalid': submitted && !user.first_name })} />
            {submitted && !user.first_name && <small className="p-error">El nombre es obligatorio.</small>}
          </div>
          
          <div className="field col-6">
            <label htmlFor="last_name" className="font-bold">Apellido</label>
            <InputText id="last_name" value={user.last_name} onChange={(e) => onInputChange(e, 'last_name')} required maxLength={100}
              className={classNames({ 'p-invalid': submitted && !user.last_name })} />
            {submitted && !user.last_name && <small className="p-error">El apellido es obligatorio.</small>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="role" className="font-bold">Rol</label>
          <Dropdown id="role" value={user.role} options={roleList} onChange={onRoleChange} 
            placeholder="Seleccione un rol" className="w-full" />
        </div>

        <div className="field">
          <label className="font-bold mb-3">Estado</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton inputId="active1" name="active" value={true} onChange={onActiveChange} checked={user.active === true} />
              <label htmlFor="active1">Activo</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="active2" name="active" value={false} onChange={onActiveChange} checked={user.active === false} />
              <label htmlFor="active2">Inactivo</label>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {user && (
            <span>
              ¿Está seguro que desea eliminar a <b>{user.username}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
