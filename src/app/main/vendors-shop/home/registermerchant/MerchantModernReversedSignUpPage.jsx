import { motion, AnimatePresence } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { alpha, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useParams } from "react-router-dom";
import _ from "@lodash";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSingleShopplans } from "app/configs/data/server-calls/shopplans/useShopPlans";
import { useEffect, useMemo, useState } from "react";
import CountrySelect from "src/app/apselects/countryselect";
import {
  getLgaByStateId,
  getMarketsByLgaId,
  getStateByCountryId,
} from "app/configs/data/client/clientToApiRoutes";
import StateSelect from "src/app/apselects/stateselect";
import LgaSelect from "src/app/apselects/lgaselect";
import MarketSelect from "src/app/apselects/marketselect";
import TradehubSelect from "src/app/apselects/tradehubselect";
import { IconButton, InputAdornment, Paper, Chip, LinearProgress } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseUtils from "@fuse/utils/FuseUtils";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { firebaseApp } from "src/app/auth/services/firebase/initializeFirebase";
import { useShopSignUpWithOtp } from "app/configs/data/server-calls/useShops/useShopsQuery";
import {
  getMerchantSignUpToken,
  getResendMerchantSignUpOtp,
  removeMerchantSignUpToken,
  removeResendMerchantSignUpOtp,
  setResendMerchantSignUpOtp,
} from "app/configs/utils/authUtils";
import MerchantModernReversedActivatePage from "./MerchantModernReversedActivatePage";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import FuseLoading from "@fuse/core/FuseLoading";

/**
 * Form Validation Schema
 */
