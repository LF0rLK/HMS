'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePharmacy } from '@/lib/hooks/usePharmacy';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Input, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export default function AddMedicinePage() {
  const router = useRouter();
  const { add } = usePharmacy();
  const { notify } = useNotification();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Analgesics');
  const [manufacturer, setManufacturer] = useState('');
  const [stock, setStock] = useState(100);
  const [price, setPrice] = useState(10);
  const [unit, setUnit] = useState('Tablet');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await add({
        name,
        category,
        manufacturer,
        stock: Number(stock) || 0,
        price: Number(price) || 0,
        unit,
        expiryDate,
      });
      notify.success(`Medicine ${name} added to repository!`);
      router.push('/pharmacist/inventory');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Register Stock Medicine</h1>
        <p className="text-body-sm text-text-secondary">Add new pharmaceutical entry to pharmacy inventory.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Medicine Name"
              id="med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Metformin 850mg"
              required
            />
          </div>

          <Select
            label="Category"
            id="med-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={['Analgesics', 'Antibiotics', 'Cardiovascular', 'Antidiabetic', 'Antitussives', 'Dermatological']}
          />

          <Input
            label="Manufacturer"
            id="med-mfg"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            placeholder="PharmaCorp"
            required
          />

          <Input
            label="Stock Quantity"
            id="med-stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />

          <Input
            label="Unit Price ($)"
            id="med-price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <Select
            label="Unit Type"
            id="med-unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            options={['Tablet', 'Capsule', 'Bottle', 'Syringe', 'Ointment']}
          />

          <Input
            label="Expiry Date"
            id="med-exp"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="col-span-2 mt-2" disabled={loading}>
            {loading ? 'Adding…' : 'Register Stock Item'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
