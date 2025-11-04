import { ShoppingApp } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowSquareOut } from '@phosphor-icons/react'

const shoppingApps: ShoppingApp[] = [
  {
    id: '1',
    name: 'Allegro',
    url: 'https://allegro.pl',
    icon: '🛒',
    description: 'Польская торговая площадка'
  },
  {
    id: '2',
    name: 'Amazon',
    url: 'https://amazon.com',
    icon: '📦',
    description: 'Международный магазин'
  },
  {
    id: '3',
    name: 'eBay',
    url: 'https://ebay.com',
    icon: '🏪',
    description: 'Аукционная площадка'
  },
  {
    id: '4',
    name: 'AliExpress',
    url: 'https://aliexpress.com',
    icon: '🛍️',
    description: 'Товары из Китая'
  },
  {
    id: '5',
    name: 'ASOS',
    url: 'https://asos.com',
    icon: '👔',
    description: 'Одежда и аксессуары'
  },
  {
    id: '6',
    name: 'Etsy',
    url: 'https://etsy.com',
    icon: '🎨',
    description: 'Ручная работа'
  }
]

export function AppsTab() {
  const handleAppClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Магазины для заказов</h2>
          <p className="text-muted-foreground">
            Популярные интернет-магазины для совершения покупок
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shoppingApps.map((app) => (
            <Card
              key={app.id}
              className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => handleAppClick(app.url)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{app.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{app.name}</h3>
                      <ArrowSquareOut size={16} className="text-muted-foreground shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground">{app.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            💡 Совет: После оформления заказа, передайте трек-номер нашему оператору для отслеживания посылки
          </p>
        </div>
      </div>
    </div>
  )
}
