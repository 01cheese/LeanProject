import { useGetIdentity, useOne } from '@pankod/refine-core'
import { Profile } from 'components'
import InviteNotifications from '../components/Notifications/InviteNotifications'

const MyProfile = () => {
  const { data: user } = useGetIdentity()
  const { data, isLoading, isError } = useOne({
    resource: 'users',
    id: user?.userid,
  })

  const myProfile = data?.data ?? []

  if (isLoading) return <div>loading...</div>
  if (isError) return <div>error...</div>

  return (
    <>


      <Profile
        type="My"
        name={myProfile.name}
        email={myProfile.email}
        avatar={myProfile.avatar}
        properties={myProfile.allProperties}

      />
      <InviteNotifications userId={user?.userid} />
    </>

  )
}

export default MyProfile
