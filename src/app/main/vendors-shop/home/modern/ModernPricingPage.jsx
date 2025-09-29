import { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { darken } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import clsx from "clsx";
import { motion } from "framer-motion";
import ModernPricingCard from "./ModernPricingCard";
import ModernPricingFeatureItem from "./ModernPricingFeatureItem";
import useShopplans from "app/configs/data/server-calls/shopplans/useShopPlans";

/**
 * The modern pricing page.
 */
function ModernPricingPage() {
  const { data: merchantPlans } = useShopplans();

  const [period, setPeriod] = useState("month");
  const container = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 100 },
    show: { opacity: 1, y: 0 },
  };

  // console.log("merchantsPLANS", merchantPlans?.data?.data)
  return (
    <div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
      <div className="relative overflow-hidden px-24 pb-48 pt-32 sm:px-64 sm:pb-96 sm:pt-80">
        <svg
          className="pointer-events-none absolute inset-0 -z-1"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: "divider" }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <div className="flex flex-col items-center">
          {/* <motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0.05 } }}
					>
						<h2 className="text-xl font-semibold">PRICING</h2>
					</motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          >
            <div className="mt-4 text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-7xl">
              Take control of your productivity
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15 } }}
          >
            <Typography
              className="mt-12 text-center tracking-tight sm:text-2xl"
              color="text.secondary"
            >
              Start small and free, upgrade as you go.
              <br />
              Take control of everything.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
          >
            <Box
              className="mt-32 flex items-center overflow-hidden rounded-full p-2 sm:mt-64"
              sx={{
                backgroundColor: (theme) =>
                  darken(theme.palette.background.default, 0.05),
              }}
            >
              <Box
                component="button"
                className={clsx(
                  "h-40 cursor-pointer items-center rounded-full px-16 font-medium",
                  period === "year" && "shadow"
                )}
                onClick={() => setPeriod("year")}
                sx={{
                  backgroundColor: period === "year" ? "background.paper" : "",
                }}
                type="button"
              >
                Percentage(%) commission billing
              </Box>

              <Box
                component="button"
                className={clsx(
                  "h-40 cursor-pointer items-center rounded-full px-16 font-medium",
                  period === "month" && "shadow"
                )}
                onClick={() => setPeriod("month")}
                sx={{
                  backgroundColor: period === "month" ? "background.paper" : "",
                }}
                type="button"
              >
                Negotiated commission billing
              </Box>
            </Box>
          </motion.div>
        </div>

        <div className="mt-40 flex justify-center sm:mt-80">
          <div className="w-full max-w-sm md:max-w-7xl">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-24 lg:grid-cols-3 lg:gap-y-0"
            >
              {merchantPlans?.data?.merchantPlans?.length > 0 ? (
                merchantPlans?.data?.merchantPlans?.map((plan) => (
                  <motion.div variants={item} key={plan?._id}>
                    <ModernPricingCard
                      period={period}
                      isPopular={plan?.isMostPreferred}
                      accountId={plan?.id}
                      title={plan?.plansname}
                      subtitle={plan?.planinfo}
                      yearlyPrice={plan?.percetageCommissionCharge}
                      monthlyPrice={plan?.percetageCommissionCharge}
                      buttonTitle="Get Started"
                      details={
                        <div className="mt-48 flex flex-col">
                          <Typography className="font-semibold">
                            Core features, including:
                          </Typography>
                          <div className="mt-16 space-y-8">
                            <div className="flex">
                              <FuseSvgIcon className="text-green-600" size={20}>
                                heroicons-solid:check
                              </FuseSvgIcon>
                              <Typography className="ml-2 leading-5">
                                <b>{plan?.numberofproducts}</b> products initial
                                list
                              </Typography>
                            </div>

                            <div className="flex">
                              <FuseSvgIcon className="text-green-600" size={20}>
                                heroicons-solid:check
                              </FuseSvgIcon>
                              <Typography className="ml-2 leading-5">
                                Analytics : {plan?.dashboardandanalytics}
                              </Typography>
                            </div>

                            <div className="flex">
                              <FuseSvgIcon className="text-green-600" size={20}>
                                heroicons-solid:check
                              </FuseSvgIcon>
                              <Typography className="ml-2 leading-5">
                                24/6 Support : {plan?.dashboardandanalytics}{" "}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </motion.div>
                ))
              ) : (
                <>
                  <span>No merchant plan yet</span>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Paper className="flex flex-col items-center px-24 py-40 sm:px-64 sm:pb-80 sm:pt-72">
        <div className="w-full max-w-7xl">
          <div>
            <Typography className="text-4xl font-extrabold leading-tight tracking-tight">
              Everything you need to run your buiness digitally and efficiently
            </Typography>
            <Typography
              className="mt-2 max-w-xl text-xl"
              color="text.secondary"
            >
              Start managing your business using our tailored CMS tools, be
              efficient, spend less time with managinging details of your
              business, focus more on making business sales
            </Typography>
          </div>
          <div className="mt-48 grid w-full grid-cols-1 gap-x-24 gap-y-48 sm:mt-64 sm:grid-cols-2 lg:grid-cols-3 lg:gap-64">
            <ModernPricingFeatureItem
              icon="heroicons-outline:pencil-alt"
              title="Create and Manage Assets"
              subtitle="Create and manage your assets , upload images via drag drop, select appropriate categories,
							  via our interactive forms and more."
            />
            <ModernPricingFeatureItem
              icon="heroicons-outline:filter"
              title="Search and Filter Aggregate Orders"
              subtitle="Search and filter within our aggregate orders available, to take advantage of existing pre-orders
							of large merchandise."
            />
            <ModernPricingFeatureItem
              icon="heroicons-outline:refresh"
              title="Real Time Updates"
              subtitle="Real time updates that doesn't require page reload. Lean back and watch the changes
                happen in real time."
            />
            <ModernPricingFeatureItem
              icon="heroicons-outline:tag"
              title="24/7 Support and Information Sharing"
              subtitle="Get in touch with our support desk anywhere along the line, wherever you feel stocked."
            />

            <ModernPricingFeatureItem
              icon="heroicons-outline:chart-square-bar"
              title="Simple Analytics"
              subtitle="Simple analytics to give you real time status of your business. Coinscise and coherent analytic results with
                less ambiguity."
            />
          </div>
        </div>
      </Paper>
      <Box
        sx={{ backgroundColor: "primary.main", color: "primary.contrastText" }}
        className="px-24 py-40 sm:px-64 sm:py-48"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
          <Typography className="text-3xl font-extrabold leading-6 sm:text-5xl sm:leading-10">
            Boost your productivity.
          </Typography>
          <Typography
            className="mt-8 text-3xl font-extrabold leading-6 sm:text-5xl sm:leading-10"
            color="text.secondary"
          >
            Start using Africanshops today.
          </Typography>
          <Button
            className="mt-32 px-48 text-lg"
            size="large"
            color="secondary"
            variant="contained"
          >
            Sign up for free
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default ModernPricingPage;
