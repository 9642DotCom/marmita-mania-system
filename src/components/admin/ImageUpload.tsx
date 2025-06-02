
import { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (url: string) => void;
  onImageRemove: () => void;
}

const ImageUpload = ({ currentImageUrl, onImageChange, onImageRemove }: ImageUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useAuthenticatedMutation({
    mutationFn: async (file: File) => {
      setUploadProgress(0);

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      return publicUrl;
    },
    onSuccess: (publicUrl) => {
      onImageChange(publicUrl);
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
      setTimeout(() => setUploadProgress(0), 1000);
    },
    onError: (error) => {
      console.error('Erro no upload:', error);
      setUploadProgress(0);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleRemoveImage = () => {
    onImageRemove();
  };

  return (
    <div className="space-y-4">
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            onClick={handleRemoveImage}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Clique para adicionar uma imagem
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PNG, JPG, JPEG até 5MB
                </span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadMutation.isPending}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {uploadMutation.isPending && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 animate-pulse" />
            <span className="text-sm text-gray-600">Fazendo upload...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
