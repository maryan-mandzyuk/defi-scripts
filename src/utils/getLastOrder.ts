import { Orderbook } from "@project-serum/serum";

export const getLastOrder = (orderbook: Orderbook) => {
  const lastBidOpenbook = orderbook.getL2(1).sort((a, b) => b[0] - a[0])[0];

  console.log(lastBidOpenbook);

  return { price: lastBidOpenbook[0], size: lastBidOpenbook[1] };
};
