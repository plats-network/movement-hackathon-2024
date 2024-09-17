'use client'

import { useEffect, RefObject } from 'react'

const useClickOutside: (
  ref: RefObject<HTMLElement>,
  onClose: () => void
) => void = (ref, onClose) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClose])
}

export default useClickOutside
