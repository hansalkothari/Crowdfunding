import React, { useContext, createContext, ReactNode } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite, useConnect, metamaskWallet } from '@thirdweb-dev/react';
import { ethers, BigNumber } from 'ethers';


interface FormData {
  title: string;
  description: string;
  target: string;
  deadline: string;
  image: string;
}

interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: number;
  amountCollected: string;
  image: string;
  pId: number;
}

interface Donation {
  donator: string;
  donation: string;
}

interface StateContextType {
  address: string | undefined;
  contract: any;
  handleConnect: () => Promise<any>;
  createCampaign: (form: FormData) => Promise<void>;
  getCampaigns: () => Promise<Campaign[]>;
  getUserCampaigns: () => Promise<Campaign[]>;
  donate: (pId: number, amount: string) => Promise<any>;
  getDonations: (pId: number) => Promise<Donation[]>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateContextProviderProps {
  children: ReactNode;
}

const metamaskConfig = metamaskWallet();



export const StateContextProvider: React.FC<StateContextProviderProps> = ({ children }) => {
  const { contract } = useContract('0x1bc02c9E7f8468Ae824E6cF7EccAfD309923EB76');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useConnect();
  let wallet;
  
  const handleConnect = async() => {
    wallet = await connect(metamaskConfig);
  }

  const publishCampaign = async (form: FormData): Promise<void> => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline
          form.image,
        ],
      });

      console.log('Contract call success', data);
    } catch (error) {
      console.error('Contract call failure', error);
    }
  };

  const getCampaigns = async (): Promise<Campaign[]> => {
    if (!contract) {
      throw new Error("Contract is not initialized.");
    }

    const campaigns = await contract.call('getCampaigns');

    const parsedCampaigns: Campaign[] = campaigns.map((campaign: any, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async (): Promise<Campaign[]> => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  };

  const donate = async (pId: number, amount: string): Promise<any> => {
    if (!contract) {
      throw new Error("Contract is not initialized.");
    }
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });
    return data;
  };

  const getDonations = async (pId: number): Promise<Donation[]> => {
    if (!contract) {
      throw new Error("Contract is not initialized.");
    }
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations: Donation[] = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        handleConnect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateContextProvider');
  }
  return context;
};
