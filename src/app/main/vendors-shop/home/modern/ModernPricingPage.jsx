import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import useShopplans from 'app/configs/data/server-calls/shopplans/useShopPlans';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import ModernPricingFeatureItem from './ModernPricingFeatureItem';
import ModernPricingCard from './ModernPricingCard';

/**
 * AfricanShops Modern Pricing Page - Redesigned for Production
 * Compelling, conversion-focused pricing with gradient design
 */
function ModernPricingPage() {
	const { data: merchantPlans } = useShopplans();
	const [period, setPeriod] = useState('month');

	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
			{/* Header Section with Gradient Background */}
			<Box
				className="relative overflow-hidden px-24 pb-64 pt-48 sm:px-64 sm:pb-80 sm:pt-64"
				sx={{
					background: 'linear-gradient(180deg, transparent 0%, rgba(255, 107, 53, 0.03) 100%)'
				}}
			>
				<div className="flex flex-col items-center">
					{/* Section Badge */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<Chip
							label="FLEXIBLE PRICING"
							size="medium"
							sx={{
								backgroundColor: alpha('#FF6B35', 0.1),
								color: '#FF6B35',
								fontWeight: 700,
								fontSize: '0.75rem',
								letterSpacing: '0.5px',
								mb: 3
							}}
						/>
					</motion.div>

					{/* Main Heading */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
					>
						<Typography className="mt-16 text-center text-40 font-black leading-tight tracking-tight sm:text-56">
							Choose Your Perfect Plan
						</Typography>
					</motion.div>

					{/* Subheading */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.15 }}
					>
						<Typography
							className="mt-16 max-w-2xl text-center text-18 tracking-normal sm:text-20"
							color="text.secondary"
						>
							Start selling for free. Scale with confidence. Only pay when you earn.
							<br />
							No hidden fees, no surprises.
						</Typography>
					</motion.div>

					{/* Billing Toggle */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="mt-48"
					>
						<Box
							className="flex items-center overflow-hidden rounded-full p-6"
							sx={{
								background:
									'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 127, 0, 0.1) 100%)',
								border: '2px solid',
								borderColor: alpha('#FF6B35', 0.2),
								backdropFilter: 'blur(10px)'
							}}
						>
							<Box
								component="button"
								className={clsx(
									'h-48 cursor-pointer items-center rounded-full px-24 font-bold text-15 transition-all duration-300',
									period === 'year' && 'shadow-lg'
								)}
								onClick={() => setPeriod('year')}
								sx={{
									background:
										period === 'year'
											? 'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)'
											: 'transparent',
									color: period === 'year' ? 'white' : 'text.primary',
									'&:hover': {
										background:
											period === 'year'
												? 'linear-gradient(135deg, #F77F00 0%, #FF6B35 100%)'
												: alpha('#FF6B35', 0.1)
									}
								}}
								type="button"
							>
								Percentage (%) Commission
							</Box>

							<Box
								component="button"
								className={clsx(
									'h-48 cursor-pointer items-center rounded-full px-24 font-bold text-15 transition-all duration-300',
									period === 'month' && 'shadow-lg'
								)}
								onClick={() => setPeriod('month')}
								sx={{
									background:
										period === 'month'
											? 'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)'
											: 'transparent',
									color: period === 'month' ? 'white' : 'text.primary',
									'&:hover': {
										background:
											period === 'month'
												? 'linear-gradient(135deg, #F77F00 0%, #FF6B35 100%)'
												: alpha('#FF6B35', 0.1)
									}
								}}
								type="button"
							>
								Negotiated Commission
							</Box>
						</Box>
					</motion.div>
				</div>
			</Box>

			{/* Pricing Cards Section */}
			<div className="relative px-24 pb-64 sm:px-64">
				<div className="mx-auto w-full max-w-7xl">
					<motion.div
						variants={container}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
						className="grid grid-cols-1 gap-32 md:grid-cols-2 lg:grid-cols-3"
					>
						{merchantPlans?.data?.merchantPlans?.length > 0 ? (
							merchantPlans?.data?.merchantPlans?.map((plan, index) => (
								<motion.div
									variants={item}
									key={plan?._id}
								>
									<ModernPricingCard
										period={period}
										isPopular={plan?.isMostPreferred}
										accountId={plan?.id}
										title={plan?.plansname}
										subtitle={plan?.planinfo}
										yearlyPrice={plan?.percetageCommissionCharge}
										monthlyPrice={plan?.percetageCommissionCharge}
										buttonTitle="Get Started"
										index={index}
										details={
											<div className="mt-40 flex flex-col">
												<Typography className="font-bold text-16 mb-16">
													Everything you need to succeed:
												</Typography>
												<div className="space-y-12">
													<div className="flex items-start gap-12">
														<Box
															sx={{
																width: 20,
																height: 20,
																borderRadius: '6px',
																background:
																	'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																flexShrink: 0,
																marginTop: '2px'
															}}
														>
															<FuseSvgIcon
																size={12}
																sx={{ color: 'white' }}
															>
																heroicons-solid:check
															</FuseSvgIcon>
														</Box>
														<Typography className="text-15 leading-relaxed">
															<b>{plan?.numberofproducts}</b> products to start
														</Typography>
													</div>

													<div className="flex items-start gap-12">
														<Box
															sx={{
																width: 20,
																height: 20,
																borderRadius: '6px',
																background:
																	'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																flexShrink: 0,
																marginTop: '2px'
															}}
														>
															<FuseSvgIcon
																size={12}
																sx={{ color: 'white' }}
															>
																heroicons-solid:check
															</FuseSvgIcon>
														</Box>
														<Typography className="text-15 leading-relaxed">
															Advanced Analytics Dashboard
														</Typography>
													</div>

													<div className="flex items-start gap-12">
														<Box
															sx={{
																width: 20,
																height: 20,
																borderRadius: '6px',
																background:
																	'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																flexShrink: 0,
																marginTop: '2px'
															}}
														>
															<FuseSvgIcon
																size={12}
																sx={{ color: 'white' }}
															>
																heroicons-solid:check
															</FuseSvgIcon>
														</Box>
														<Typography className="text-15 leading-relaxed">
															24/7 Priority Support
														</Typography>
													</div>

													<div className="flex items-start gap-12">
														<Box
															sx={{
																width: 20,
																height: 20,
																borderRadius: '6px',
																background:
																	'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																flexShrink: 0,
																marginTop: '2px'
															}}
														>
															<FuseSvgIcon
																size={12}
																sx={{ color: 'white' }}
															>
																heroicons-solid:check
															</FuseSvgIcon>
														</Box>
														<Typography className="text-15 leading-relaxed">
															Secure Payment Processing
														</Typography>
													</div>
												</div>
											</div>
										}
									/>
								</motion.div>
							))
						) : (
							<Box className="col-span-full text-center py-64">
								<FuseSvgIcon
									size={64}
									color="disabled"
								>
									heroicons-outline:inbox
								</FuseSvgIcon>
								<Typography
									className="mt-16 text-20 font-semibold"
									color="text.secondary"
								>
									No merchant plans available yet
								</Typography>
							</Box>
						)}
					</motion.div>
				</div>
			</div>

			{/* Features Section */}
			<Box
				className="px-24 py-64 sm:px-64 sm:py-80"
				sx={{
					background: 'linear-gradient(180deg, rgba(255, 107, 53, 0.02) 0%, transparent 100%)'
				}}
			>
				<div className="mx-auto w-full max-w-7xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-64"
					>
						<Chip
							label="POWERFUL FEATURES"
							size="medium"
							sx={{
								backgroundColor: alpha('#FF6B35', 0.1),
								color: '#FF6B35',
								fontWeight: 700,
								fontSize: '0.75rem',
								letterSpacing: '0.5px',
								mb: 3
							}}
						/>
						<Typography className="mt-16 text-36 sm:text-48 font-black leading-tight tracking-tight">
							Everything You Need to Succeed
						</Typography>
						<Typography
							className="mt-16 mx-auto max-w-3xl text-18 sm:text-20"
							color="text.secondary"
						>
							Our comprehensive suite of tools helps you manage, grow, and scale your business
							effortlessly
						</Typography>
					</motion.div>

					<div className="grid w-full grid-cols-1 gap-32 sm:grid-cols-2 lg:grid-cols-3">
						<ModernPricingFeatureItem
							icon="heroicons-outline:shopping-bag"
							title="Product Management"
							subtitle="Create and manage unlimited products with drag-and-drop image uploads, smart categorization, and inventory tracking."
						/>
						<ModernPricingFeatureItem
							icon="heroicons-outline:chart-bar"
							title="Real-Time Analytics"
							subtitle="Track sales, monitor performance, and make data-driven decisions with our powerful analytics dashboard."
						/>
						<ModernPricingFeatureItem
							icon="heroicons-outline:truck"
							title="Order Fulfillment"
							subtitle="Streamlined order processing with automated notifications, tracking, and seamless delivery management."
						/>
						<ModernPricingFeatureItem
							icon="heroicons-outline:credit-card"
							title="Secure Payments"
							subtitle="Accept payments confidently with our secure processing system. Withdraw earnings directly to your bank."
						/>
						<ModernPricingFeatureItem
							icon="heroicons-outline:support"
							title="24/7 Expert Support"
							subtitle="Get help whenever you need it. Our dedicated support team is available around the clock."
						/>
						<ModernPricingFeatureItem
							icon="heroicons-outline:sparkles"
							title="Marketing Tools"
							subtitle="Boost visibility with built-in marketing features, promotions, and customer engagement tools."
						/>
					</div>
				</div>
			</Box>

			{/* Final CTA Section */}
			<Box
				className="px-24 py-64 sm:px-64 sm:py-80"
				sx={{
					background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 50%, #FCBF49 100%)',
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				{/* Decorative Background */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.1,
						background: 'radial-gradient(circle at 30% 50%, white 0%, transparent 50%)'
					}}
				/>

				<div className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
					>
						<Typography
							className="text-40 font-black leading-tight sm:text-56"
							sx={{ color: 'white' }}
						>
							Ready to Grow Your Business?
						</Typography>
						<Typography
							className="mt-24 text-20 font-medium sm:text-24"
							sx={{ color: 'rgba(255, 255, 255, 0.95)' }}
						>
							Join thousands of successful merchants on <span className="font-black">AfricanShops</span>{' '}
							today.
						</Typography>
						<Typography
							className="mt-16 text-16 sm:text-18"
							sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
						>
							Start for free. No credit card required.
						</Typography>

						<Button
							component={Link}
							to="/sign-up"
							size="large"
							variant="contained"
							className="mt-48"
							sx={{
								backgroundColor: 'white',
								color: '#FF6B35',
								px: 6,
								py: 2,
								fontSize: '1.125rem',
								fontWeight: 700,
								borderRadius: '12px',
								textTransform: 'none',
								boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.9)',
									transform: 'translateY(-2px)',
									boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
								},
								transition: 'all 0.3s ease'
							}}
							endIcon={<FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>}
						>
							Start Selling for Free
						</Button>

						<Typography
							className="mt-24 text-14 font-medium"
							sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
						>
							Trusted by 1000+ merchants • 10,000+ products sold • 50,000+ happy customers
						</Typography>
					</motion.div>
				</div>
			</Box>
		</div>
	);
}

export default ModernPricingPage;

/* ========================================
   PREVIOUS VERSION - COMMENTED OUT
   ======================================== */

/*
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
            Start using <span className="text-amber-800">Africanshops</span> today.
          </Typography>
          <Button
            className="mt-32 px-48 text-lg bg-orange-700 hover:bg-orange-300"
            size="large"
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
*/
