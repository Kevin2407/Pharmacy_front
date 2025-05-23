import React, { useState, useEffect, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// import { ProductService } from './service/ProductService';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export default function ProductSearcher({
  handleSearch,
  productsToChoose,
  onProductSelect,
  selectedProductIds = []
}: {
  handleSearch: (value: string) => void,
  productsToChoose: Product[],
  onProductSelect: (products: Product[], added: Product[], removed: Product[]) => void,
  selectedProductIds?: number[]
}) {
  const op = useRef<OverlayPanel>(null);
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    productsToChoose.filter(p => selectedProductIds.includes(p.id))
  );

  // Update selectedProducts when selectedProductIds changes
  useEffect(() => {
    setSelectedProducts(productsToChoose.filter(p => selectedProductIds.includes(p.id)));
  }, [selectedProductIds, productsToChoose]);

  const handleSelectionChange = (e: { value: Product[] }) => {
   console.log(e.value)
    const newSelection = e.value;

    // Find products that were added in this selection change
    const addedProducts = newSelection.filter(
      product => !selectedProducts.some(p => p.id === product.id)
    );

    // Find products that were removed in this selection change
    const removedProducts = selectedProducts.filter(
      product => !newSelection.some(p => p.id === product.id)
    );

    setSelectedProducts(newSelection);
    onProductSelect(newSelection, addedProducts, removedProducts);
  };

  const formatCurrency = (value: number): string => {
    return value?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  };

  const priceBody = (rowData: Product) => {
    return formatCurrency(rowData?.price);
  };

  const handleApplySelection = () => {
    op.current?.hide();
  };

  return (
    <div className="card flex flex-column align-items-center gap-3">
      <Toast ref={toast} />
      <IconField iconPosition="left" className="w-full">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Buscar producto..."
          onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }}
          onFocus={(e) => op.current?.toggle(e)}
          className="w-full"
        />
      </IconField>
      <OverlayPanel
        ref={op}
        style={{ width: '450px' }}
        onHide={() => setGlobalFilter('')}
        showCloseIcon
      >
        <DataTable
          value={productsToChoose}
          paginator
          rows={5}
          globalFilter={globalFilter}
          emptyMessage="No se encontraron productos"
          selectionMode="multiple"
          selection={selectedProducts}
          onSelectionChange={handleSelectionChange}
          dataKey="id"
        >
          <Column field="id" header="ID" sortable style={{ width: '70px' }} />
          <Column field="name" header="Nombre" sortable style={{ minWidth: '12rem' }} />
          <Column field="price" header="Precio" body={priceBody} sortable style={{ minWidth: '8rem' }} />
          <Column field="description" header="Descripción" sortable style={{ display: 'none' }} />
        </DataTable>
      </OverlayPanel>
    </div>
  );
}