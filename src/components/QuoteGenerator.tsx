'use client';

import { useState } from 'react';

interface QuoteItem {
    description: string;
    amount: number;
}

export default function QuoteGenerator({ leadId, onQuoteCreated }: { leadId: string, onQuoteCreated: () => void }) {
    const [items, setItems] = useState<QuoteItem[]>([{ description: '', amount: 0 }]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const addItem = () => {
        setItems([...items, { description: '', amount: 0 }]);
    };

    const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totalAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const handleCreateQuote = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    items: items.filter(i => i.description.trim() !== ''),
                    totalAmount
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setItems([{ description: '', amount: 0 }]);
                onQuoteCreated();
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error creating quote:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Create Quote</h4>

            <form onSubmit={handleCreateQuote} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Service / Item Description"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="flex-1 text-sm p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value))}
                            className="w-24 text-sm p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            min="0"
                            step="0.01"
                            required
                        />
                        {items.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-500 hover:text-red-700 px-2"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItem}
                    className="text-xs text-indigo-600 hover:text-indigo-800 mb-4 block"
                >
                    + Add Item
                </button>

                <div className="flex justify-between items-center border-t pt-4 dark:border-gray-700">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                        Total: ${totalAmount.toFixed(2)}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Generate Quote'}
                    </button>
                </div>

                {success && (
                    <p className="text-xs text-green-600 mt-2 text-center">Quote created successfully!</p>
                )}
            </form>
        </div>
    );
}
