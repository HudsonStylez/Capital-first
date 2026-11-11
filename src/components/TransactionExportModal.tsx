import React, { useState } from 'react';
import { Transaction } from '../store/useBankingStore';
import { CapitalOneLogo } from './CapitalOneLogo';
import {
  FileText,
  Download,
  Printer,
  X,
  CheckCircle2,
  Table,
  Calendar,
  DollarSign,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface TransactionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  userName: string;
  accountNumber?: string;
  checkingBalance?: number;
  showToast?: (message: string) => void;
}

export const TransactionExportModal: React.FC<TransactionExportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  userName,
  accountNumber = '2304918201',
  checkingBalance = 0,
  showToast,
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<'all' | '30days' | '90days' | 'year'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen) return null;

  // Filter transactions based on date range
  const filteredTxs = transactions.filter((tx) => {
    if (dateRange === 'all') return true;
    const txDate = new Date(tx.date);
    const now = new Date();
    const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
    if (dateRange === '30days') return diffDays <= 30;
    if (dateRange === '90days') return diffDays <= 90;
    if (dateRange === 'year') return diffDays <= 365;
    return true;
  });

  const totalInflows = filteredTxs
    .filter((t) => t.type === 'Deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflows = filteredTxs
    .filter((t) => t.type !== 'Deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Generate and Download CSV File
  const handleExportCsv = () => {
    setIsExporting(true);

    const headers = [
      'Transaction ID',
      'Reference Number',
      'Date',
      'Description / Merchant',
      'Category',
      'Type',
      'Status',
      'Amount (USD)',
      'Destination Details',
      'Account Number',
      'Routing Number',
    ];

    const rows = filteredTxs.map((t) => [
      t.id,
      t.referenceNumber,
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.status,
      t.type === 'Deposit' ? `+${t.amount.toFixed(2)}` : `-${t.amount.toFixed(2)}`,
      `"${(t.destinationDetails || '').replace(/"/g, '""')}"`,
      t.accountNumber || accountNumber,
      t.routingNumber || '051405515',
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CapitalOne_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    showToast?.('Transaction statement exported to CSV successfully.');
    onClose();
  };

  // Trigger Print to PDF
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#005C9D] flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Export Transaction History</h3>
              <p className="text-xs text-slate-500">
                Download your official banking statements for accounting or tax purposes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Export File Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  exportFormat === 'csv'
                    ? 'border-[#005C9D] bg-sky-50/60 ring-2 ring-[#005C9D]/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Table className="w-4 h-4 text-[#005C9D]" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Universal
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 block">CSV Spreadsheet (.csv)</span>
                <span className="text-[11px] text-slate-500">
                  Ideal for Excel, Google Sheets, QuickBooks, or personal finance apps.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  exportFormat === 'pdf'
                    ? 'border-[#005C9D] bg-sky-50/60 ring-2 ring-[#005C9D]/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                    Official
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 block">PDF Statement (.pdf)</span>
                <span className="text-[11px] text-slate-500">
                  Formal bank statement with letterhead, summary ledger, and printable layout.
                </span>
              </button>
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Statement Period</span>
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005C9D] focus:outline-none cursor-pointer bg-white"
            >
              <option value="all">Complete History (All {transactions.length} Transactions)</option>
              <option value="30days">Last 30 Days Activity</option>
              <option value="90days">Last 90 Days (Quarterly Statement)</option>
              <option value="year">Past 12 Months (Annual Statement)</option>
            </select>
          </div>

          {/* Summary Metric Preview Box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Statement Summary Preview ({filteredTxs.length} items)
            </span>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Deposits</span>
                <span className="text-xs font-bold text-emerald-600 font-mono mt-0.5 block">
                  +${totalInflows.toFixed(2)}
                </span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Debits</span>
                <span className="text-xs font-bold text-red-600 font-mono mt-0.5 block">
                  -${totalOutflows.toFixed(2)}
                </span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Ending Balance</span>
                <span className="text-xs font-bold text-slate-900 font-mono mt-0.5 block">
                  ${checkingBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* PDF Preview Accordion (If PDF mode selected) */}
          {exportFormat === 'pdf' && (
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#005C9D]" />
                  <span className="text-xs font-bold text-slate-800">Printable Statement Format Ready</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                  className="text-xs font-bold text-[#005C9D] hover:underline cursor-pointer"
                >
                  {isPreviewOpen ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>

              {isPreviewOpen && (
                <div className="bg-white p-4 rounded-xl border border-slate-300 text-[11px] font-mono space-y-2 shadow-inner max-h-44 overflow-y-auto">
                  <div className="border-b pb-2 flex justify-between items-center">
                    <span className="font-bold text-slate-900">CAPITAL ONE, N.A.</span>
                    <span className="text-slate-500">Official e-Statement</span>
                  </div>
                  <div>Account Holder: {userName}</div>
                  <div>Account: ...{accountNumber.slice(-4)} | Routing: 051405515</div>
                  <div>Period: All Recorded Transactions ({filteredTxs.length} items)</div>
                  <div className="border-t pt-2 space-y-1">
                    {filteredTxs.slice(0, 5).map((t) => (
                      <div key={t.id} className="flex justify-between text-[10px]">
                        <span>{t.date} · {t.merchant.slice(0, 18)}</span>
                        <span className={t.type === 'Deposit' ? 'text-emerald-600 font-bold' : 'text-slate-900'}>
                          {t.type === 'Deposit' ? `+$${t.amount.toFixed(2)}` : `-$${t.amount.toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                    {filteredTxs.length > 5 && (
                      <div className="text-[10px] text-slate-400 italic text-center pt-1">
                        + {filteredTxs.length - 5} more transactions included in export
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            {exportFormat === 'csv' ? (
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isExporting}
                className="px-5 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV File</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrintPdf}
                className="px-5 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF Statement</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
