import { useGetIdentity, useCustom } from '@pankod/refine-core'
import { AgentCard } from 'components'
import { Box, Typography } from '@mui/material'

const Agents = () => {
  const { data: currentUser, isLoading: loadingUser } = useGetIdentity();

const userId = currentUser?._id;

const { data, isLoading, isError } = useCustom({
  url: userId ? `/lean/agents/${userId}` : "",
  method: 'get',
  queryOptions: {
    enabled: !!userId, // 🔥 ключевой момент
  }
});

if (loadingUser || !userId) {
  return <div>🔄 Завантаження користувача...</div>
}

if (isLoading) return <div>🔄 Завантаження агентів...</div>
if (isError) return <div>❌ Помилка при отриманні агентів</div>

  const agents = data?.data ?? []

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700}>
        Люди, з якими ти працюєш
      </Typography>

      <Box mt="20px" sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {agents.map((agent) => (
          <AgentCard
            key={agent._id}
            id={agent._id}
            name={agent.name}
            email={agent.email}
            avatar={agent.avatar}
            noOfProperties={agent.allProperties?.length ?? 0}
          />
        ))}
      </Box>
    </Box>
  )
}

export default Agents
