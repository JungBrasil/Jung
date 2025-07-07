export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      edicoes: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          id: string
          local: string
          nome_edicao: string
          numero_edicao: number
          taxa_inscricao: number
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          id?: string
          local: string
          nome_edicao: string
          numero_edicao: number
          taxa_inscricao: number
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          local?: string
          nome_edicao?: string
          numero_edicao?: number
          taxa_inscricao?: number
        }
        Relationships: []
      }
      equipe_setores: {
        Row: {
          created_at: string
          id: string
          pessoa_id: string
          setor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pessoa_id: string
          setor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pessoa_id?: string
          setor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipe_setores_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipe_setores_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          created_at: string
          data_pagamento: string
          id: string
          pessoa_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_pagamento: string
          id?: string
          pessoa_id: string
          valor: number
        }
        Update: {
          created_at?: string
          data_pagamento?: string
          id?: string
          pessoa_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas: {
        Row: {
          alergias: string | null
          altura_cm: number | null
          avatar_url: string | null
          comunidade: string | null
          created_at: string
          data_nascimento: string
          e_servo: boolean
          edicao_id: string
          email: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_complemento: string | null
          endereco_estado: string | null
          endereco_numero: string | null
          endereco_rua: string | null
          id: string
          medicamentos_continuos: string | null
          nome_completo: string
          observacoes: string | null
          paroquia: string | null
          peso_kg: number | null
          possui_alergias: boolean
          tamanho_camiseta: string | null
          telefone: string | null
          tipo: string
          toma_medicamento_continuo: boolean
          tribo_id: string | null
        }
        Insert: {
          alergias?: string | null
          altura_cm?: number | null
          avatar_url?: string | null
          comunidade?: string | null
          created_at?: string
          data_nascimento: string
          e_servo?: boolean
          edicao_id: string
          email?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_estado?: string | null
          endereco_numero?: string | null
          endereco_rua?: string | null
          id?: string
          medicamentos_continuos?: string | null
          nome_completo: string
          observacoes?: string | null
          paroquia?: string | null
          peso_kg?: number | null
          possui_alergias?: boolean
          tamanho_camiseta?: string | null
          telefone?: string | null
          tipo: string
          toma_medicamento_continuo?: boolean
          tribo_id?: string | null
        }
        Update: {
          alergias?: string | null
          altura_cm?: number | null
          avatar_url?: string | null
          comunidade?: string | null
          created_at?: string
          data_nascimento?: string
          e_servo?: boolean
          edicao_id?: string
          email?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_estado?: string | null
          endereco_numero?: string | null
          endereco_rua?: string | null
          id?: string
          medicamentos_continuos?: string | null
          nome_completo?: string
          observacoes?: string | null
          paroquia?: string | null
          peso_kg?: number | null
          possui_alergias?: boolean
          tamanho_camiseta?: string | null
          telefone?: string | null
          tipo?: string
          toma_medicamento_continuo?: boolean
          tribo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_edicao_id_fkey"
            columns: ["edicao_id"]
            isOneToOne: false
            referencedRelation: "edicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_tribo_id_fkey"
            columns: ["tribo_id"]
            isOneToOne: false
            referencedRelation: "tribos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setores: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      tribos: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never