'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBilling } from '@/lib/hooks/useBilling';
import { usePatient } from '@/lib/hooks/usePatient';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Select, Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Plus, Trash2 } from 'lucide-react';

export default function GenerateBillPage() {
  const router = useRouter();
  const { create } = useBilling();
  const { patients } = usePatient();
  const { notify } = useNotification();

  const [patientId, setPatientId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [itemDesc, setItemDesc] = useState('');
  const [itemAmt, setItemAmt] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    if (!itemDesc || !itemAmt) return;
    setItems((prev) => [...prev, { description: itemDesc, amount: Number(itemAmt) }]);
    setItemDesc('');
    setItemAmt('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      notify.warning('Please add at least one bill item.');
      return;
    }
    setLoading(true);
    try {
      await create({
        patientId,
        items,
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
      });
      notify.success('Invoice generated successfully!');
      router.push('/receptionist/billing');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const patOptions = patients.map((p) => ({ value: p._id || p.id, label: `${p.name} (${p.phone})` }));

  return (
    <div className="flex flex-col gap-6 max-w-[650px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Generate Custom Billing Invoice</h1>
        <p className="text-body-sm text-text-secondary">Create items statement for hospital services.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Select Patient"
            id="gen-bill-pat"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            options={patOptions.length > 0 ? patOptions : [{ value: 'p1', label: 'John Doe' }]}
            required
            placeholder="-- Choose Patient --"
          />

          {/* Add Item Panel */}
          <div className="p-4 bg-surface rounded-md border border-border flex flex-col gap-3">
            <h4 className="text-body-sm font-bold text-text-primary">Add Service Item</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Input
                  label="Description"
                  id="item-desc"
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="e.g. Emergency Room Facility Fee"
                />
              </div>
              <Input
                label="Amount ($)"
                id="item-amt"
                type="number"
                value={itemAmt}
                onChange={(e) => setItemAmt(e.target.value)}
                placeholder="250"
              />
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={handleAddItem} className="w-fit">
              <Plus size={14} className="mr-1" />
              Add Item
            </Button>
          </div>

          {/* Items Stack */}
          {items.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-caption font-bold text-text-secondary uppercase select-none">Line Items Stack</span>
              <div className="flex flex-col gap-2 border border-border rounded-md p-3">
                {items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-surface p-2 rounded-md text-body-sm">
                    <span>{it.description}</span>
                    <div className="flex items-center gap-3">
                      <strong className="text-text-primary">${it.amount}</strong>
                      <button
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== idx))}
                        className="text-bias-left hover:opacity-80 p-1 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Discount Amount ($)"
              id="bill-disc"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <Input
              label="Tax Amount ($)"
              id="bill-tax"
              type="number"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="mt-2" disabled={loading}>
            {loading ? 'Generating…' : 'Generate & Issue Invoice'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
