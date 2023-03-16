import { FC } from 'react';
import NftItem from '../item';
import { useListedNfts } from '@hooks/web3';

const NftList: FC = () => {
  const { nfts } = useListedNfts();

  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {nfts.data?.map((item, index) => (
        <NftItem key={index} item={item} buyNft={nfts.buyNft} />
      ))}
    </div>
  );
};

export default NftList;
