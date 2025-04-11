
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchSORItems, SORItem } from "../sorApiUtils";

export function useSORItems() {
  const [retrievedSORItems, setRetrievedSORItems] = useState<SORItem[]>([]);
  const [isSearchingSOR, setIsSearchingSOR] = useState(false);
  const { toast } = useToast();

  const handleSORItemSelectionChange = (index: number, selected: boolean) => {
    const updatedItems = [...retrievedSORItems];
    updatedItems[index].selected = selected;
    
    // Initialize quantity to 1 when selected
    if (selected && !updatedItems[index].quantity) {
      updatedItems[index].quantity = 1;
    }
    
    setRetrievedSORItems(updatedItems);
  };
  
  const handleSORItemQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...retrievedSORItems];
    updatedItems[index].quantity = quantity;
    setRetrievedSORItems(updatedItems);
  };

  const handleSearchSOR = async (userRequirements: string) => {
    if (userRequirements.trim() === '') {
      toast({
        title: "Requirements needed",
        description: "Please enter your query before searching the Schedule of Rates.",
        variant: "destructive"
      });
      return;
    }

    setIsSearchingSOR(true);
    
    try {
      toast({
        title: "Searching SOR database",
        description: "Looking for matching items in the Schedule of Rates...",
      });
      
      const sorItems = await fetchSORItems(userRequirements);
      setRetrievedSORItems(sorItems);
      
      if (sorItems.length > 0) {
        toast({
          title: "SOR data retrieved",
          description: `Found ${sorItems.length} relevant service items.`,
        });
      } else {
        toast({
          title: "No relevant SOR items found",
          description: "Try refining your search query or use the category selections below.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching SOR data:", error);
      toast({
        title: "Error",
        description: "Failed to search SOR database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearchingSOR(false);
    }
  };

  return {
    retrievedSORItems,
    isSearchingSOR,
    handleSORItemSelectionChange,
    handleSORItemQuantityChange,
    handleSearchSOR
  };
}
