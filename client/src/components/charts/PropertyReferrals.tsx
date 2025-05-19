import { Box, Stack, Typography } from '@pankod/refine-mui'
import { propertyReferralsInfo } from 'constants/index'

interface ProgressBarProps {
  title: string
  percentage: number
  color: string
}

const ProgressBar = ({ title, percentage, color }: ProgressBarProps) => (
  <Box width="100%">
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography
        fontSize={16}
        fontWeight={500}
        color={(theme) => theme.palette.text.primary}
      >
        {title}
      </Typography>
      <Typography
        fontSize={16}
        fontWeight={500}
        color={(theme) => theme.palette.text.primary}
      >
        {percentage}%
      </Typography>
    </Stack>

    <Box
      mt={2}
      position="relative"
      width="100%"
      height="8px"
      borderRadius={1}
      bgcolor="#e4e8ef"
    >
      <Box
        width={`${percentage}%`}
        height="100%"
        bgcolor={color}
        position="absolute"
      />
    </Box>
  </Box>
)

const PropertyReferrals = () => {
  return (
    <Box
      p={4}
      bgcolor={(theme) => theme.palette.background.paper}
      id="chart"
      minWidth={490}
      display="flex"
      flexDirection="column"
      borderRadius="15px"
    >
      <Typography
        fontSize={18}
        fontWeight={600}
        color={(theme) => theme.palette.text.primary}
      >
        Property Referals
      </Typography>

      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        {propertyReferralsInfo.map((bar) => (
          <ProgressBar key={bar.title} {...bar} />
        ))}
      </Stack>
    </Box>
  )
}

export default PropertyReferrals
