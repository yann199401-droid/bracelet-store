'use client'

export default function StarRating({ rating, size = 'sm', interactive = false, onChange }) {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => handleClick(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform ${
            star <= rating ? 'text-chinese-gold' : 'text-gray-300'
          }`}
        >
          {star <= rating ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}
