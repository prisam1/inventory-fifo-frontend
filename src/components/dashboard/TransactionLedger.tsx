import React, { useEffect } from 'react';
import useApi from '../../hooks/useApi';
import * as inventoryApi from '../../api/inventory';
import { InventoryTransaction } from '../../types';
import Spinner from '../common/Spinner';

interface TransactionLedgerProps {
}

const TransactionLedger: React.FC<TransactionLedgerProps> = () => {
    const { data, loading, error, callApi } = useApi<InventoryTransaction[]>(inventoryApi.getInventoryTransactions);

    useEffect(() => {
        callApi();
    }, [callApi]);

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
    if (!data || data.length === 0) return <div className="text-gray-600">No transactions recorded.</div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Transaction Ledger</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cost/Price ($)
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((transaction, index) => {

                        return (
                            <tr key={index}>  
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {new Date(transaction.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transaction.product_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transaction.product_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                    {transaction.event_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transaction.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${transaction.cost_or_price.toFixed(2)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionLedger;