import { useState, useEffect, useCallback } from 'react'

interface UseTypingEffectOptions {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  loop?: boolean
}

export function useTypingEffect({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  loop = true
}: UseTypingEffectOptions) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const resetTyping = useCallback(() => {
    setDisplayText('')
    setTextIndex(0)
    setIsDeleting(false)
    setIsPaused(false)
  }, [])

  useEffect(() => {
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
        // Typing
        setDisplayText(currentText.slice(0, displayText.length + 1))
      } else if (!isDeleting && displayText.length === currentText.length) {
        // Finished typing, pause
        setIsPaused(true)
      } else if (isDeleting && displayText.length > 0) {
        // Deleting
        setDisplayText(displayText.slice(0, -1))
      } else if (isDeleting && displayText.length === 0) {
        // Finished deleting, move to next text
        if (loop) {
          setTextIndex((prev) => (prev + 1) % texts.length)
        } else if (textIndex < texts.length - 1) {
          setTextIndex((prev) => prev + 1)
        }
        setIsDeleting(false)
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timer)
  }, [
    displayText,
    isDeleting,
    textIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    loop,
    isPaused
  ])

  return {
    displayText,
    currentTextIndex: textIndex,
    isTyping: !isDeleting && displayText.length < texts[textIndex]?.length,
    isDeleting,
    isPaused,
    resetTyping
  }
}

// Hook for animated placeholder text
export function useAnimatedPlaceholder(placeholders: string[]) {
  const { displayText, isTyping } = useTypingEffect({
    texts: placeholders,
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseDuration: 1500,
    loop: true
  })

  return {
    placeholder: displayText + (isTyping ? '|' : ''),
    isAnimating: isTyping
  }
}
