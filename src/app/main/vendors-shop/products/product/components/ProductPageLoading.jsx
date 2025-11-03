import { Box, Typography, alpha, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";

// Keyframes for animations
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.95);
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  padding: theme.spacing(4),
  animation: `${fadeIn} 0.3s ease-in`,
}));

const LogoCircle = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const SpinnerRing = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  border: `3px solid transparent`,
  borderTopColor: theme.palette.primary.main,
  borderRightColor: theme.palette.secondary.main,
  animation: `${rotate} 1.5s linear infinite`,
}));

const InnerCircle = styled(Box)(({ theme }) => ({
  width: '90px',
  height: '90px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `inset 0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 800,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.5px',
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2),
  fontSize: '0.95rem',
  fontWeight: 500,
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const DotsContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginTop: '16px',
});

const Dot = styled(Box)(({ theme, delay }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  animation: `${pulse} 1.4s ease-in-out ${delay}s infinite`,
}));

const ShimmerBar = styled(Box)(({ theme }) => ({
  width: '200px',
  height: '4px',
  marginTop: theme.spacing(3),
  borderRadius: '2px',
  background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.3)} 50%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
  backgroundSize: '1000px 100%',
  animation: `${shimmer} 2s infinite linear`,
}));

/**
 * Custom loading component with AfricanShops branding
 * Features a pulsing circular logo with rotating rings
 */
function ProductPageLoading({ message = "Loading product information..." }) {
  return (
    <LoadingContainer>
      <LogoCircle>
        <SpinnerRing />
        <SpinnerRing sx={{ animationDelay: '-0.5s', opacity: 0.6 }} />
        <InnerCircle>
          <LogoText>
            AS
          </LogoText>
        </InnerCircle>
      </LogoCircle>

      <LoadingText variant="body1">
        {message}
      </LoadingText>

      <DotsContainer>
        <Dot delay={0} />
        <Dot delay={0.2} />
        <Dot delay={0.4} />
      </DotsContainer>

      <ShimmerBar />
    </LoadingContainer>
  );
}

export default ProductPageLoading;
