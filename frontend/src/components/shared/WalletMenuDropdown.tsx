// "use client";

// import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
// import { useWalletModal } from "@solana/wallet-adapter-react-ui";
// import { sliceAddressWallet } from "@/lib/helper";
// import * as React from "react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { LogOut } from "lucide-react";
// import WalletIcon from "@/assets/WalletIcom";

// export default function WalletMenuDropdown() {
//   const { setVisible: setModalVisible } = useWalletModal();
//   const { publicKey, onDisconnect } = useWalletMultiButton({
//     onSelectWallet() {
//       setModalVisible(true);
//     },
//   });
//   const [copied, setCopied] = React.useState(false);

//   return (
//     <div className="relative">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           {publicKey ? (
//             <button className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]  rounded-xl w-full py-4 text-base font-bold text-center text-white cursor-pointer">
//               {publicKey && sliceAddressWallet(publicKey)}
//             </button>
//           ) : (
//             <button 
//             onClick={() => setModalVisible(true)}
//             className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]  rounded-xl w-full py-4 text-base font-bold flex items-center justify-center gap-2 text-white cursor-pointer">
//              <WalletIcon/>
//               <p>Connect your wallet</p>
//             </button>
//           )}
//         </DropdownMenuTrigger>
//         {publicKey && (
//           <DropdownMenuContent className="w-56 ">
//             <DropdownMenuItem
//               className="cursor-pointer"
//               onClick={async () => {
//                 if (publicKey) {
//                   await navigator.clipboard.writeText(publicKey.toBase58());
//                   setCopied(true);
//                   setTimeout(() => setCopied(false), 400);
//                 }
//               }}
//             >
//               <span>{copied ? "Copied" : "Copy Address"}</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               className="cursor-pointer"
//               onClick={() => {
//                 setModalVisible(true);
//               }}
//             >
//               <span> Change wallet</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem className="cursor-pointer" onClick={onDisconnect}>
//               <LogOut className="mr-2 h-4 w-4" />
//               <span>Log out</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         )}
//       </DropdownMenu>
//     </div>
//   );
// }
