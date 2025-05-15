import { useList } from '@pankod/refine-core'
import { AgentCard } from 'components'

import { Box, Typography } from '@mui/material'

const Agents = () => {
  const { data, isLoading, isError } = useList({ resource: 'users' })

  const allAgents = data?.data ?? []

  if (isLoading) return <div>loading...</div>
  if (isError) return <div>error...</div>

  return (
    <Box>
      <Typography
        fontSize={25}
        fontWeight={700}
        color={(theme) => theme.palette.text.primary}
      >
        Agents List
      </Typography>

      <Box
        mt="20px"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        {allAgents.map((agent) => (
          <AgentCard
            key={agent._id}
            id={agent._id}
            name={agent.name}
            email={agent.email}
            avatar={agent.avatar}
            noOfProperties={agent.allProperties.length}
          />
        ))}
      </Box>
    </Box>
  )
}

export default Agents
