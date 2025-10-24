# Frontend2 - English Learning App

Bu proje, İngilizce kelime öğrenme uygulamasının frontend kısmıdır. Veritabanından veri çekerek çalışır.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Backend'in çalıştığından emin olun (port 8082)

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Özellikler

- **Kelime Listesi**: Tarihe göre kelimeleri görüntüleme
- **Cümle Örnekleri**: Kelimelerin örnek cümlelerini görme
- **Cümle Üretimi**: Yapay zeka destekli cümle üretimi
- **Takvim Görünümü**: Kelime öğrenilen günleri işaretleme

## API Entegrasyonu

Uygulama backend API'si ile entegre edilmiştir:
- Kelime ekleme/düzenleme/silme
- Cümle ekleme/düzenleme/silme
- Tarihe göre kelime getirme
- Kelime inceleme sistemi

## Teknolojiler

- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Vite
- Lucide React Icons