import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import FinanceDashboardAppHeader from "./FinanceDashboardAppHeader";
import PreviousStatementWidget from "./widgets/PreviousStatementWidget";
import CurrentStatementWidget from "./widgets/CurrentStatementWidget";
import AccountBalanceWidget from "./widgets/AccountBalanceWidget";
import RecentTransactionsWidget from "./widgets/RecentTransactionsWidget";
import BudgetWidget from "./widgets/BudgetWidget";
import { useGetFinanceDashboardWidgetsQuery } from "./FinanceDashboardApi";
import useGetMyShopDetails, {
  useGetShopAccountBalance,
} from "app/configs/data/server-calls/shopdetails/useShopDetails";
import DataTable from "app/shared-components/data-table/DataTable";
import useGetMyShopWthdrawals from "app/configs/data/server-calls/shopwithdrawals/useShopWithdrawals";
import { useMemo } from "react";
import {
  Button,
  ListItemIcon,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const container = {
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/**
 * The finance dashboard app.
 */
function FinanceDashboardAppWithdarwals() {
//   const { data: myshopWithdrawals, isLoading: withdrawalsLoading } =
//     useGetMyShopWthdrawals();
  // const { data: widgets, isLoading } = useGetFinanceDashboardWidgetsQuery();

  const {
    data: shopData,
    isLoading: shopDataLoading,
    isError,
  } = useGetMyShopDetails();




  /****used above for wallet withdrawals */

  // const {
  //   data: shopAccount,
  //   isLoading: accountLoading,
  //   isError: accountError,
  // } = useGetShopAccountBalance();

  // console.log("Shop---DATA", shopData?.data?.data)

  // if (shopDataLoading) {
  //   return <FuseLoading />;
  // }

  // if (!shopData) {
  //   return null;
  // }

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "createdAt",
//         header: "Created On",
//         Cell: ({ row }) => (
//           <Typography className="underline" color="secondary" role="button">
//             {row?.original?.createdAt}
//           </Typography>
//         ),
//       },

//       {
//         accessorKey: "name",
//         header: "Name",
//         Cell: ({ row }) => (
//           <Typography
//             component={Link}
//             to={`/shopproducts-list/products/${row?.original?.slug}/${row?.original?.slug}`}
//             className="underline"
//             color="secondary"
//             role="button"
//           >
//             {row?.original?.name}
//           </Typography>
//         ),
//       },

//       {
//         accessorKey: "amount",
//         header: "Withdrawal Amount",
//         accessorFn: (row) => {
//           return `NGN ${row?.amount}`;
//         },
//       },
//       {
//         accessorKey: "status",
//         header: "Approval status",
//         accessorFn: (row) => (
//           <div className="flex items-center">
//             {!row?.isBlocked || !row?.isSuspended ? (
//               <FuseSvgIcon className="text-green" size={20}>
//                 heroicons-outline:check-circle
//               </FuseSvgIcon>
//             ) : (
//               <FuseSvgIcon className="text-red" size={20}>
//                 heroicons-outline:minus-circle
//               </FuseSvgIcon>
//             )}
//           </div>
//         ),
//       },
//     ],
//     []
//   );

  return (
    <FusePageSimple
      header={
        <FinanceDashboardAppHeader
          shopData={shopData}
          isLoading={shopDataLoading}
        />
      }
      content={
        <div className="w-full px-24 md:px-32 pb-24">
          <motion.div
            className="w-full"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-32 w-full mt-32">
              {/* <div className="grid gap-32 sm:grid-flow-col xl:grid-flow-row">
                <motion.div variants={item} className="flex flex-col flex-auto">
                  <PreviousStatementWidget
                    account={shopAccount?.data}
                    accountLoading={accountLoading}
                    accountError={accountError}
                  />
                </motion.div>

                <motion.div variants={item} className="flex flex-col flex-auto">
                  <CurrentStatementWidget
                    shopData={shopData?.data?.data}
                    shopDataLoading={shopDataLoading}
                    isError={isError}
                  />
                </motion.div>
              </div> */}
              {/* <motion.div variants={item} className="flex flex-col flex-auto">
                <AccountBalanceWidget
                   shopData={shopData?.data?.data}
                   shopDataLoading={shopDataLoading}
                   isError={isError}

                   account={shopAccount?.data}
                   accountLoading={accountLoading}
                   accountError={accountError}
                />
              </motion.div> */}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-32 w-full mt-32">
              <motion.div
                variants={item}
                className="xl:col-span-2 flex flex-col flex-auto"
              >
                <RecentTransactionsWidget />

                
              </motion.div>
            </div>
          </motion.div>
        </div>
      }
    />
  );
}


export default FinanceDashboardAppWithdarwals;
