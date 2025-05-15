import { Box, Stack, Typography, useTheme } from '@pankod/refine-mui'

import ReactApexChart from 'react-apexcharts'

import { ArrowCircleUpRounded } from '@mui/icons-material'

import { TotalRevenueOptions, TotalRevenueSeries } from './chart.config'

const TotalRevenue = () => {
  const theme = useTheme()
  const textColor = theme.palette.text.secondary

  const xaxisOptions = {
    labels: {
      style: {
        colors: [
          textColor,
          textColor,
          textColor,
          textColor,
          textColor,
          textColor,
          textColor,
        ],
      },
    },
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  }

  const yaxisOptions = {
    labels: {
      style: {
        colors: [
          textColor,
          textColor,
          textColor,
          textColor,
          textColor,
          textColor,
        ],
      },
    },
    title: {
      text: '$ (thousands)',
      style: { color: textColor },
    },
  }

  return (
    <Box
      p={4}
      flex={1}
      bgcolor={(theme) => theme.palette.background.paper}
      id="chart"
      flexDirection="column"
      borderRadius="15px"
    >
      <Typography
        fontSize={18}
        fontWeight={600}
        color={(theme) => theme.palette.text.primary}
      >
        Total Revenue
      </Typography>

      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        <Typography
          fontSize={28}
          fontWeight={700}
          color={(theme) => theme.palette.text.primary}
        >
          $236,535
        </Typography>

        <Stack direction="row" alignItems="center" gap={1}>
          <ArrowCircleUpRounded sx={{ fontSize: 25, color: '#475be81' }} />
          <Stack>
            <Typography fontSize={15} color="#475be8">
              0.8%
            </Typography>
            <Typography
              fontSize={12}
              color={(theme) => theme.palette.text.secondary}
            >
              Than Last Month
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <ReactApexChart
        series={TotalRevenueSeries}
        type="bar"
        height={310}
        options={{
          ...TotalRevenueOptions,
          legend: {
            ...TotalRevenueOptions.legend,
            labels: {
              colors: [textColor],
            },
          },
          xaxis: xaxisOptions,
          yaxis: yaxisOptions,
        }}
      />
    </Box>
  )
}

export default TotalRevenue
