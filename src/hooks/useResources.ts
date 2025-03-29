
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookingResource, BookingType } from "@/types/bookings";
import { toast } from "sonner";

export const useResources = (type: BookingType) => {
  const [resources, setResources] = useState<BookingResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase.from('resources').select('*');
        
        // Filter by type if provided
        if (type) {
          query = query.eq('type', type);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (!data || data.length === 0) {
          // If no resources found, create some demo resources
          const demoResources = await createDemoResources(type);
          setResources(demoResources);
        } else {
          const mappedResources: BookingResource[] = data.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            capacity: item.capacity,
            pricePerNight: item.price_per_night,
            pricePerHour: item.price_per_hour,
            features: item.features,
            status: item.status,
            imageUrl: item.image_url,
            description: item.description
          }));
          
          setResources(mappedResources);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(`Erreur lors du chargement des ressources: ${err.message}`);
        console.error("Error fetching resources:", err);
        
        // Create demo resources in case of error
        const demoResources = await createDemoResources(type);
        setResources(demoResources);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [type]);

  // Function to create demo resources if none exist
  const createDemoResources = async (type: BookingType): Promise<BookingResource[]> => {
    const demoData: Partial<BookingResource>[] = [];
    
    switch (type) {
      case 'meeting':
        demoData.push(
          { name: 'Salle de conférence A', type, capacity: 20, pricePerHour: 50, status: 'available', features: ['projecteur', 'wifi'] },
          { name: 'Salle de réunion B', type, capacity: 8, pricePerHour: 30, status: 'available', features: ['tableau blanc', 'wifi'] },
          { name: 'Espace collaboratif C', type, capacity: 15, pricePerHour: 40, status: 'available', features: ['visioconférence', 'café'] }
        );
        break;
      case 'car':
        demoData.push(
          { name: 'Berline de luxe', type, capacity: 4, pricePerDay: 120, status: 'available', features: ['climatisation', 'GPS'] },
          { name: 'SUV familial', type, capacity: 7, pricePerDay: 150, status: 'available', features: ['toit ouvrant', 'GPS'] },
          { name: 'Cabriolet sport', type, capacity: 2, pricePerDay: 180, status: 'available', features: ['décapotable', 'cuir'] }
        );
        break;
      case 'terrace':
        demoData.push(
          { name: 'Terrasse panoramique', type, capacity: 30, pricePerHour: 100, status: 'available', features: ['vue mer', 'parasols'] },
          { name: 'Jardin privé', type, capacity: 15, pricePerHour: 70, status: 'available', features: ['barbecue', 'éclairage'] },
          { name: 'Rooftop lounge', type, capacity: 25, pricePerHour: 120, status: 'available', features: ['bar', 'chauffage'] }
        );
        break;
      case 'restaurant':
        demoData.push(
          { name: 'Espace gastronomique', type, capacity: 40, pricePerHour: 200, status: 'available', features: ['menu dégustation', 'sommelier'] },
          { name: 'Salon privé', type, capacity: 12, pricePerHour: 150, status: 'available', features: ['service personnalisé', 'décoration'] },
          { name: 'Espace buffet', type, capacity: 60, pricePerHour: 250, status: 'available', features: ['buffet à volonté', 'animations'] }
        );
        break;
      default:
        return [];
    }
    
    // For demonstration purposes, we'll just return the demo data without actually inserting it
    return demoData.map((item, index) => ({
      id: `demo-${type}-${index + 1}`,
      name: item.name!,
      type: type,
      capacity: item.capacity!,
      pricePerNight: type === 'room' ? 100 : undefined,
      pricePerHour: ['meeting', 'terrace', 'restaurant'].includes(type) ? (item.pricePerHour || 50) : undefined,
      features: item.features || [],
      status: 'available',
      imageUrl: undefined,
      description: `Demo ${type} resource ${index + 1}`
    }));
  };

  return {
    resources,
    loading,
    error
  };
};
