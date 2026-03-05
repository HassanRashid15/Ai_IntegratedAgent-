// Test file to verify all components are properly typed
import { Button } from './button'
import { Card, CardHeader, CardTitle, CardContent } from './card'
import { Skeleton, Shimmer } from './skeleton'
import { Badge } from './badge-enhanced'
import { MagneticButton, ParallaxCard, RippleEffect } from './interactive-elements'
import { AnimatedGradientBackground, GlassPanel, FloatingOrb } from './animated-background'

// Test that all components can be imported and used
export default function TestComponents() {
  return (
    <div>
      <Button>Test Button</Button>
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton />
          <Shimmer width="100px" height="20px" />
          <Badge>Test Badge</Badge>
        </CardContent>
      </Card>
      <MagneticButton>Magnetic Button</MagneticButton>
      <ParallaxCard>Parallax Card</ParallaxCard>
      <RippleEffect>Ripple Button</RippleEffect>
      <AnimatedGradientBackground variant="subtle">
        <GlassPanel>Glass Panel</GlassPanel>
        <FloatingOrb size="md" color="blue" />
      </AnimatedGradientBackground>
    </div>
  )
}
