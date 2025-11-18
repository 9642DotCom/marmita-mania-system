export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      animals: {
        Row: {
          acquisitionDate: string
          acquisitionValue: number
          age: number
          breed: string
          created_at: string
          id: string
          origin: string
          saleId: string | null
          sellerId: string | null
          sex: string
          species: string
          status: string
          tag: string
          user_id: string
        }
        Insert: {
          acquisitionDate: string
          acquisitionValue: number
          age: number
          breed: string
          created_at?: string
          id?: string
          origin: string
          saleId?: string | null
          sellerId?: string | null
          sex: string
          species: string
          status: string
          tag: string
          user_id: string
        }
        Update: {
          acquisitionDate?: string
          acquisitionValue?: number
          age?: number
          breed?: string
          created_at?: string
          id?: string
          origin?: string
          saleId?: string | null
          sellerId?: string | null
          sex?: string
          species?: string
          status?: string
          tag?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "animals_saleId_fkey"
            columns: ["saleId"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sellerId_fkey"
            columns: ["sellerId"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogo_categorias: {
        Row: {
          created_at: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: never
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: never
          nome?: string
        }
        Relationships: []
      }
      catalogo_itens: {
        Row: {
          categoria_id: number | null
          created_at: string
          descricao: string | null
          detalhes: Json | null
          disponivel: boolean | null
          id: number
          imagem: string | null
          imagem_base64: string | null
          nome: string
          preco: number | null
          preco_promocional: number | null
          updated_at: string
        }
        Insert: {
          categoria_id?: number | null
          created_at?: string
          descricao?: string | null
          detalhes?: Json | null
          disponivel?: boolean | null
          id?: never
          imagem?: string | null
          imagem_base64?: string | null
          nome: string
          preco?: number | null
          preco_promocional?: number | null
          updated_at?: string
        }
        Update: {
          categoria_id?: number | null
          created_at?: string
          descricao?: string | null
          detalhes?: Json | null
          disponivel?: boolean | null
          id?: never
          imagem?: string | null
          imagem_base64?: string | null
          nome?: string
          preco?: number | null
          preco_promocional?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalogo_itens_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "catalogo_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          company_id: string
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          nome: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          nome?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          nome?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          horario_funcionamento: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          horario_funcionamento?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          horario_funcionamento?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          business_hours: string | null
          city: string | null
          company_id: string
          created_at: string | null
          id: string
          item1_description: string | null
          item1_title: string | null
          item2_description: string | null
          item2_title: string | null
          item3_description: string | null
          item3_title: string | null
          logo_url: string | null
          restaurant_name: string | null
          restaurant_slogan: string | null
          site_description: string | null
          site_title: string | null
          state: string | null
          updated_at: string | null
          whatsapp_phone: string | null
        }
        Insert: {
          business_hours?: string | null
          city?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          item1_description?: string | null
          item1_title?: string | null
          item2_description?: string | null
          item2_title?: string | null
          item3_description?: string | null
          item3_title?: string | null
          logo_url?: string | null
          restaurant_name?: string | null
          restaurant_slogan?: string | null
          site_description?: string | null
          site_title?: string | null
          state?: string | null
          updated_at?: string | null
          whatsapp_phone?: string | null
        }
        Update: {
          business_hours?: string | null
          city?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          item1_description?: string | null
          item1_title?: string | null
          item2_description?: string | null
          item2_title?: string | null
          item3_description?: string | null
          item3_title?: string | null
          logo_url?: string | null
          restaurant_name?: string | null
          restaurant_slogan?: string | null
          site_description?: string | null
          site_title?: string | null
          state?: string | null
          updated_at?: string | null
          whatsapp_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      dados_whatsapp: {
        Row: {
          avaliacao: string | null
          categoria: string | null
          created_at: string
          endereco: string | null
          horario_funcionamento: string | null
          id: number
          link: string | null
          nome: string | null
          numero_avaliacoes: string | null
          reviews: string | null
          telefone: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          avaliacao?: string | null
          categoria?: string | null
          created_at?: string
          endereco?: string | null
          horario_funcionamento?: string | null
          id?: number
          link?: string | null
          nome?: string | null
          numero_avaliacoes?: string | null
          reviews?: string | null
          telefone?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          avaliacao?: string | null
          categoria?: string | null
          created_at?: string
          endereco?: string | null
          horario_funcionamento?: string | null
          id?: number
          link?: string | null
          nome?: string | null
          numero_avaliacoes?: string | null
          reviews?: string | null
          telefone?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          id: string
          user_id: string
          value: number
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          user_id: string
          value: number
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      gtas: {
        Row: {
          animals: Json[]
          created_at: string
          departureDate: string
          destinationInfo: Json
          feeValue: number
          id: string
          issueDate: string
          linkedInvoiceNumber: string
          number: string
          pdfUrl: string | null
          producerInfo: Json
          purpose: string
          transportInfo: Json
          user_id: string
          vaccinationInfo: string | null
        }
        Insert: {
          animals: Json[]
          created_at?: string
          departureDate: string
          destinationInfo: Json
          feeValue: number
          id?: string
          issueDate: string
          linkedInvoiceNumber: string
          number: string
          pdfUrl?: string | null
          producerInfo: Json
          purpose: string
          transportInfo: Json
          user_id: string
          vaccinationInfo?: string | null
        }
        Update: {
          animals?: Json[]
          created_at?: string
          departureDate?: string
          destinationInfo?: Json
          feeValue?: number
          id?: string
          issueDate?: string
          linkedInvoiceNumber?: string
          number?: string
          pdfUrl?: string | null
          producerInfo?: Json
          purpose?: string
          transportInfo?: Json
          user_id?: string
          vaccinationInfo?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          cfop: string
          created_at: string
          departureDateTime: string
          id: string
          issueDate: string
          issuer: Json
          items: Json[]
          model: number
          number: string
          paymentMethod: string
          pdfUrl: string | null
          purpose: string
          recipient: Json
          status: string
          totalValue: number
          transport: Json
          user_id: string
          xmlUrl: string | null
        }
        Insert: {
          cfop: string
          created_at?: string
          departureDateTime: string
          id?: string
          issueDate: string
          issuer: Json
          items: Json[]
          model: number
          number: string
          paymentMethod: string
          pdfUrl?: string | null
          purpose: string
          recipient: Json
          status: string
          totalValue: number
          transport: Json
          user_id: string
          xmlUrl?: string | null
        }
        Update: {
          cfop?: string
          created_at?: string
          departureDateTime?: string
          id?: string
          issueDate?: string
          issuer?: Json
          items?: Json[]
          model?: number
          number?: string
          paymentMethod?: string
          pdfUrl?: string | null
          purpose?: string
          recipient?: Json
          status?: string
          totalValue?: number
          transport?: Json
          user_id?: string
          xmlUrl?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          order_id: string
          product_id: string
          quantity: number
          subtotal: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id: string
          product_id: string
          quantity?: number
          subtotal: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          product_id?: string
          quantity?: number
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          company_id: string
          created_at: string | null
          customer_address: string | null
          customer_name: string | null
          customer_phone: string | null
          deleted_at: string | null
          id: string
          notes: string | null
          order_type: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          table_id: string | null
          total_amount: number
          updated_at: string | null
          waiter_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          deleted_at?: string | null
          id?: string
          notes?: string | null
          order_type?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          table_id?: string | null
          total_amount?: number
          updated_at?: string | null
          waiter_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          deleted_at?: string | null
          id?: string
          notes?: string | null
          order_type?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          table_id?: string | null
          total_amount?: number
          updated_at?: string | null
          waiter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          address: Json
          contact: string
          created_at: string
          document: string
          id: string
          name: string
          type: string
          user_id: string
        }
        Insert: {
          address: Json
          contact: string
          created_at?: string
          document: string
          id?: string
          name: string
          type: string
          user_id: string
        }
        Update: {
          address?: Json
          contact?: string
          created_at?: string
          document?: string
          id?: string
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      producers: {
        Row: {
          address: Json
          certificateBase64: string | null
          certificateFileName: string | null
          certificatePassword: string | null
          created_at: string
          document: string
          id: string
          name: string
          stateRegistration: string
          taxRegime: string
          user_id: string
        }
        Insert: {
          address: Json
          certificateBase64?: string | null
          certificateFileName?: string | null
          certificatePassword?: string | null
          created_at?: string
          document: string
          id?: string
          name: string
          stateRegistration: string
          taxRegime: string
          user_id: string
        }
        Update: {
          address?: Json
          certificateBase64?: string | null
          certificateFileName?: string | null
          certificatePassword?: string | null
          created_at?: string
          document?: string
          id?: string
          name?: string
          stateRegistration?: string
          taxRegime?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          available: boolean | null
          category_id: string | null
          company_id: string
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          category_id?: string | null
          company_id: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          category_id?: string | null
          company_id?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey1"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string
          created_at: string | null
          deleted_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          deleted_at?: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      revenues: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          id?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      sales: {
        Row: {
          animalIds: string[]
          buyerId: string | null
          created_at: string
          date: string
          id: string
          invoiceId: string | null
          totalValue: number
          user_id: string
        }
        Insert: {
          animalIds: string[]
          buyerId?: string | null
          created_at?: string
          date: string
          id?: string
          invoiceId?: string | null
          totalValue: number
          user_id: string
        }
        Update: {
          animalIds?: string[]
          buyerId?: string | null
          created_at?: string
          date?: string
          id?: string
          invoiceId?: string | null
          totalValue?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_buyerId_fkey"
            columns: ["buyerId"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          available: boolean | null
          capacity: number | null
          company_id: string
          created_at: string | null
          id: string
          number: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          capacity?: number | null
          company_id: string
          created_at?: string | null
          id?: string
          number: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          capacity?: number | null
          company_id?: string
          created_at?: string | null
          id?: string
          number?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tables_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_auto_responses: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string | null
          is_active: boolean | null
          keyword: string
          response: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          is_active?: boolean | null
          keyword: string
          response: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          is_active?: boolean | null
          keyword?: string
          response?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_auto_responses_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_chats: {
        Row: {
          chat_id: string
          contact_id: string | null
          created_at: string | null
          id: string
          instance_id: string | null
          is_group: boolean | null
          last_message_at: string | null
          name: string | null
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          chat_id: string
          contact_id?: string | null
          created_at?: string | null
          id?: string
          instance_id?: string | null
          is_group?: boolean | null
          last_message_at?: string | null
          name?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          chat_id?: string
          contact_id?: string | null
          created_at?: string | null
          id?: string
          instance_id?: string | null
          is_group?: boolean | null
          last_message_at?: string | null
          name?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_chats_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_chats_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_contacts: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string | null
          is_business: boolean | null
          name: string | null
          phone: string
          profile_picture_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          is_business?: boolean | null
          name?: string | null
          phone: string
          profile_picture_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          is_business?: boolean | null
          name?: string | null
          phone?: string
          profile_picture_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_contacts_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_instances: {
        Row: {
          api_key: string | null
          created_at: string | null
          evolution_instance_name: string | null
          id: string
          name: string
          phone: string | null
          qr_code: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          evolution_instance_name?: string | null
          id?: string
          name: string
          phone?: string | null
          qr_code?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          evolution_instance_name?: string | null
          id?: string
          name?: string
          phone?: string | null
          qr_code?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          chat_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_from_me: boolean | null
          media_url: string | null
          message_id: string
          message_type: string | null
          sender_name: string | null
          sender_phone: string | null
          status: string | null
          timestamp: string | null
        }
        Insert: {
          chat_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_from_me?: boolean | null
          media_url?: string | null
          message_id: string
          message_type?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          status?: string | null
          timestamp?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_from_me?: boolean | null
          media_url?: string | null
          message_id?: string
          message_type?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          status?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_scheduled_messages: {
        Row: {
          chat_id: string | null
          content: string
          created_at: string | null
          id: string
          instance_id: string | null
          media_url: string | null
          scheduled_for: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          chat_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          instance_id?: string | null
          media_url?: string | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          instance_id?: string | null
          media_url?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_scheduled_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_scheduled_messages_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_company_id: { Args: never; Returns: string }
      restore_soft_deleted: {
        Args: { record_id: string; table_name: string }
        Returns: undefined
      }
    }
    Enums: {
      order_status:
        | "pendente"
        | "preparando"
        | "saiu_entrega"
        | "entregue"
        | "cancelado"
      user_role: "admin" | "caixa" | "entregador" | "cozinha" | "garcon"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pendente",
        "preparando",
        "saiu_entrega",
        "entregue",
        "cancelado",
      ],
      user_role: ["admin", "caixa", "entregador", "cozinha", "garcon"],
    },
  },
} as const
