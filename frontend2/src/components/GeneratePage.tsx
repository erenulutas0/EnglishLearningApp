import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Sparkles, Wand2, CheckCircle2, PlusCircle, GraduationCap } from "lucide-react";
import { apiService } from "../services/api";
import { toast } from "sonner@2.0.3";

type GenerationType = "sentence" | "paragraph";
type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export function GeneratePage() {
  const [word, setWord] = useState("");
  const [generationType, setGenerationType] = useState<GenerationType>("sentence");
  const [contextEnabled, setContextEnabled] = useState(false);
  const [context, setContext] = useState("");
  const [levelEnabled, setLevelEnabled] = useState(false);
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel>("B1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [showAddOptions, setShowAddOptions] = useState(false);

  const generateContent = async () => {
    if (!word.trim()) {
      toast.error("Lütfen bir kelime girin!");
      return;
    }

    setIsGenerating(true);
    setShowAddOptions(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const levelInfo = levelEnabled ? ` (${languageLevel} seviyesi)` : "";

    // Mock generated content
    if (generationType === "sentence") {
      const mockSentences = [
        `The ${word} was absolutely magnificent in the morning light.`,
        `She couldn't believe how ${word} the experience had been.`,
        `Learning about ${word} changed his perspective completely.`,
      ];
      
      if (contextEnabled && context) {
        setGeneratedContent([
          `In the context of ${context}, the ${word} played a crucial role.${levelInfo}`,
          `Understanding ${word} within ${context} requires careful study.${levelInfo}`,
          `The ${word} demonstrated its importance in ${context}.${levelInfo}`,
        ]);
      } else {
        setGeneratedContent(mockSentences.map(s => s + levelInfo));
      }
    } else {
      const mockParagraph = contextEnabled && context
        ? `In the fascinating world of ${context}, the concept of ${word} holds significant importance. Throughout history, ${word} has been studied extensively by scholars and practitioners alike. The ${word} demonstrates unique characteristics that make it stand out in ${context}. Understanding ${word} requires dedication and careful observation. Many experts believe that ${word} will continue to play a vital role in shaping our understanding of ${context}. The intricate relationship between ${word} and ${context} reveals deeper insights into both concepts.${levelInfo}`
        : `The ${word} represents a fascinating subject worthy of exploration. Throughout various contexts, ${word} has demonstrated its versatility and importance. Many people find ${word} to be both challenging and rewarding to understand. The concept of ${word} extends beyond simple definitions, encompassing a wide range of applications and interpretations. As we delve deeper into ${word}, we discover its multifaceted nature. Experts continue to study ${word} from different perspectives, each revealing new insights.${levelInfo}`;
      
      setGeneratedContent([mockParagraph]);
    }

    setIsGenerating(false);
    setShowAddOptions(true);
  };

  const handleAddWord = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await apiService.createWord({
        english: word,
        turkish: "Türkçe çeviri eklenmeli", // This should be provided by user
        addedDate: today
      });
      toast.success(`"${word}" kelimesi eklendi!`, {
        description: "Cümle eklemek ister misiniz?",
      });
    } catch (error) {
      console.error('Error adding word:', error);
      toast.error("Kelime eklenirken hata oluştu!");
    }
  };

  const handleAddSentence = async (sentence: string) => {
    try {
      // First get all words to find the word ID
      const words = await apiService.getAllWords();
      const wordData = words.find(w => w.english === word);
      
      if (wordData) {
        await apiService.addSentenceToWord(wordData.id, {
          english: sentence,
          turkish: "Türkçe çeviri eklenmeli" // This should be provided by user
        });
        toast.success("Cümle başarıyla eklendi!", {
          description: sentence.length > 50 ? sentence.substring(0, 50) + "..." : sentence,
        });
      } else {
        toast.error("Kelime bulunamadı!");
      }
    } catch (error) {
      console.error('Error adding sentence:', error);
      toast.error("Cümle eklenirken hata oluştu!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wand2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-indigo-900 dark:text-indigo-100">Cümle Üret</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Kelimeleriniz için yapay zeka destekli cümle ve paragraflar oluşturun
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-100 dark:border-gray-700 shadow-lg h-fit">
              <h2 className="text-indigo-900 dark:text-indigo-100 mb-4">Ayarlar</h2>

              {/* Word Input */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="word" className="text-gray-700 dark:text-gray-300">
                    İngilizce Kelime
                  </Label>
                  <Input
                    id="word"
                    type="text"
                    placeholder="örn: serendipity"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    className="mt-2 bg-white dark:bg-gray-700 border-indigo-200 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                {/* Generation Type */}
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-3 block">
                    Üretim Tipi
                  </Label>
                  <RadioGroup
                    value={generationType}
                    onValueChange={(value) => setGenerationType(value as GenerationType)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sentence" id="sentence" />
                      <Label htmlFor="sentence" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                        Sadece Cümle Üret
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paragraph" id="paragraph" />
                      <Label htmlFor="paragraph" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                        Paragraf/Okuma Metni Oluştur
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Context Toggle */}
                <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">
                      {generationType === "sentence" ? "Bağlam (Context)" : "Paragraf Bağlamı"}
                    </Label>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Özel bir bağlam belirtin
                    </p>
                  </div>
                  <Switch
                    checked={contextEnabled}
                    onCheckedChange={setContextEnabled}
                  />
                </div>

                {/* Context Input */}
                {contextEnabled && (
                  <div>
                    <Label htmlFor="context" className="text-gray-700 dark:text-gray-300">
                      Bağlam Açıklaması
                    </Label>
                    <Textarea
                      id="context"
                      placeholder={
                        generationType === "sentence"
                          ? "örn: teknoloji, sanat, günlük hayat..."
                          : "örn: Bir teknoloji blogu için yazılacak bir makale..."
                      }
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="mt-2 bg-white dark:bg-gray-700 border-indigo-200 dark:border-gray-600 dark:text-gray-100 min-h-[100px]"
                    />
                  </div>
                )}

                {/* Language Level Toggle */}
                <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">
                      Dil Seviyesi
                    </Label>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Üretilen içerik için dil seviyesi belirtin
                    </p>
                  </div>
                  <Switch
                    checked={levelEnabled}
                    onCheckedChange={setLevelEnabled}
                  />
                </div>

                {/* Language Level Select */}
                {levelEnabled && (
                  <div>
                    <Label htmlFor="level" className="text-gray-700 dark:text-gray-300 block mb-2">
                      Dil Seviyesi Seçimi
                    </Label>
                    <Select
                      value={languageLevel}
                      onValueChange={(value) => setLanguageLevel(value as LanguageLevel)}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-indigo-200 dark:border-gray-600 dark:text-gray-100">
                        <SelectValue placeholder="Seviye seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Başlangıç</SelectItem>
                        <SelectItem value="A2">A2 - Temel</SelectItem>
                        <SelectItem value="B1">B1 - Orta Seviye</SelectItem>
                        <SelectItem value="B2">B2 - Orta Üstü</SelectItem>
                        <SelectItem value="C1">C1 - İleri Seviye</SelectItem>
                        <SelectItem value="C2">C2 - Uzman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={generateContent}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Üretiliyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {generationType === "sentence" ? "Cümle Üret" : "Paragraf Üret"}
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Output Section */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-100 dark:border-gray-700 shadow-lg">
              <h2 className="text-indigo-900 dark:text-indigo-100 mb-4">
                Üretilen {generationType === "sentence" ? "Cümleler" : "Paragraf"}
              </h2>

              {generatedContent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
                  <Wand2 className="w-16 h-16 mb-4 opacity-50" />
                  <p>Henüz içerik üretilmedi</p>
                  <p>Bir kelime girin ve üret butonuna tıklayın</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedContent.map((content, index) => (
                    <div key={index} className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-indigo-100 dark:border-gray-600">
                        <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                          {content}
                        </p>
                      </div>
                      {showAddOptions && generationType === "sentence" && (
                        <Button
                          onClick={() => handleAddSentence(content)}
                          variant="outline"
                          size="sm"
                          className="w-full border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-700"
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Bu Cümleyi Ekle
                        </Button>
                      )}
                    </div>
                  ))}

                  {showAddOptions && (
                    <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-start gap-3 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-gray-100 mb-1">
                            İçerik başarıyla oluşturuldu!
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            Bu kelimeyi veritabanınıza eklemek ister misiniz?
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleAddWord}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        "{word}" Kelimesini Ekle
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Info Card */}
          <Card className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 border-0 shadow-xl">
            <div className="flex items-start gap-4 text-white">
              <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="mb-2">Yapay Zeka Destekli İçerik Üretimi</h3>
                <p className="text-indigo-100">
                  Bu özellik, girdiğiniz kelimeler için otomatik olarak doğal ve akıcı cümleler veya 
                  paragraflar oluşturur. Üretilen içerikleri kelime bankanıza ekleyerek öğrenme 
                  deneyiminizi zenginleştirebilirsiniz.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}