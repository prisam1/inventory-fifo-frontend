import React, { useEffect } from 'react';
import useApi from '../../hooks/useApi';
import * as productsApi from '../../api/products';
import { ProductStockOverview as ProductStockOverviewType } from '../../types';
import Spinner from '../common/Spinner';

interface ProductStockOverviewProps {
}

const ProductStockOverview: React.FC<ProductStockOverviewProps> = () => {
    const { data, loading, error, callApi } = useApi<ProductStockOverviewType[]>(productsApi.getProductStockOverview);

    useEffect(() => {
        callApi();
    }, [callApi]);

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
    if (!data || data.length === 0) return <div className="text-gray-600">No product stock data available.</div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Stock Overview</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Current Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Inventory Cost
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg. Cost per Unit
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((product) => {
                        return (
                            <tr key={product.product_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.product_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.product_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {Number(product.current_quantity)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${Number(product.total_inventory_cost).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${Number(product.average_cost_per_unit).toFixed(2)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProductStockOverview;