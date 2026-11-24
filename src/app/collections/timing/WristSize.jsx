'use client'

import { useState } from 'react'

const sizes = [14, 15, 16, 17, 18, 19, 20]

export default function WristSize({ english }) {
  const [size, setSize] = useState('')

  return (
    <div className="space-y-2">
      <label className="block text-sm">
        {english ? 'Wrist size · customizable' : '手围 · 可定制'}
        <select value={size} onChange={(event) => setSize(event.target.value)}
          className="mt-1 block w-full rounded border border-stone-300 bg-white px-3 py-2">
          <option value="">{english ? 'Choose a wrist size' : '选择手围'}</option>
          {sizes.map((value) => <option key={value} value={value}>{value} cm</option>)}
          <option value="custom">{english ? 'Other size' : '其他手围'}</option>
        </select>
      </label>
      {size === 'custom' && (
        <label className="block text-sm">
          {english ? 'Wrist circumference (cm)' : '实际手围（cm）'}
          <input type="number" min="1" step="0.1" inputMode="decimal"
            className="mt-1 block w-full rounded border border-stone-300 bg-white px-3 py-2" />
        </label>
      )}
    </div>
  )
}
