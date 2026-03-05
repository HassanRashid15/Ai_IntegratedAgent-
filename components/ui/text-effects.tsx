import * as React from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface SplitBlurTextProps {
  children: React.ReactNode
  className?: string
  blurDelay?: number
}

const SplitBlurText = React.forwardRef<HTMLDivElement, SplitBlurTextProps>(
  ({ children, className, blurDelay = 100 }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const inViewRef = React.useRef(null)
    const isInView = useInView(inViewRef, { once: true, margin: "-100px" })
    
    React.useEffect(() => {
      if (isInView) {
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, blurDelay)
        
        return () => clearTimeout(timer)
      }
    }, [isInView, blurDelay])

    return (
      <div ref={inViewRef}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            filter: isVisible ? "blur(0px)" : "blur(20px)",
            y: isVisible ? 0 : 20
          }}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            filter: { duration: 0.8 }
          }}
          className={cn(className)}
        >
          {children}
        </motion.div>
      </div>
    )
  }
)
SplitBlurText.displayName = "SplitBlurText"

interface TypingEffectProps {
  texts: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  cursor?: boolean
  splitEffect?: boolean
  triggerOnView?: boolean
}

const TypingEffect = React.forwardRef<HTMLSpanElement, TypingEffectProps>(
  ({ 
    texts, 
    className, 
    typingSpeed = 100, 
    deletingSpeed = 50, 
    pauseDuration = 2000,
    cursor = true,
    splitEffect = true,
    triggerOnView = false
  }, ref) => {
    const [textIndex, setTextIndex] = React.useState(0)
    const [displayText, setDisplayText] = React.useState('')
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [isPaused, setIsPaused] = React.useState(false)
    const [typedLength, setTypedLength] = React.useState(0)
    const [shouldStartTyping, setShouldStartTyping] = React.useState(!triggerOnView)
    
    const inViewRef = React.useRef(null)
    const isInView = useInView(inViewRef, { once: true, margin: "-100px" })
    
    React.useEffect(() => {
      if (triggerOnView && isInView && !shouldStartTyping) {
        setShouldStartTyping(true)
      }
    }, [isInView, triggerOnView, shouldStartTyping])

    React.useEffect(() => {
      if (!shouldStartTyping) return
      
      const currentText = texts[textIndex]
      
      if (isPaused) {
        const pauseTimer = setTimeout(() => {
          setIsPaused(false)
          setIsDeleting(true)
        }, pauseDuration)
        return () => clearTimeout(pauseTimer)
      }

      const timer = setTimeout(() => {
        if (!isDeleting && displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
          setTypedLength(displayText.length + 1)
        } else if (!isDeleting && displayText.length === currentText.length) {
          setIsPaused(true)
          setTypedLength(displayText.length)
        } else if (isDeleting && displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
          setTypedLength(displayText.length - 1)
        } else if (isDeleting && displayText.length === 0) {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % texts.length)
          setTypedLength(0)
        }
      }, isDeleting ? deletingSpeed : typingSpeed)
      
      return () => clearTimeout(timer)
    }, [displayText, isDeleting, texts, textIndex, typingSpeed, deletingSpeed, pauseDuration, isPaused, shouldStartTyping])

    const renderTextWithMotion = () => {
      if (!splitEffect) {
        return <span>{displayText}</span>
      }

      return displayText.split('').map((char, index) => {
        const isNewChar = index === typedLength - 1
        const isBeingDeleted = isDeleting && index >= typedLength
        
        return (
          <AnimatePresence key={`${textIndex}-${index}`}>
            {!isBeingDeleted && (
              <motion.span
                initial={{ 
                  opacity: 0, 
                  y: -30, 
                  rotateX: 90,
                  scale: 0.5
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0, 
                  y: 30, 
                  rotateX: -90,
                  scale: 0.5
                }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.03,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
                className="inline-block"
                style={{
                  transformOrigin: "center",
                  perspective: "1000px"
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            )}
          </AnimatePresence>
        )
      })
    }

    return (
      <div ref={inViewRef}>
        <span ref={ref} className={cn("inline-block", className)}>
          {renderTextWithMotion()}
          {cursor && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="ml-1 text-primary"
            >
              |
            </motion.span>
          )}
        </span>
      </div>
    )
  }
)
TypingEffect.displayName = "TypingEffect"

interface GlitchTextProps {
  children: React.ReactNode
  className?: string
  intensity?: "low" | "medium" | "high"
  triggerOnView?: boolean
}

const GlitchText = React.forwardRef<HTMLDivElement, GlitchTextProps>(
  ({ children, className, intensity = "medium", triggerOnView = false }, ref) => {
    const [isGlitching, setIsGlitching] = React.useState(false)
    const [shouldStartGlitch, setShouldStartGlitch] = React.useState(!triggerOnView)
    
    const inViewRef = React.useRef(null)
    const isInView = useInView(inViewRef, { once: true, margin: "-100px" })
    
    React.useEffect(() => {
      if (triggerOnView && isInView && !shouldStartGlitch) {
        setShouldStartGlitch(true)
      }
    }, [isInView, triggerOnView, shouldStartGlitch])
    
    const glitchVariants = {
      low: { x: [-1, 1, -1, 0], y: [1, -1, 1, 0] },
      medium: { x: [-2, 2, -2, 0], y: [2, -2, 2, 0] },
      high: { x: [-4, 4, -4, 0], y: [4, -4, 4, 0] }
    }

    React.useEffect(() => {
      if (!shouldStartGlitch) return
      
      const interval = setInterval(() => {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      }, 3000)
      
      return () => clearInterval(interval)
    }, [shouldStartGlitch])

    return (
      <div ref={inViewRef}>
        <motion.div
          ref={ref}
          className={cn("relative inline-block", className)}
          animate={isGlitching ? glitchVariants[intensity] : {}}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <div className="relative z-10">{children}</div>
          {isGlitching && (
            <>
              <motion.div 
                className="absolute inset-0 text-red-500 opacity-70 z-0"
                animate={{ x: -2, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                {children}
              </motion.div>
              <motion.div 
                className="absolute inset-0 text-blue-500 opacity-70 z-0"
                animate={{ x: 2, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                {children}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    )
  }
)
GlitchText.displayName = "GlitchText"

interface MorphingTextProps {
  words: string[]
  className?: string
  duration?: number
  triggerOnView?: boolean
}

const MorphingText = React.forwardRef<HTMLSpanElement, MorphingTextProps>(
  ({ words, className, duration = 2000, triggerOnView = false }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [shouldStartMorphing, setShouldStartMorphing] = React.useState(!triggerOnView)
    
    const inViewRef = React.useRef(null)
    const isInView = useInView(inViewRef, { once: true, margin: "-100px" })
    
    React.useEffect(() => {
      if (triggerOnView && isInView && !shouldStartMorphing) {
        setShouldStartMorphing(true)
      }
    }, [isInView, triggerOnView, shouldStartMorphing])

    React.useEffect(() => {
      if (!shouldStartMorphing) return
      
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length)
      }, duration)

      return () => clearInterval(interval)
    }, [words.length, duration, shouldStartMorphing])

    return (
      <div ref={inViewRef}>
        <AnimatePresence mode="wait">
          <motion.span
            ref={ref}
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className={cn("inline-block", className)}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    )
  }
)
MorphingText.displayName = "MorphingText"

export { SplitBlurText, TypingEffect, GlitchText, MorphingText }
