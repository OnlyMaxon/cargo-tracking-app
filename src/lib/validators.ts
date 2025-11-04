export function validateFIN(finCode: string): boolean {
  const finRegex = /^[A-Z0-9]{7}$/i
  return finRegex.test(finCode)
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2
}

export function formatFIN(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'in-transit': 'В пути',
    'warehouse': 'На складе',
    'delivered': 'Доставлен'
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'in-transit': 'bg-[oklch(0.65_0.15_45)] text-[oklch(0.20_0.02_250)]',
    'warehouse': 'bg-[oklch(0.60_0.12_250)] text-white',
    'delivered': 'bg-[oklch(0.65_0.15_145)] text-[oklch(0.20_0.02_250)]'
  }
  return colors[status] || 'bg-muted text-muted-foreground'
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
