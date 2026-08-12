'use client';

import React, { useState } from 'react';
import { useBilling } from '@/lib/hooks/useBilling';
import { useNotification } from '@/context/NotificationContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Modal } from '@/components/common/Modal';
import { Select, Input } from '@/components/common/Input';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency, getStatusVariant } from '@/lib/utils/formatter';
import { PAYMENT_METHODS } from '@/lib/utils/constants';
import { downloadBillPdf } from '@/lib/utils/pdfGenerator';
import { Download } from 'lucide-react';

export default function PatientBillsPage() {
  const { bills, loading, pay } = useBilling();
  const { notify } = useNotification();

  const [activeBill, setActiveBill] = useState(null);
  const [method, setMethod] = useState('Card');
  const [paying, setPaying] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!activeBill) return;
    setPaying(true);
    try {
      await pay(activeBill._id || activeBill.id, method);
      notify.success('Invoice settled successfully!');
      setActiveBill(null);
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Payment processing failed');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-bold text-text-primary">Billing & Financial Invoices</h1>
        <p className="text-body-sm text-text-secondary">Settle consultation, laboratory, or pharmacy ledger charges.</p>
      </div>

      {loading ? <PageLoader /> : (
        <div className="flex flex-col gap-4 max-w-[800px]">
          {bills.length === 0 ? (
            <Card className="text-center text-text-secondary py-12">No billing statements exist.</Card>
          ) : (
            bills.map((b) => (
              <Card key={b._id || b.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                      Statement #{b._id || b.id}
                    </span>
                    <h4 className="text-body-md font-semibold text-text-primary">Issued on {formatDate(b.billingDate || b.createdAt)}</h4>
                  </div>
                  <Badge variant={getStatusVariant(b.status)}>{b.status}</Badge>
                </div>

                <div className="border-t border-divider pt-3 flex flex-col gap-1.5">
                  {b.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-body-sm text-text-secondary">
                      <span>{item.description}</span>
                      <span className="text-text-primary font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-divider pt-3 flex flex-col gap-1">
                  <div className="flex justify-between text-caption text-text-secondary">
                    <span>Subtotal</span>
                    <span>{formatCurrency(b.subTotal)}</span>
                  </div>
                  {b.discount > 0 && (
                    <div className="flex justify-between text-caption text-bias-left font-medium">
                      <span>Discount</span>
                      <span>-{formatCurrency(b.discount)}</span>
                    </div>
                  )}
                  {b.tax > 0 && (
                    <div className="flex justify-between text-caption text-text-secondary">
                      <span>Tax</span>
                      <span>+{formatCurrency(b.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-body-md font-bold text-text-primary pt-1.5 border-t border-dashed border-divider">
                    <span>Total Amount Due</span>
                    <span className="text-accent">{formatCurrency(b.grandTotal)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  {b.status === 'Unpaid' && (
                    <Button size="sm" variant="primary" className="flex-1" onClick={() => setActiveBill(b)}>
                      Settle Invoice Online
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className={b.status === 'Unpaid' ? '' : 'w-full'}
                    onClick={() => downloadBillPdf(b)}
                  >
                    <Download size={13} className="mr-1.5" />
                    Download PDF
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Payment Modal */}
      <Modal isOpen={!!activeBill} onClose={() => setActiveBill(null)} title="Checkout Simulator">
        <form onSubmit={handlePay} className="flex flex-col gap-4">
          <Select
            label="Payment Route"
            id="pay-method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            options={PAYMENT_METHODS}
          />
          <Input label="Card / Account Number" id="card-num" defaultValue="4111 2222 3333 4444" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry (MM/YY)" id="card-exp" defaultValue="12/29" required />
            <Input label="CVV Security Code" id="card-cvv" type="password" defaultValue="123" required />
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={paying}>
            {paying ? 'Processing…' : `Pay ${formatCurrency(activeBill?.grandTotal)}`}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
