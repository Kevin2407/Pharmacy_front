import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';

export default function SkeletonLoader({rows = 4}: { rows?: number }) {
  const items: { id: number }[] = Array.from({ length: rows }, (v, i) => ({ id: i }));
  return (
    <div className="card">
      <Skeleton height="5rem" className="mb-4"></Skeleton>
      <Skeleton height="5rem"></Skeleton>
      <DataTable value={items} className="p-datatable-striped mt-0">
        {items.map((item) => (
          <Column key={item.id} style={{ width: '25%' }} body={<Skeleton width="100%" height="2rem" />} />
        ))}
      </DataTable>
    </div>
  );
}