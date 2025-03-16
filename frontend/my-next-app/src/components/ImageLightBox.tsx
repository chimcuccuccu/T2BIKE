"use client"

import { useState, useEffect } from "react"
import { X, ZoomIn, ZoomOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt: string
}

export default function ImageLightbox({ isOpen, onClose, src, alt }: ImageLightboxProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleEsc)
    } else {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3))
  }

  const zoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1)
      if (newScale === 1) setPosition({ x: 0, y: 0 })
      return newScale
    })
  }

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={resetZoom}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <motion.button
                className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={zoomIn}
              >
                <ZoomIn className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={zoomOut}
              >
                <ZoomOut className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.div
              className="relative w-[90vw] h-[80vh] cursor-grab active:cursor-grabbing"
              drag={scale > 1}
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              style={{
                scale,
                x: position.x,
                y: position.y,
              }}
              onDoubleClick={resetZoom}
            >
              <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-contain" draggable="false" />
            </motion.div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {scale === 1 ? "Nhấn đúp để phóng to" : `Zoom: ${scale}x`}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

