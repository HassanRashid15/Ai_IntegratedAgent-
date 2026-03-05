import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ProUpgradeCard } from "@/components/pricing-section"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubscribe: () => void
  isLoading?: boolean
}

export function PricingModal({ isOpen, onClose, onSubscribe, isLoading = false }: PricingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Upgrade to Pro</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <ProUpgradeCard onSubscribe={onSubscribe} isLoading={isLoading} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
