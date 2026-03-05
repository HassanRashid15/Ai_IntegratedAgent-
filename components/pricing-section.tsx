import * as React from "react"
import { motion } from "framer-motion"
import { Check, Star, Zap, Shield, Crown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge-enhanced"

interface ProUpgradeCardProps {
  onSubscribe: () => void
  isLoading?: boolean
}

export function ProUpgradeCard({ onSubscribe, isLoading = false }: ProUpgradeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className="relative"
    >
      <Card className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-5"></div>
        
        {/* Popular Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <Star className="w-3 h-3 mr-1" />
            MOST POPULAR
          </Badge>
        </div>
        
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Crown className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Go Pro
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Unlock unlimited AI-powered reports
          </CardDescription>
          <div className="mt-6">
            <span className="text-4xl font-bold">$29</span>
            <span className="text-muted-foreground ml-1">/month</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground mb-4">
            Upgrade from 5 credits/day to 500 credits/month
          </div>
          
          <ul className="space-y-3">
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm">500 credits per month</span>
            </motion.li>
            
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm">Unlimited AI reports</span>
            </motion.li>
            
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm">Priority email support</span>
            </motion.li>
            
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm">Advanced AI features</span>
            </motion.li>
            
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm">Cancel anytime</span>
            </motion.li>
          </ul>
        </CardContent>
        
        <CardFooter className="pt-6">
          <Button
            onClick={onSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
            size="lg"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
