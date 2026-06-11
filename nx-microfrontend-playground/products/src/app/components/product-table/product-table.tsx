import { Product } from '@org/shared-models';
import styles from './product-table.module.scss';

export interface ProductTableProps {
  products: Product[];
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className={styles['card']}>
      <table className={styles['table']}>
        <thead>
          <tr>
            <th scope="col" className={styles['colId']}>
              ID
            </th>
            <th scope="col">Name</th>
            <th scope="col" className={styles['colPrice']}>
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={styles['row']}>
              <td data-label="ID" className={styles['cellId']}>
                #{product.id}
              </td>
              <td data-label="Name" className={styles['cellName']}>
                {product.name}
              </td>
              <td data-label="Price" className={styles['cellPrice']}>
                {priceFormatter.format(product.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductTableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className={styles['card']} aria-busy="true" aria-label="Loading products">
      <table className={styles['table']}>
        <thead>
          <tr>
            <th scope="col" className={styles['colId']}>
              ID
            </th>
            <th scope="col">Name</th>
            <th scope="col" className={styles['colPrice']}>
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, index) => (
            <tr key={index} className={styles['row']}>
              <td className={styles['cellId']}>
                <span className={styles['skeleton']} style={{ width: '2rem' }} />
              </td>
              <td>
                <span className={styles['skeleton']} style={{ width: '40%' }} />
              </td>
              <td className={styles['cellPrice']}>
                <span className={styles['skeleton']} style={{ width: '4rem' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
