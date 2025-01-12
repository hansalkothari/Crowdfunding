import React, { useState, useEffect } from 'react';

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: string; // or BigNumber based on your project
  deadline: number;
  amountCollected: string;
  image: string;
  pId: number;
}

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const data: Campaign[] = await getCampaigns(); // Ensure getCampaigns returns a Campaign array
      setCampaigns(data || []); // Handle null/undefined gracefully
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Home;
