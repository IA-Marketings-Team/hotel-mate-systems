
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceCategory {
  id: string;
  name: string;
  register_type: string;
  parent_id: string | null;
  created_at: string;
}

export const useCategories = (registerType?: string) => {
  return useQuery({
    queryKey: ['categories', registerType],
    queryFn: async () => {
      let query = supabase
        .from('service_categories')
        .select('*')
        .order('name');
      
      if (registerType) {
        query = query.eq('register_type', registerType);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Error fetching categories: ${error.message}`);
      }
      
      return data as ServiceCategory[];
    }
  });
};

export const useSubcategories = (parentId: string | null) => {
  return useQuery({
    queryKey: ['subcategories', parentId],
    queryFn: async () => {
      if (!parentId) return [];
      
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('parent_id', parentId)
        .order('name');
      
      if (error) {
        throw new Error(`Error fetching subcategories: ${error.message}`);
      }
      
      return data as ServiceCategory[];
    },
    enabled: !!parentId
  });
};
