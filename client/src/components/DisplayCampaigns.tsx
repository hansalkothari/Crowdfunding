import React from 'react';
import { useNavigate } from 'react-router-dom';
import FundCard from './FundCard';
import { loader } from '../assets';

// Define the Campaign type
interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: string; // or BigNumber if you're using it
  deadline: number;
  amountCollected: string;
  image: string;
  pId: number;
}

// Props for the DisplayCampaigns component
interface DisplayCampaignsProps {
  title: string;
  isLoading: boolean;
  campaigns: Campaign[];
}

const DisplayCampaigns: React.FC<DisplayCampaignsProps> = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign: Campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const renderCampaigns = () =>
    campaigns.map((campaign) => (
      <FundCard
        key={campaign.pId} // Use pId as a unique key
        {...campaign}
        handleClick={() => handleNavigate(campaign)}
      />
    ));

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campaigns yet.
          </p>
        )}

        {!isLoading && campaigns.length > 0 && renderCampaigns()}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
