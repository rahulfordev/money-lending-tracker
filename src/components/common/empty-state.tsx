import { Button } from '@/components/ui/Button'
import { CheckSquare, Clock, BarChart3, Users } from 'lucide-react'

interface EmptyStateProps {
  icon?: 'CheckSquare' | 'Clock' | 'BarChart3' | 'Users'
  title: string
  description: string
  actionText?: string
  onAction?: () => void
}

const icons = {
  CheckSquare,
  Clock,
  BarChart3,
  Users,
}

export function EmptyState({ 
  icon = 'CheckSquare', 
  title, 
  description, 
  actionText, 
  onAction 
}: EmptyStateProps) {
  const IconComponent = icons[icon]

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <IconComponent className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  )
}