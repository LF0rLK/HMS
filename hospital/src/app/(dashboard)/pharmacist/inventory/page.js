'use client';

import React from 'react';
import Link from 'next/link';
import { usePharmacy } from '@/lib/hooks/usePharmacy';
import { useNotification } from '@/context/NotificationContext';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { formatCurrency } from '@/lib/utils/formatter';
import { PackagePlus } from 'lucide-react';

export default function InventoryPage() {
  const { medicines, loading, updateStock } = usePharmacy();
  const { notify } = useNotification();

  const handleStockPrompt = async (med) => {
    const newStock = prompt(`Update stock count for ${med.name}:`, String(med.stock));
    if (newStock !== null) {
      try {
        await updateStock(med._id || med.id, Number(newStock) || 0);
        notify.success(`Stock for ${med.name} updated!`);
      } catch (err) {
        notify.error('Failed to update stock');
      }
    }
  };

  const columns = [
    { label: 'Medicine Name', key: 'name' },
    { label: 'Category', key: 'category' },
    { label: 'Manufacturer', key: 'manufacturer' },
    {
      label: 'Stock Quantity',
      key: 'stock',
      render: (val) => (
        <span className={`font-mono font-bold ${val < 50 ? 'text-bias-left' : 'text-green-600'}`}>
          {val}
        </span>
      ),
    },
    { label: 'Price', key: 'price', render: (val) => formatCurrency(val) },
    { label: 'Unit', key: 'unit' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Pharmacy Stock Inventory</h1>
          <p className="text-body-sm text-text-secondary">Monitor medication supplies and storage counts.</p>
        </div>
        <Link href="/pharmacist/inventory/add">
          <Button className="flex items-center gap-2">
            <PackagePlus size={16} />
            <span>Add Stock Item</span>
          </Button>
        </Link>
      </div>

      {loading ? <PageLoader /> : (
        <Table
          columns={columns}
          data={medicines}
          emptyMessage="No medicines registered in stock repository."
          actions={(row) => (
            <Button size="sm" variant="secondary" onClick={() => handleStockPrompt(row)}>
              Replenish
            </Button>
          )}
        />
      )}
    </div>
  );
}