const schema = z
  .object({
    name: z.string().nonempty("You must enter your business/shop name"),
    shopemail: z
      .string()
      .email("You must enter a valid email")
      .nonempty("You must enter an email"),
    password: z
      .string()
      .nonempty("Please enter your password.")
      .min(8, "Password is too short - should be 8 chars minimum."),
    passwordConfirm: z.string().nonempty("Password confirmation is required"),
    acceptTermsConditions: z
      .boolean()
      .refine(
        (val) => val === true,
        "The terms and conditions must be accepted."
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

const defaultValues = {
  name: "",
  shopemail: "",
  referalCode: "",
  password: "",
  passwordConfirm: "",
  acceptTermsConditions: false,
  address: "",
  businessCountry: "",
  businezState: "",
  businezLga: "",
  tradehub: "",
  market: "",
  shopphone: "",
  verified: false,
  shopplan: "",
};

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  MOREINFO: 2,
  DESCRIPTION: 3,
};

const STEP_CONFIG = [
  {
    id: 0,
    title: "Account Details",
    subtitle: "Set up your business email and password",
    icon: "heroicons-outline:mail",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)"
  },
  {
    id: 1,
    title: "Business Location",
    subtitle: "Tell us where your business operates",
    icon: "heroicons-outline:location-marker",
    gradient: "linear-gradient(135deg, #F77F00 0%, #FCBF49 100%)"
  },
  {
    id: 2,
    title: "Additional Info",
    subtitle: "Help us set up your business profile",
    icon: "heroicons-outline:briefcase",
    gradient: "linear-gradient(135deg, #FCBF49 0%, #FF8C42 100%)"
  },
  {
    id: 3,
    title: "Terms & Finish",
    subtitle: "Review and complete your registration",
    icon: "heroicons-outline:check-circle",
    gradient: "linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)"
  }
];

/**
 * AfricanShops Merchant Registration - Redesigned for Production
 * Compelling, engaging, and professional merchant onboarding experience
 */
function MerchantModernReversedSignUpPage() {
  const clientSignUpData = getResendMerchantSignUpOtp();
  const remoteResponseToken = getMerchantSignUpToken();
  const routeParams = useParams();
  const { accountId } = routeParams;

  const {
    data: plan,
    isLoading: isLoadingPlan,
    isError: isErrorPlan,
  } = useSingleShopplans(accountId);

  const sigupMerchant = useShopSignUpWithOtp();

  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const location = watch("location");
  const businezState = watch("businezState");
  const businezLga = watch("businezLga");
  const market = watch("market");
  const tradehub = watch("tradehub");
  const images = watch("images");

  const shopregistry = {
    ...getValues(),
    businessCountry: getValues()?.location?.id,
    businezState: getValues()?.businezState?.id,
    businezLga: getValues()?.businezLga?.id,
    tradehub: getValues()?.tradehub?.id,
    market: getValues()?.market?.id,
    shopplan: accountId,
  };

  function onSubmit() {
    if (plan?.data?.merchantPlan?.isInOperation) {
      if (images?.length > 0) {
        const fileName = new Date().getTime() + images[0]?.id;
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `/shopbanners/${fileName}`);
        const uploadTask = uploadString(storageRef, images[0]?.url, "data_url");

        uploadTask.then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            setValue("coverimage", downloadURL);
            sigupMerchant.mutate(shopregistry);
          });
        });
      } else {
        sigupMerchant.mutate(shopregistry);
      }
    } else {
      toast.info("This selected account plan is not currently operational!");
    }
  }

  const resendOTP = () => {
    if (!clientSignUpData) {
      if (
        window.confirm("Some hitch occurred, restart the onboarding process?")
      ) {
        removeMerchantSignUpToken();
        removeResendMerchantSignUpOtp();
      }
    }
    sigupMerchant.mutate(clientSignUpData);
  };

  const [step, setStep] = useState(STEPS.CATEGORY);

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const [loading, setLoading] = useState(false);
  const [blgas, setBlgas] = useState([]);
  const [markets, setBMarkets] = useState([]);
  const [stateData, setStateData] = useState([]);

  useEffect(() => {
    if (location?.id?.length > 0) {
      findStatesByCountry(location?.id);
    }

    if (getValues()?.businezState?.id?.length > 0) {
      getLgasFromState(getValues()?.businezState?.id);
    }

    if (getValues()?.businezLga?.id?.length > 0) {
      getMarketsFromLgaId(getValues()?.businezLga?.id);
    }
  }, [
    location?.id,
    businezState?.id,
    businezLga?.id,
    sigupMerchant?.isSuccess,
  ]);

  useEffect(() => {
    if (sigupMerchant?.isSuccess) {
      if (shopregistry?.businessCountry) {
        setResendMerchantSignUpOtp(shopregistry);
      }
      if (clientSignUpData?.businessCountry) {
        setResendMerchantSignUpOtp(clientSignUpData);
      }
    }
  }, [
    plan?.data?.merchantPlan?.plankey,
    sigupMerchant?.isSuccess,
    remoteResponseToken,
  ]);

  async function findStatesByCountry(countryId) {
    setLoading(true);
    const stateResponseData = await getStateByCountryId(countryId);
    if (stateResponseData) {
      setStateData(stateResponseData?.data?.states);
      setTimeout(() => setLoading(false), 250);
    }
  }

  async function getLgasFromState(sid) {
    setLoading(true);
    const responseData = await getLgaByStateId(sid);
    if (responseData) {
      setBlgas(responseData?.data?.lgas);
      setTimeout(() => setLoading(false), 250);
    }
  }

  async function getMarketsFromLgaId(lid) {
    if (lid) {
      setLoading(true);
      const responseData = await getMarketsByLgaId(lid);
      if (responseData) {
        setBMarkets(responseData?.data?.markets);
        setTimeout(() => setLoading(false), 250);
      }
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const progress = ((step + 1) / Object.keys(STEPS).length) * 100;

  // Step content components
  let bodyContent = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-24"
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Shop/Business Name"
            id="name"
            autoFocus
            type="name"
            error={!!errors.name}
            helperText={errors?.name?.message}
            variant="outlined"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FuseSvgIcon size={20} color="action">heroicons-outline:shopping-bag</FuseSvgIcon>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <Controller
        name="shopemail"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Shop/Business Email"
            type="email"
            error={!!errors.shopemail}
            helperText={errors?.shopemail?.message}
            variant="outlined"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FuseSvgIcon size={20} color="action">heroicons-outline:mail</FuseSvgIcon>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            helperText={errors?.password?.message || "Minimum 8 characters"}
            variant="outlined"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FuseSvgIcon size={20} color="action">heroicons-outline:lock-closed</FuseSvgIcon>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <Controller
        name="passwordConfirm"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Confirm Password"
            type="password"
            error={!!errors.passwordConfirm}
            helperText={errors?.passwordConfirm?.message}
            variant="outlined"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FuseSvgIcon size={20} color="action">heroicons-outline:lock-closed</FuseSvgIcon>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </motion.div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-24"
      >
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />

        {location?.id && (
          <StateSelect
            states={stateData}
            value={businezState}
            onChange={(value) => setCustomValue("businezState", value)}
          />
        )}

        {businezState?.id && (
          <LgaSelect
            blgas={blgas}
            value={businezLga}
            onChange={(value) => setCustomValue("businezLga", value)}
          />
        )}

        {businezState?.id && businezLga?.id && (
          <MarketSelect
            markets={markets}
            value={market}
            onChange={(value) => setCustomValue("market", value)}
          />
        )}

        {loading && (
          <Box className="flex items-center gap-12 p-16 rounded-lg" sx={{ backgroundColor: alpha('#FF6B35', 0.1) }}>
            <FuseSvgIcon size={20} sx={{ color: '#FF6B35' }}>heroicons-outline:refresh</FuseSvgIcon>
            <Typography className="text-14" sx={{ color: '#FF6B35' }}>Loading location data...</Typography>
          </Box>
        )}
      </motion.div>
    );
  }

  if (step === STEPS.MOREINFO) {
    bodyContent = (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-24"
      >
        <TradehubSelect
          value={tradehub}
          onChange={(value) => setCustomValue("tradehub", value)}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Business Address"
              id="address"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              error={!!errors.address}
              helperText={errors?.address?.message || "Enter your physical business location"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20} color="action">heroicons-outline:location-marker</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </motion.div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-24"
      >
        <Box
          className="p-24 rounded-xl"
          sx={{
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 127, 0, 0.05) 100%)',
            border: '1px solid',
            borderColor: alpha('#FF6B35', 0.2)
          }}
        >
          <Box className="flex items-start gap-16 mb-16">
            <FuseSvgIcon size={24} sx={{ color: '#FF6B35' }}>heroicons-solid:check-circle</FuseSvgIcon>
            <div>
              <Typography className="text-16 font-bold mb-8">Almost There!</Typography>
              <Typography className="text-14" color="text.secondary">
                Review your plan details and accept our terms to complete registration
              </Typography>
            </div>
          </Box>

          <Box className="mt-20 p-16 rounded-lg" sx={{ backgroundColor: 'white' }}>
            <Typography className="text-14 font-bold mb-8">
              Selected Plan: {plan?.data?.merchantPlan?.plansname}
            </Typography>
            <Typography className="text-13 mb-8" color="text.secondary">
              {plan?.data?.merchantPlan?.planinfo}
            </Typography>
            <Chip
              label={`${plan?.data?.merchantPlan?.percetageCommissionCharge}% Commission`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)',
                color: 'white',
                fontWeight: 700
              }}
            />
          </Box>
        </Box>

        <Controller
          name="acceptTermsConditions"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.acceptTermsConditions}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    sx={{
                      '&.Mui-checked': {
                        color: '#FF6B35',
                      },
                    }}
                  />
                }
                label={
                  <Typography className="text-14">
                    I agree to the{' '}
                    <Link to="/terms" className="text-orange-600 hover:underline font-medium">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-orange-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              <FormHelperText>
                {errors?.acceptTermsConditions?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
      </motion.div>
    );
  }

  if (isLoadingPlan) {
    return <FuseLoading />;
  }

  return (
    <div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-32">
      <Paper className="flex min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:shadow md:w-full md:max-w-6xl">
        {/* Left Side - Plan Info with Gradient */}
        <Box
          className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
          sx={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 50%, #FCBF49 100%)',
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

          <div className="relative z-10 w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Typography className="text-56 font-black leading-tight mb-16" sx={{ color: 'white' }}>
                Welcome to
                <br />
                AfricanShops
              </Typography>

              <Box className="mt-32 p-24 rounded-xl" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
                <Chip
                  label={plan?.data?.merchantPlan?.plansname || "Merchant Plan"}
                  sx={{
                    backgroundColor: 'white',
                    color: '#FF6B35',
                    fontWeight: 700,
                    mb: 2
                  }}
                />
                <Typography className="text-16 leading-relaxed" sx={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {plan?.data?.merchantPlan?.planinfo || "Join thousands of successful merchants growing their business with us"}
                </Typography>
              </Box>

              <Box className="mt-32 grid grid-cols-2 gap-16">
                {[
                  { icon: 'heroicons-outline:users', label: '1000+ Merchants' },
                  { icon: 'heroicons-outline:shopping-cart', label: '10K+ Products' },
                  { icon: 'heroicons-outline:truck', label: '50K+ Deliveries' },
                  { icon: 'heroicons-outline:support', label: '24/7 Support' }
                ].map((item, index) => (
                  <Box key={index} className="flex items-center gap-12">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FuseSvgIcon size={20} sx={{ color: 'white' }}>{item.icon}</FuseSvgIcon>
                    </Box>
                    <Typography className="text-14 font-medium" sx={{ color: 'white' }}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </div>
        </Box>

        {/* Right Side - Registration Form */}
        <>
          {!remoteResponseToken?.length > 0 ? (
            <Box className="w-full px-16 py-48 ltr:border-l-1 rtl:border-r-1 sm:w-auto sm:p-48 md:p-64">
              <div className="mx-auto w-full max-w-384 sm:mx-0 sm:w-384">
                {/* Logo */}
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-48"
                  src="assets/images/afslogo/afslogo.png"
                  alt="AfricanShops Logo"
                />

                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Typography className="mt-32 text-40 font-black leading-tight tracking-tight">
                    Create Your Account
                  </Typography>
                  <div className="mt-8 flex items-baseline gap-8">
                    <Typography color="text.secondary">Already have an account?</Typography>
                    <Link
                      className="font-medium"
                      to="/sign-in"
                      style={{ color: '#FF6B35' }}
                    >
                      Sign in
                    </Link>
                  </div>
                </motion.div>

                {plan?.data?.merchantPlan?.isInOperation ? (
                  <>
                    {/* Progress Indicator */}
                    <Box className="mt-40">
                      <Box className="flex items-center justify-between mb-16">
                        <Typography className="text-14 font-bold">
                          Step {step + 1} of {Object.keys(STEPS).length}
                        </Typography>
                        <Typography className="text-14 font-bold" sx={{ color: '#FF6B35' }}>
                          {Math.round(progress)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha('#FF6B35', 0.1),
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #FF6B35 0%, #F77F00 100%)',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    {/* Step Info Card */}
                    <Box
                      className="mt-24 p-20 rounded-xl"
                      sx={{
                        background: STEP_CONFIG[step].gradient,
                        color: 'white'
                      }}
                    >
                      <Box className="flex items-center gap-12 mb-8">
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FuseSvgIcon size={18} sx={{ color: 'white' }}>
                            {STEP_CONFIG[step].icon}
                          </FuseSvgIcon>
                        </Box>
                        <Typography className="text-18 font-bold">
                          {STEP_CONFIG[step].title}
                        </Typography>
                      </Box>
                      <Typography className="text-13" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {STEP_CONFIG[step].subtitle}
                      </Typography>
                    </Box>

                    {/* Form */}
                    <form
                      name="registerForm"
                      noValidate
                      className="mt-32 flex w-full flex-col justify-center"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <AnimatePresence mode="wait">
                        {bodyContent}
                      </AnimatePresence>

                      {/* Navigation Buttons */}
                      <Box className="mt-40 flex gap-16">
                        {step > STEPS.CATEGORY && (
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={onBack}
                            fullWidth
                            sx={{
                              borderColor: '#FF6B35',
                              color: '#FF6B35',
                              fontWeight: 700,
                              '&:hover': {
                                borderColor: '#F77F00',
                                backgroundColor: alpha('#FF6B35', 0.05)
                              }
                            }}
                            startIcon={<FuseSvgIcon size={20}>heroicons-outline:arrow-left</FuseSvgIcon>}
                          >
                            Back
                          </Button>
                        )}

                        {step < STEPS.DESCRIPTION ? (
                          <Button
                            variant="contained"
                            size="large"
                            onClick={onNext}
                            fullWidth
                            sx={{
                              background: 'linear-gradient(90deg, #FF6B35 0%, #F77F00 100%)',
                              color: 'white',
                              fontWeight: 700,
                              '&:hover': {
                                background: 'linear-gradient(90deg, #F77F00 0%, #FF6B35 100%)',
                              }
                            }}
                            endIcon={<FuseSvgIcon size={20}>heroicons-outline:arrow-right</FuseSvgIcon>}
                          >
                            Continue
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="large"
                            type="submit"
                            fullWidth
                            disabled={
                              _.isEmpty(dirtyFields) ||
                              !isValid ||
                              sigupMerchant?.isLoading
                            }
                            sx={{
                              background: 'linear-gradient(90deg, #FF6B35 0%, #F77F00 100%)',
                              color: 'white',
                              fontWeight: 700,
                              '&:hover': {
                                background: 'linear-gradient(90deg, #F77F00 0%, #FF6B35 100%)',
                              },
                              '&:disabled': {
                                background: alpha('#FF6B35', 0.3),
                                color: 'rgba(255, 255, 255, 0.5)'
                              }
                            }}
                            endIcon={
                              sigupMerchant?.isLoading ? (
                                <FuseSvgIcon size={20} className="animate-spin">heroicons-outline:refresh</FuseSvgIcon>
                              ) : (
                                <FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
                              )
                            }
                          >
                            {sigupMerchant?.isLoading ? 'Creating Account...' : 'Create Free Account'}
                          </Button>
                        )}
                      </Box>

                      {/* Trust Badge */}
                      <Box className="mt-24 flex items-center justify-center gap-8">
                        <FuseSvgIcon size={16} sx={{ color: '#10B981' }}>
                          heroicons-solid:shield-check
                        </FuseSvgIcon>
                        <Typography className="text-12" sx={{ color: '#10B981', fontWeight: 600 }}>
                          Your data is secure and encrypted
                        </Typography>
                      </Box>
                    </form>
                  </>
                ) : (
                  <Box className="mt-32 p-32 rounded-xl text-center" sx={{ backgroundColor: alpha('#FF6B35', 0.1) }}>
                    <FuseSvgIcon size={48} sx={{ color: '#FF6B35', mb: 2 }}>
                      heroicons-outline:exclamation
                    </FuseSvgIcon>
                    <Typography className="text-18 font-bold mb-8">
                      Plan Not Available
                    </Typography>
                    <Typography color="text.secondary">
                      This account plan is currently not operational. Please choose another plan.
                    </Typography>
                    <Button
                      component={Link}
                      to="/pricing"
                      variant="contained"
                      className="mt-24"
                      sx={{
                        background: 'linear-gradient(90deg, #FF6B35 0%, #F77F00 100%)',
                        color: 'white'
                      }}
                    >
                      View Other Plans
                    </Button>
                  </Box>
                )}
              </div>
            </Box>
          ) : (
            <MerchantModernReversedActivatePage resendOTP={resendOTP} />
          )}
        </>
      </Paper>
    </div>
  );
}

export default MerchantModernReversedSignUpPage;
