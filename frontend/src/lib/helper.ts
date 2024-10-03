



export const asyncWait = (s: number) =>
  new Promise((resolve) => setTimeout(resolve, s * 1000));

export const getCurrentTimestamp = () => Math.floor(Number(new Date()) / 1000);



export const sliceAddressWallet = (publicKey: any) => {
  const base58 = publicKey.toBase58();
  const address = base58.slice(0, 2) + ".." + base58.slice(-4);
  return address;
};


export const sliceAddressWalletUser = (addressUser: string) => {
 
  const address = addressUser.slice(0, 28) + ".." + addressUser.slice(-4);
  return address;
};



export const sumBalances = (arr: any[]) => {
  return arr.reduce((total, num) => {
    const roundedNum = Number(num) < 0 ? 0 : Number(num);
    return total + roundedNum;
  }, 0);
};