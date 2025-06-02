
import { MarmitaItem } from '@/hooks/useCart';

export const marmitasData: MarmitaItem[] = [
  {
    id: "1",
    name: "Marmita Tradicional",
    description: "Arroz, feijão, bife acebolado, batata frita e salada",
    price: 18.90,
    image: "/placeholder.svg",
    category: "Tradicionais",
    ingredients: ["Arroz", "Feijão", "Bife", "Batata", "Salada"]
  },
  {
    id: "2", 
    name: "Marmita de Frango",
    description: "Arroz, feijão, frango grelhado, purê e legumes",
    price: 16.90,
    image: "/placeholder.svg",
    category: "Tradicionais",
    ingredients: ["Arroz", "Feijão", "Frango", "Purê", "Legumes"]
  },
  {
    id: "3",
    name: "Marmita Vegetariana",
    description: "Arroz integral, feijão, legumes refogados e salada",
    price: 15.90,
    image: "/placeholder.svg",
    category: "Vegetarianas",
    ingredients: ["Arroz Integral", "Feijão", "Legumes", "Salada"]
  },
  {
    id: "4",
    name: "Marmita Fitness",
    description: "Arroz integral, grão de bico, peito de frango e brócolis",
    price: 19.90,
    image: "/placeholder.svg",
    category: "Fitness",
    ingredients: ["Arroz Integral", "Grão de Bico", "Frango", "Brócolis"]
  },
  {
    id: "5",
    name: "Marmita de Peixe",
    description: "Arroz, feijão, peixe grelhado, batata doce e salada",
    price: 22.90,
    image: "/placeholder.svg",
    category: "Especiais",
    ingredients: ["Arroz", "Feijão", "Peixe", "Batata Doce", "Salada"]
  },
  {
    id: "6",
    name: "Marmita Executiva",
    description: "Arroz, feijão tropeiro, picanha, farofa e vinagrete",
    price: 25.90,
    image: "/placeholder.svg",
    category: "Executivas",
    ingredients: ["Arroz", "Feijão Tropeiro", "Picanha", "Farofa", "Vinagrete"]
  },
  {
    id: "7",
    name: "Marmita Light",
    description: "Quinoa, legumes no vapor, frango desfiado e salada verde",
    price: 21.90,
    image: "/placeholder.svg",
    category: "Light",
    ingredients: ["Quinoa", "Legumes", "Frango Desfiado", "Salada Verde"]
  },
  {
    id: "8",
    name: "Marmita Caseira",
    description: "Arroz, feijão, costelinha, mandioca e couve refogada",
    price: 23.90,
    image: "/placeholder.svg",
    category: "Caseiras",
    ingredients: ["Arroz", "Feijão", "Costelinha", "Mandioca", "Couve"]
  }
];
