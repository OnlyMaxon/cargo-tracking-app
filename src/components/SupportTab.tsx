import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, EnvelopeSimple, MapPin, ChatCircle } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export function SupportTab() {
  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChatCircle size={24} weight="bold" />
            Служба поддержки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone size={24} className="text-primary mt-0.5" weight="bold" />
              <div className="flex-1">
                <p className="font-semibold">Телефон</p>
                <a href="tel:+994123456789" className="text-primary hover:underline">
                  +994 (12) 345-67-89
                </a>
                <p className="text-sm text-muted-foreground mt-1">
                  Пн-Пт: 9:00 - 18:00
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <EnvelopeSimple size={24} className="text-primary mt-0.5" weight="bold" />
              <div className="flex-1">
                <p className="font-semibold">Email</p>
                <a href="mailto:support@cargo.az" className="text-primary hover:underline">
                  support@cargo.az
                </a>
                <p className="text-sm text-muted-foreground mt-1">
                  Ответ в течение 24 часов
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <MapPin size={24} className="text-primary mt-0.5" weight="bold" />
              <div className="flex-1">
                <p className="font-semibold">Адрес офиса</p>
                <p className="text-muted-foreground">
                  г. Баку, ул. Нефтяников 123<br />
                  AZ1000, Азербайджан
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Часто задаваемые вопросы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">Как отследить посылку?</h4>
            <p className="text-sm text-muted-foreground">
              Все ваши посылки отображаются на вкладке "Список". Нажмите на посылку для просмотра подробной информации и истории статусов.
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-1">Сколько времени занимает доставка?</h4>
            <p className="text-sm text-muted-foreground">
              Обычно доставка занимает от 7 до 14 дней в зависимости от страны отправления и типа доставки.
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-1">Что делать если посылка задерживается?</h4>
            <p className="text-sm text-muted-foreground">
              Свяжитесь с нашей службой поддержки по телефону или email. Мы поможем отследить посылку и решить проблему.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" size="lg">
        <ChatCircle size={20} weight="bold" className="mr-2" />
        Написать в поддержку
      </Button>
    </div>
  )
}
