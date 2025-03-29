
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";

export const useClients = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw new Error(`Error fetching clients: ${error.message}`);
      }
      
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        address: item.address,
        city: item.city,
        country: item.country,
        postalCode: item.postal_code,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Client[];
    }
  });

  const addClient = useMutation({
    mutationFn: async (newClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone,
          address: newClient.address,
          city: newClient.city,
          country: newClient.country,
          postal_code: newClient.postalCode,
          notes: newClient.notes
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error adding client: ${error.message}`);
      }
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postal_code,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  const updateClient = useMutation({
    mutationFn: async (client: Partial<Client> & { id: string }) => {
      const { error } = await supabase
        .from('clients')
        .update({
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          country: client.country,
          postal_code: client.postalCode,
          notes: client.notes
        })
        .eq('id', client.id);
      
      if (error) {
        throw new Error(`Error updating client: ${error.message}`);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Error deleting client: ${error.message}`);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  return {
    ...query,
    addClient,
    updateClient,
    deleteClient
  };
};

export const useClient = (id: string | undefined) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (!id) throw new Error("Client ID is required");
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(`Error fetching client: ${error.message}`);
      }
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postal_code,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Client;
    },
    enabled: !!id
  });
};
