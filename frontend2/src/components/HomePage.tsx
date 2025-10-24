import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar, BookOpen, Target, TrendingUp, Wand2, Sparkles, FileText } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: "words" | "sentences" | "generate") => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Calendar,
      title: "Tarihsel Takip",
      description: "Her gün öğrendiğiniz kelimeleri takvimde görün ve geçmişinizi inceleyin.",
      action: () => onNavigate("words")
    },
    {
      icon: BookOpen,
      title: "Kelime Bankası",
      description: "Öğrendiğiniz tüm kelimeleri ve Türkçe karşılıklarını bir arada görün.",
      action: () => onNavigate("words")
    },
    {
      icon: Wand2,
      title: "Yapay Zeka Cümle Üretici",
      description: "Kelimeleriniz için AI destekli cümle ve paragraflar oluşturun.",
      action: () => onNavigate("generate")
    },
    {
      icon: FileText,
      title: "Örnek Cümleler",
      description: "Her kelime için gerçek kullanım örnekleriyle anlam ve bağlamı kavrayın.",
      action: () => onNavigate("sentences")
    }
  ];

  const stats = [
    { label: "Toplam Kelime", value: "250+", color: "from-blue-500 to-indigo-500" },
    { label: "Örnek Cümle", value: "500+", color: "from-indigo-500 to-purple-500" },
    { label: "Öğrenme Günü", value: "30+", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Akıllı Kelime Öğrenme Platformu</span>
          </div>
          
          <h1 className="text-indigo-900 dark:text-indigo-100 mb-6">
            Kelimeleri Öğren, <br />
            Pratik Yap, Başarılı Ol
          </h1>
          
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            VocabMaster ile kelime dağarcığınızı sistematik bir şekilde geliştirin. 
            Her gün öğrendiğiniz kelimeleri takvimde takip edin, örnek cümlelerle pekiştirin 
            ve İngilizce'nizi bir üst seviyeye taşıyın.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate("words")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Kelimelerime Başla
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("generate")}
              className="border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-800 dark:text-gray-200"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Cümle Üret
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("sentences")}
              className="border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-800 dark:text-gray-200"
            >
              <Target className="w-5 h-5 mr-2" />
              Cümleleri İncele
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-100 dark:border-gray-700 shadow-lg">
              <div className={`inline-block bg-gradient-to-r ${stat.color} text-white px-4 py-2 rounded-lg mb-2`}>
                <span className="text-gray-900 dark:text-white">{stat.value}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-center text-indigo-900 dark:text-indigo-100 mb-12">
            Neden VocabMaster?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
                  onClick={feature.action}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-indigo-900 dark:text-indigo-100 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-indigo-900 dark:text-indigo-100 mb-12">
            Nasıl Çalışır?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Tarih Seç",
                description: "Takvimden bir tarih seçerek o gün öğrendiğiniz kelimeleri görüntüleyin."
              },
              {
                step: "2",
                title: "Kelimeyi İncele",
                description: "Kelimeye tıklayarak Türkçe anlamını ve örnek cümleleri görün."
              },
              {
                step: "3",
                title: "AI ile Üret",
                description: "Yapay zeka ile kelimeleriniz için özel cümleler ve paragraflar oluşturun."
              },
              {
                step: "4",
                title: "Pratik Yap",
                description: "Cümleler sayfasında tüm kelimelerinizi gözden geçirin ve pekiştirin."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white">{item.step}</span>
                </div>
                <h3 className="text-indigo-900 dark:text-indigo-100 mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="p-8 md:p-12 bg-gradient-to-r from-indigo-600 to-purple-600 border-0 shadow-2xl text-center">
            <h2 className="text-white mb-4">
              Kelime Öğrenmeye Hemen Başla
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Bugün ilk adımı at ve kelime dağarcığını geliştirmeye başla. 
              Sistematik öğrenme ile hedeflerine daha hızlı ulaş.
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate("words")}
              className="bg-white text-indigo-900 hover:bg-gray-100 shadow-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Hemen Başla
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}