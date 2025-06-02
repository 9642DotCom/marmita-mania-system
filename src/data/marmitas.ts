
import { MarmitaItem } from '@/hooks/useCart';

export const marmitas: MarmitaItem[] = [
  {
    id: 1,
    name: "Marmita Executiva",
    description: "Arroz, feijão, bife acebolado, batata frita e salada completa. Uma refeição equilibrada e saborosa.",
    price: 18.50,
    image: "photo-1618160702438-9b02ab6515c9",
    category: "Executiva",
    ingredients: ["Arroz", "Feijão", "Bife", "Batata", "Alface", "Tomate"]
  },
  {
    id: 2,
    name: "Marmita Fitness",
    description: "Arroz integral, feijão, peito de frango grelhado, legumes no vapor e salada verde.",
    price: 22.00,
    image: "photo-1618160702438-9b02ab6515c9",
    category: "Fitness",
    ingredients: ["Arroz Integral", "Feijão", "Frango Grelhado", "Brócolis", "Cenoura", "Salada"]
  },
  {
    id: 3,
    name: "Marmita Caseira",
    description: "Arroz, feijão tropeiro, linguiça calabresa, ovo frito e couve refogada. Sabor de casa da vovó!",
    price: 16.90,
    image: "photo-1618160702438-9b02ab6515c9",
    category: "Caseira",
    ingredients: ["Arroz", "Feijão Tropeiro", "Linguiça", "Ovo", "Couve", "Farofa"]
  },
  {
    id: 4,
    name: "Marmita Vegana",
    description: "Arroz com açafrão, feijão preto, proteína de soja, mix de vegetais e quinoa.",
    price: 19.90,
    image: "photo-1618160702438-9b02ab6515c9",
    category: "Vegana",
    ingredients: ["Arroz", "Feijão Preto", "Proteína de Soja", "Quinoa", "Vegetais", "Tahine"]
  },
  {
    id: 5,
    name: "Marmita do Chefe",
    description: "Risotto de camarão, salmão grelhado, aspargos e mix de folhas nobres. Experiência gourmet!",
    price: 35.00,
    image: "photo-1618160702438-9b02ab6515c9",
    category: "Gourmet",
    ingredients: ["Risotto", "Camarão", "Salmão", "Aspargos", "Rúcula", "Parmesão"]
  },
  {
    id: 6,
    name: "Marmita Nordestina",
    description: "Baião de dois, carne de sol desfiada, queijo coalho, macaxeira e vinagrete especial.",
    price: 21.50,
    image: "photo-1618160702438-9b02ab6515c9",
    category: "Regional",
    ingredients: ["Baião de Dois", "Carne de Sol", "Queijo Coalho", "Macaxeira", "Vinagrete"]
  },
  {
    id: 7,
    name: "Marmita Mineira",
    description: "Arroz, feijão tutu, costelinha suína, couve à mineira e torresmo. Tradição de Minas!",
    price: 24.00,
    image: "photo-1618160702438-9b02ab6515c9",
    category: "Regional",
    ingredients: ["Arroz", "Tutu de Feijão", "Costelinha", "Couve", "Torresmo", "Linguiça"]
  },
  {
    id: 8,
    name: "Marmita Kids",
    description: "Arroz, feijão sem caldo, nuggets de frango, batata smile e cenoura baby.",
    price: 14.90,
    image: "photo-1618160702438-9b02ab6515c9",
    category: "Infantil",
    ingredients: ["Arroz", "Feijão", "Nuggets", "Batata Smile", "Cenoura", "Milho"]
  }
];
