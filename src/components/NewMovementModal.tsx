import { useState, useEffect, ReactNode } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import SkeletonLoader from './SkeletonLoader';

interface Product {
  id: number;
  name: string;
  description: string;
  price?: number;
  stock?: number;
}

interface MovementItem {
  id?: number;
  product_id: number;
  product_name: string;
  description: string;
  quantity: number;
  price?: number;
  expiration_date?: Date | null;
  batch_number?: string;
  isNewRow?: boolean;
}

interface Provider {
  id: number;
  name: string;
}

interface PaymentMethod {
  id: number;
  name: string;
}

interface NewMovementModalProps {
  visible: boolean;
  onHide: () => void;
  type: 'purchase' | 'sale' | 'adjustment' | 'return';
  onSave: (items: MovementItem[], additionalInfo: any) => void;
  providers?: Provider[];
  paymentMethods?: PaymentMethod[];
}

export default function NewMovementModal({
  visible,
  onHide,
  type,
  onSave,
  providers = [],
  paymentMethods = []
}: NewMovementModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [items, setItems] = useState<MovementItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const emptyItem: MovementItem = {
    product_id: 0,
    product_name: '',
    description: '',
    quantity: 1,
    price: type === 'sale' ? 0 : undefined,
    expiration_date: type === 'purchase' ? null : undefined,
    batch_number: type === 'purchase' ? '' : undefined
  };

  const [newRow, setNewRow] = useState<MovementItem>(emptyItem);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        try {
          // ProductService.getAll().then(data => setProducts(data))
          setProducts([]);
          setLoading(false);
        } catch (err) {
          setError('Error al cargar productos');
          setLoading(false);
        }
      }, 500);
    } else {
      resetForm();
    }
  }, [visible, type]);

  const resetForm = () => {
    setItems([]);
    setNewRow(emptyItem);
    setSelectedProvider(null);
    setSelectedPaymentMethod(null);
    setSearchTerm('');
    setSubmitted(false);
    setError(null);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setLoading(true);

    setTimeout(() => {
      try {
        // ProductService.search(term).then(data => setProducts(data))
        setLoading(false);
      } catch (err) {
        setError('Error en la búsqueda');
        setLoading(false);
      }
    }, 300);
  };

  const addNewRow = () => {
    console.log(items);
    if (newRow.product_name.trim()) {
      setItems([...items, { ...newRow, id: Date.now() }]);
      setNewRow(emptyItem);
    } else {
      setError('El nombre del producto es requerido');
    }
  };

  const handleInputChange = (field: keyof MovementItem, value: any) => {
    setNewRow({ ...newRow, [field]: value });
  };

  const handleQuantityChange = (rowData: MovementItem, quantity: number) => {
    if (rowData.isNewRow) {
      setNewRow({ ...newRow, quantity });
    } else {
      const updatedItems = items.map(item =>
        item.id === rowData.id ? { ...item, quantity } : item
      );
      setItems(updatedItems);
    }
  };

  const removeItem = (id?: number) => {
    if (id) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const renderInputText = (rowData: MovementItem, field: keyof MovementItem) => {
    if (rowData.isNewRow) {
      return (
        <InputText
          value={newRow[field] as string || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      );
    }
    const value = rowData[field];
    return value !== null && value !== undefined ? String(value) : '';
  };

  const renderInputNumber = (rowData: MovementItem, field: keyof MovementItem): ReactNode => {
    if (rowData.isNewRow) {
      return (
        <InputNumber
          value={newRow[field] as number}
          onValueChange={(e) => handleInputChange(field, e.value)}
          min={0}
        />
      );
    }
    const value = rowData[field];
    return value !== null && value !== undefined ? String(value) : '';
  };

  const renderCalendar = (rowData: MovementItem) => {
    if (rowData.isNewRow) {
      return (
        <Calendar
          value={newRow.expiration_date || null}
          onChange={(e) => handleInputChange('expiration_date', e.value)}
          dateFormat="dd/mm/yy"
        />
      );
    }
    return rowData.expiration_date ? new Date(rowData.expiration_date).toLocaleDateString() : '';
  };

  const actionTemplate = (rowData: MovementItem) => {
    if (rowData.isNewRow) {
      return (
        <Button icon="pi pi-plus" rounded text onClick={addNewRow} />
      );
    }

    return (
      <div className="flex">
        <Button
          icon="pi pi-plus"
          rounded
          text
          onClick={() => handleQuantityChange(rowData, rowData.quantity + 1)}
          className="mr-2"
        />
        <Button
          icon="pi pi-minus"
          rounded
          text
          disabled={rowData.quantity <= 1}
          onClick={() => handleQuantityChange(rowData, Math.max(1, rowData.quantity - 1))}
          className="mr-2"
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => removeItem(rowData.id)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column gap-2 md:flex-row md:justify-content-between md:align-items-center">
      <div className="flex align-items-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </IconField>
      </div>

      {type === 'purchase' && (
        <div className="flex align-items-center">
          <span className="mr-2">Proveedor:</span>
          <Dropdown
            value={selectedProvider}
            options={providers}
            onChange={(e) => setSelectedProvider(e.value)}
            optionLabel="name"
            placeholder="Seleccionar proveedor"
            className={`w-full md:w-14rem ${submitted && !selectedProvider ? 'p-invalid' : ''}`}
          />
        </div>
      )}

      {type === 'sale' && (
        <div className="flex align-items-center">
          <span className="mr-2">Método de pago:</span>
          <Dropdown
            value={selectedPaymentMethod}
            options={paymentMethods}
            onChange={(e) => setSelectedPaymentMethod(e.value)}
            optionLabel="name"
            placeholder="Seleccionar método"
            className={`w-full md:w-14rem ${submitted && !selectedPaymentMethod ? 'p-invalid' : ''}`}
          />
        </div>
      )}
    </div>
  );

  const handleSave = () => {
    setSubmitted(true);

    if (items.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    if (type === 'purchase' && !selectedProvider) {
      setError('Seleccione un proveedor');
      return;
    }

    if (type === 'sale' && !selectedPaymentMethod) {
      setError('Seleccione un método de pago');
      return;
    }

    const additionalInfo = type === 'purchase'
      ? { provider: selectedProvider }
      : { paymentMethod: selectedPaymentMethod };

    onSave(items, additionalInfo);
    onHide();
    resetForm();
  };

  const footer = (
    <div className="flex justify-content-end">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={() => {
          onHide();
          resetForm();
        }}
        className="mr-2"
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={handleSave}
      />
    </div>
  );

  return (
    <Dialog
      header={type === 'purchase' ? "Nueva entrada de medicamentos"
        : type === 'sale' ? "Nueva Venta"
          : type === 'adjustment' ? "Ajuste de Stock (resta)"
            : "Devolución"}
      visible={visible}
      style={{ width: '90vw', maxWidth: '1200px' }}
      modal
      className="p-fluid"
      footer={footer}
      dismissableMask
      onHide={() => {
        onHide();
        resetForm();
      }}>
      <div className="card">
        {loading ? (
          <SkeletonLoader rows={1} />
        ) : (
          <>
            {header}

            {error && (
              <div className="p-error mt-2 mb-2">{error}</div>
            )}

            <DataTable
              value={[...items, { ...newRow, isNewRow: true }]}
              dataKey="id"
              className="mt-3"
              emptyMessage="No hay productos agregados"
              scrollable
            >
              <Column
                field="product_id"
                header="ID"
                body={(rowData) => renderInputText(rowData, 'product_id')}
              />
              <Column
                field="product_name"
                header="Producto"
                body={(rowData) => renderInputText(rowData, 'product_name')}
              />
              <Column
                field="description"
                header="Descripción"
                body={(rowData) => renderInputText(rowData, 'description')}
              />
              <Column
                field="quantity"
                header="Cantidad"
                body={(rowData) => renderInputNumber(rowData, 'quantity')}
                style={{ width: '100px' }}
              />

              {type === 'purchase' && (
                  <Column
                    field="expiration_date"
                    header="Fecha Exp."
                    body={renderCalendar}
                    style={{ width: '150px' }}
                  />
              )}
              {type === 'purchase' && (
                  <Column
                    field="batch_number"
                    header="No. Lote"
                    body={(rowData) => renderInputText(rowData, 'batch_number')}
                    style={{ width: '120px' }}
                  />
              )}

              {type === 'sale' && ( 
                <Column
                  field="price"
                  header="Precio"
                  body={(rowData) => renderInputNumber(rowData, 'price')}
                  style={{ width: '120px' }}
                />
              )}

              <Column
                body={actionTemplate}
                style={{ width: '150px' }}
                header="Acciones"
              />
            </DataTable>

            {items.length > 0 && (
              <div className="flex justify-content-end mt-3">
                <h3>Total: {items.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0).toFixed(2)}</h3>
              </div>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}