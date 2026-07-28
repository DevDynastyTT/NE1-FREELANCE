'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  className?: string
  unoptimized?: boolean
  /** Extra classes applied to the fallback container. Defaults match a fill-mode parent. */
  fallbackClassName?: string
}

export default function ThumbnailImage({
  src,
  alt,
  fill,
  sizes,
  className,
  unoptimized,
  fallbackClassName,
}: Props) {
  const [failed, setFailed] = useState(!src)

  const fallback = (
    <div className={cn('flex items-center justify-center bg-gray-100', fill ? 'absolute inset-0' : 'w-full h-full', fallbackClassName)}>
      <ImageIcon className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
    </div>
  )

  if (failed) return fallback

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        unoptimized={unoptimized}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
