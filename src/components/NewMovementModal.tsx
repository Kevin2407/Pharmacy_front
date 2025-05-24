import { useState, useEffect, ReactNode, useRef, use } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import SkeletonLoader from './SkeletonLoader';
import ProductSearcher from './ProductSearcher';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';

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
  stock: number;
  expiration_date?: Date | null;
  batch_number?: string;
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
  defaultItem: MovementItem | null;
  visible: boolean;
  onHide: () => void;
  type: 'entry' | 'sale' | 'adjustment' | 'return';
  onSave: (items: MovementItem[], additionalInfo: any) => void;
  providers?: Provider[];
  paymentMethods?: PaymentMethod[];
  productsToChoose?: { id: number; name: string; price: number; stock: number }[];
  stockErrorLines?: string[];
}

export default function NewMovementModal({
  defaultItem,
  visible,
  onHide,
  type,
  onSave,
  providers = [],
  paymentMethods = [],
  productsToChoose = [],
  stockErrorLines = []
}: NewMovementModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [items, setItems] = useState<MovementItem[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        try {
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

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setError(null);

      if (defaultItem) {
        setItems([defaultItem]); 
      } else {
        setItems([]); 
      }

      setTimeout(() => {
        try {
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
  }, [visible, type, defaultItem]);

  const resetForm = () => {
    setItems([]);
    setSelectedProvider(null);
    setSelectedPaymentMethod(null);
    setSubmitted(false);
    setError(null);
  };

  const handleProductSelection = (
    allSelected: { id: number; name: string; price: number; description: string }[],
    added: {
      stock: number; id: number; name: string; price: number; description: string 
}[],
    removed: { id: number; name: string; price: number; description: string }[]
  ) => {
    if (added.length > 0) {
      const newItems = added.map(product => ({
        id: Date.now() + product.id,
        product_id: product.id,
        product_name: product.name,
        description: product.description,
        quantity: 1,
        stock: product.stock,
        price: type === 'sale' ? product.price : undefined,
        expiration_date: type === 'entry' ? null : undefined,
        batch_number: type === 'entry' ? '' : undefined
      }));

      setItems(prevItems => [...prevItems, ...newItems]);

      if (added.length === 1) {
        toast.current?.show({
          severity: 'success',
          summary: 'Producto agregado',
          detail: added[0].name,
          life: 3000
        });
      } else {
        toast.current?.show({
          severity: 'success',
          summary: 'Productos agregados',
          detail: `${added.length} productos agregados`,
          life: 3000
        });
      }
    }

    if (removed.length > 0) {
      const updatedItems = items.filter(item =>
        !removed.some(p => p.id === item.product_id)
      );
      setItems(updatedItems);

      if (removed.length === 1) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Producto eliminado',
          detail: removed[0].name,
          life: 3000
        });
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Productos eliminados',
          detail: `${removed.length} productos eliminados`,
          life: 3000
        });
      }
    }
  };

  const handleQuantityChange = (rowData: MovementItem, quantity: number) => {
    if((type === 'sale' || type === 'adjustment') && quantity > rowData.stock) {
      setError(`No hay suficiente stock para ${rowData.product_name}`);
    } else {
      const updatedItems = items.map(item =>
        item.id === rowData.id ? { ...item, quantity } : item
      );
      setItems(updatedItems);
      if(error) setError(null);
    }
  };

  const removeItem = (id?: number) => {
    if (id) {
      const productToRemove = items.find(item => item.id === id);
      setItems(items.filter(item => item.id !== id));
      if (productToRemove) {
        toast.current?.show({ severity: 'warn', summary: 'Producto eliminado', detail: productToRemove.product_name, life: 3000 });
      }
    }
  };

  const renderInputText = (rowData: MovementItem, field: keyof MovementItem) => {
    if (field === 'batch_number' && type === 'entry') {
      return (
        <InputText
          value={rowData[field] as string || ''}
          onChange={(e) => {
            const updatedItems = items.map(item =>
              item.id === rowData.id ? { ...item, [field]: e.target.value } : item
            );
            setItems(updatedItems);
          }}
        />
      );
    }
    const value = rowData[field];
    return value !== null && value !== undefined ? (
      <>
        <Tooltip target=".description-message" />
        <div
          className="description-message w-12rem overflow-hidden text-overflow-ellipsis white-space-nowrap"
          data-pr-tooltip={String(value)}
          data-pr-position="right"
          data-pr-at="right+5 top"
          data-pr-my="left center-2"
          style={{ cursor: 'pointer' }}
        >
          {String(value)}
        </div>
      </>
    ) : '';
  };

  const renderInputNumber = (rowData: MovementItem, field: keyof MovementItem): ReactNode => {
    if (field === 'price' && type === 'sale') {
      return (
        <InputNumber
          value={rowData[field] as number}
          onValueChange={(e) => {
            const updatedItems = items.map(item =>
              item.id === rowData.id ? { ...item, [field]: e.value === null ? undefined : e.value } : item
            );
            setItems(updatedItems);
          }}
          mode="currency"
          currency="ARS"
          locale="es-AR"
        />
      );
    }
    const value = rowData[field];
    return value !== null && value !== undefined ?
      <div
        className="flex align-items-center justify-content-center"
      >
        {String(value)}
      </div> : '';
  };

  const renderCalendar = (rowData: MovementItem) => {
    return (
      <Calendar
        value={rowData.expiration_date || null}
        onChange={(e) => {
          const updatedItems = items.map(item =>
            item.id === rowData.id ? { ...item, expiration_date: e.value as Date } : item
          );
          setItems(updatedItems);
        }}
        dateFormat="dd/mm/yy"
      />
    );
  };

  const actionTemplate = (rowData: MovementItem) => {
    return (
      <div className="flex">
        <Button
          icon="pi pi-plus"
          tooltip="Sumar cantidad"
          tooltipOptions={{ position: 'top' }}
          rounded
          text
          onClick={() => handleQuantityChange(rowData, rowData.quantity + 1)}
          className="mr-2"
        />
        <Button
          icon="pi pi-minus"
          tooltip="Restar cantidad"
          tooltipOptions={{ position: 'top' }}
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
      <div className="flex align-items-center w-full md:w-auto">
        <ProductSearcher
          productsToChoose={productsToChoose}
          onProductSelect={handleProductSelection}
          selectedProductIds={items.map(item => item.product_id)}
        />
      </div>


      {type === 'entry' && (
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
        <div className="flex justify-content-end mt-3">
          <h3>Total: {items.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0).toFixed(2)}</h3>
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

    if (stockErrorLines.length > 0) {
      setError('No se puede guardar el movimiento, hay productos sin stock');
      return;
    }

    if (items.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    if (type === 'entry' && !selectedProvider) {
      setError('Seleccione un proveedor');
      return;
    }

    if (type === 'sale' && !selectedPaymentMethod) {
      setError('Seleccione un método de pago');
      return;
    }

    const additionalInfo = type === 'entry'
      ? {
        movementType: type,
        provider: selectedProvider
      }
      : {
        movementType: type,
        paymentMethod: selectedPaymentMethod
      };

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
        onClick={() => {
          handleSave();
        }}
      />
    </div>
  );

  return (
    <Dialog
      header={type === 'entry' ? "Nueva entrada de medicamentos"
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
      <Toast ref={toast} />
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
              value={items}
              dataKey="id"
              className="mt-3 h-15rem"
              emptyMessage="No hay productos agregados"
              scrollable
            >
              <Column
                field="product_id"
                header="ID"
                sortable
                style={{ width: '80px' }}
              />
              <Column
                field="product_name"
                header="Producto"
                sortable
              />
              <Column
                field="description"
                header="Descripción"
                body={(rowData) => renderInputText(rowData, 'description')}
              />
                <Column
                  field="stock"
                  header="Stock actual"
                  body={(rowData) => renderInputNumber(rowData, 'stock')}
                  style={{ width: '100px' }}
                />

              {type === 'entry' && (
                <Column
                  field="expiration_date"
                  header="Fecha Exp."
                  body={renderCalendar}
                  style={{ width: '150px' }}
                />
              )}
              {type === 'entry' && (
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
                  field="quantity"
                  header="Cantidad"
                  body={(rowData) => renderInputNumber(rowData, 'quantity')}
                  style={{ width: '100px' }}
                />
              <Column
                body={actionTemplate}
                style={{ width: '80px' }}
                header="Acciones"
              />
            </DataTable>

          </>
        )}
      </div>
    </Dialog>
  );
}