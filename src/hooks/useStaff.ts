
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  contactNumber: string;
  shift: string;
  isAvailable: boolean;
}

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name');
      
      if (error) {
        throw new Error(`Error fetching staff: ${error.message}`);
      }
      
      return data.map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        email: item.email,
        contactNumber: item.contact_number,
        shift: item.shift,
        isAvailable: item.is_available
      })) as StaffMember[];
    }
  });
};
