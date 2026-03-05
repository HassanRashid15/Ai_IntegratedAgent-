'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'
import { Suggestion, Suggestions, getContextualSuggestions } from './suggestions'
import { useAnimatedPlaceholder } from '../hooks/use-typing-effect'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I can help you with immigration guidance, property analysis, and any questions about our tools. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Animated placeholder
  const placeholderTexts = [
    "Ask about immigration guidance...",
    "How does property analysis work?",
    "What are the pricing plans?",
    "Need help with our tools?",
    "Tell me about your requirements..."
  ]
  
  const { placeholder, isAnimating } = useAnimatedPlaceholder(placeholderTexts)

  // Get contextual suggestions based on conversation
  const getCurrentSuggestions = () => {
    const lastUserMessage = messages.filter(m => m.sender === 'user').pop()
    const lastBotMessage = messages.filter(m => m.sender === 'bot').pop()
    return getContextualSuggestions(lastUserMessage?.text, lastBotMessage?.text)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Immigration related queries
    if (lowerMessage.includes('immigration') || lowerMessage.includes('visa') || lowerMessage.includes('travel')) {
      return "I can help with immigration guidance! Our Immigration Assistant tool provides comprehensive analysis including route recommendations, document requirements, warnings, and even generates cover letters. Would you like me to guide you to the immigration tool or explain specific aspects of the immigration process?"
    }
    
    // Property related queries
    if (lowerMessage.includes('property') || lowerMessage.includes('real estate') || lowerMessage.includes('mortgage') || lowerMessage.includes('investment')) {
      return "For property analysis, our Property Deal Analyzer is perfect! It calculates mortgage payments, rental yields, monthly costs, and provides AI-powered investment insights. The tool helps you make informed property investment decisions. Would you like to explore the property analyzer or learn about specific calculations?"
    }
    
    // Pricing and features
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('free') || lowerMessage.includes('upgrade')) {
      return "We offer both free and premium features! The free version includes basic analysis, while the Pro version provides unlimited reports, advanced AI insights, and priority support. You can start with our demo mode to explore all features. Would you like to know more about specific features or pricing tiers?"
    }
    
    // Account and demo
    if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('demo')) {
      return "You can use our tools in demo mode without creating an account, or sign up for a free account to save your reports and history. The demo mode gives you full access to test all features. Would you like me to help you get started with demo mode or guide you through account setup?"
    }
    
    // Technical support
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      return "I'm here to help! I can assist with using our immigration and property tools, explain features, troubleshoot issues, or guide you through the analysis process. What specific challenge are you facing, or which tool would you like to explore?"
    }
    
    // Default response
    return "I'm here to help with our AI-powered tools! I can assist with:\n\n🏛️ **Immigration Guidance** - Route analysis, document requirements, warnings\n🏢 **Property Analysis** - Investment calculations, mortgage analysis, rental yields\n💼 **Account & Features** - Demo mode, upgrades, report management\n🔧 **Technical Support** - Tool usage, troubleshooting\n\nWhat would you like to explore?"
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText
    if (!textToSend.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    if (!messageText) {
      setInputText('')
    }
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(textToSend),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handleSendMessage()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              Chat with AI Assistant
            </div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-white/80">Always here to help</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
            
            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="bg-muted text-foreground p-3 rounded-2xl">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        {/* Suggestions */}
        <div className="mb-3">
          <Suggestions>
            {getCurrentSuggestions().map((suggestion) => (
              <Suggestion
                key={suggestion}
                suggestion={suggestion}
                onClick={handleSuggestionClick}
                variant="outline"
                size="sm"
              />
            ))}
          </Suggestions>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={inputText ? '' : placeholder}
            className={`flex-1 px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-200 ${
              isAnimating && !inputText ? 'text-muted-foreground/60' : ''
            }`}
          />
          <button
            onClick={handleSendButtonClick}
            disabled={!inputText.trim() || isTyping}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
