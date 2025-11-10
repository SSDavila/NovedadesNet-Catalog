import { motion } from 'framer-motion';
import { Product } from '@/interfaces/index';

interface ProductCardProps {
  product: Product;
  onCardClick: (product: Product) => void; 
}

export default function ProductCard({ product, onCardClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockColors = () => {
    const stock = product.productStock;
    if (stock > 5) {
      return { dot: 'bg-green-500', container: 'bg-green-100', text: 'text-green-800' };
    }
    if (stock >= 3) {
      return { dot: 'bg-yellow-500', container: 'bg-yellow-100', text: 'text-yellow-800' };
    }
    if (stock >= 1) {
      return { dot: 'bg-orange-500', container: 'bg-orange-100', text: 'text-orange-800' };
    }
    return { dot: 'bg-red-500', container: 'bg-red-100', text: 'text-red-800' };
  };
  
  const stockColors = getStockColors();

  return (
    <motion.div
      className="group relative flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={() => onCardClick(product)}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={product.images?.[0]?.productImageUrl || 'https://via.placeholder.com/300'}
          alt={product.productName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {product.productOfferPrice && parseFloat(product.productOfferPrice as any) > 0 && parseFloat(product.productOfferPrice as any) < parseFloat(product.productPrice as any) && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">OFERTA</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">
          {product.category?.categoryName}
        </p>
        <h3 className="mt-2 text-base font-semibold text-gray-800 flex-grow h-12">
          {product.productName}
        </h3>
        <div className="mt-3 flex justify-between items-end">
          <div className="flex items-baseline gap-2">
            {product.productOfferPrice && parseFloat(product.productOfferPrice as any) > 0 && parseFloat(product.productOfferPrice as any) < parseFloat(product.productPrice as any) ? (
              <>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(parseFloat(product.productOfferPrice as any))}
                </p>
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(parseFloat(product.productPrice as any))}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(parseFloat(product.productPrice as any))}
              </p>
            )}
          </div>
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${stockColors.container} ${stockColors.text}`}>
            <div className={`w-2 h-2 rounded-full mr-1.5 ${stockColors.dot}`}></div>
            <span>{product.productStock > 0 ? `${product.productStock} en stock` : 'Agotado'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}