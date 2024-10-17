import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { memo, useMemo } from "react";
import { format } from "date-fns/format";
import clsx from "clsx";
import Button from "@mui/material/Button";
import FuseLoading from "@fuse/core/FuseLoading";
import { useGetFinanceDashboardWidgetsQuery } from "../FinanceDashboardApi";
import useGetMyShopWthdrawals from "app/configs/data/server-calls/shopwithdrawals/useShopWithdrawals";
import DataTable from "app/shared-components/data-table/DataTable";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

/**
 * The RecentTransactionsWidget widget.
 */
function RecentTransactionsWidget() {
  const { data: myshopWithdrawals, isLoading: withdrawalsLoading } =
    useGetMyShopWthdrawals();

//   if (withdrawalsLoading) {
//     return <FuseLoading />;
//   }
//   if (!myshopWithdrawals) {
//     return null;
//   }

  const columns = useMemo(
    () => [
        {
      	accessorKey: "createdAt",
      	header: "Created On",
      	Cell: ({ row }) => (
      	  <Typography
      		className="underline"
      		color="secondary"
      		role="button"
      	  >
      		{row?.original?.createdAt}
      	  </Typography>
      	),
        },

    //   {
    //     accessorKey: "amount",
    //     header: "Ammount",
    //     Cell: ({ row }) => (
    //       <Typography
    //         component={Link}
    //         to={`/shopproducts-list/products/${row?.original?.slug}/${row?.original?.slug}`}
    //         className="underline"
    //         color="secondary"
    //         role="button"
    //       >
    //         {row?.original?.amount}
    //       </Typography>
    //     ),
    //   },

      {
        accessorKey: "amount",
        header: "Withdrawal Amount",
        accessorFn: (row) => {
          return `NGN ${row?.amount}`;
        },
      },
    //   {
    //     accessorKey: "status",
    //     header: "Approval status",
    //     accessorFn: (row) => (
    //       <div className="flex items-center">
    //         {!row?.isBlocked || !row?.isSuspended ? (
    //           <FuseSvgIcon className="text-green" size={20}>
    //             heroicons-outline:check-circle
    //           </FuseSvgIcon>
    //         ) : (
    //           <FuseSvgIcon className="text-red" size={20}>
    //             heroicons-outline:minus-circle
    //           </FuseSvgIcon>
    //         )}
    //       </div>
    //     ),
    //   },
    ],
    []
  );

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <div>
        <Typography className="mr-16 text-lg font-medium tracking-tight leading-6 truncate">
          Recent Withrawal Requests
        </Typography>
        <Typography className="font-medium" color="text.secondary">
          0 pending, 0 approved
        </Typography>
      </div>

      <div className="table-responsive mt-24">
        <Table className="simple w-full min-w-full">
					<TableHead>
						<TableRow>
								<TableCell
								 >
									<Typography
										color="text.secondary"
										className="font-semibold text-12 whitespace-nowrap"
									>
										Transaction ID
									</Typography>
								</TableCell>
							<TableCell 
							>
									<Typography
										color="text.secondary"
										className="font-semibold text-12 whitespace-nowrap"
									>
										Date
									</Typography>
								</TableCell>

								<TableCell>
									<Typography
										color="text.secondary"
										className="font-semibold text-12 whitespace-nowrap"
									>
										Accoun Name
									</Typography>
								</TableCell>
								<TableCell>
									<Typography
										color="text.secondary"
										className="font-semibold text-12 whitespace-nowrap"
									>
										Amount
									</Typography>
								</TableCell>
								<TableCell>
									<Typography
										color="text.secondary"
										className="font-semibold text-12 whitespace-nowrap"
									>
										Approval Status
									</Typography>
								</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{myshopWithdrawals?.data?.data?.map((row, index) => (
							<TableRow key={index}>
								{Object.entries(row).map(([key, value]) => {
									switch (key) {
										case '_id': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography color="text.secondary">{value}</Typography>
												</TableCell>
											);
										}
										case 'createdAt': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>{format(new Date(value), 'MMM dd, y')}</Typography>
												</TableCell>
											);
										}
										case 'amount': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>
														{value.toLocaleString('en-US', {
															style: 'currency',
															currency: 'USD'
														})}
													</Typography>
												</TableCell>
											);
										}
										case 'status': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography
														className={clsx(
															'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
															value === 'pending' &&
																'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
															value === 'completed' &&
																'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50'
														)}
													>
														{value}
													</Typography>
												</TableCell>
											);
										}
										default: {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>{value}</Typography>
												</TableCell>
											);
										}
									}
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>

        

        <div className="pt-24">
          <Button variant="outlined">See all transactions</Button>
        </div>
      </div>
    </Paper>
  );
}

export default memo(RecentTransactionsWidget);
