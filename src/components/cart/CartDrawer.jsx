'use client'

import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { useI18n } from '@/lib/I18nContext'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart()
  const { t } = useI18n()

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-chinese-ivory z-50 shadow-chinese-lg
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-chinese-gold/20 bg-chinese-ink">
          <h2 className="text-chinese-gold font-serif text-lg">
            {t('checkout.title')} ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-chinese-gold transition-colors p-1"
            aria-label={t('mediaViewer.close')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-400 text-sm">{t('checkout.empty')}</p>
              <button
                onClick={onClose}
                className="mt-4 text-chinese-gold text-sm hover:underline"
              >
                {t('checkout.empty')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-3 border border-chinese-gold/10">
                {/* Image */}
                <div className="w-20 h-20 flex-shrink-0 bg-chinese-ivory-dark overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-chinese-ink font-medium truncate">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">${item.price.toFixed(2)}</p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-chinese-gold/30">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-gray-500 hover:bg-chinese-gold/10"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs text-chinese-ink">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-gray-500 hover:bg-chinese-gold/10"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-sm text-chinese-red font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-chinese-red transition-colors"
                      aria-label={t('checkout.remove')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-chinese-gold/20 px-6 py-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{t('checkout.total')}</span>
              <span className="text-xl text-chinese-red font-serif font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="chinese-btn-primary w-full text-center block text-sm"
            >
              {t('checkout.title')}
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
