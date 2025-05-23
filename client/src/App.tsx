import { Refine, AuthProvider } from '@pankod/refine-core'
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  ReadyPage,
  ErrorComponent,
} from '@pankod/refine-mui'
import routerProvider from '@pankod/refine-react-router-v6'
import dataProvider from '@pankod/refine-simple-rest'

import axios, { AxiosRequestConfig } from 'axios'
import { Title, Sider, Layout, Header } from 'components/layout'
import { ColorModeContextProvider } from 'contexts'
import { CredentialResponse } from 'interfaces/google'


import { CreateLeanProjectForm } from './components/lean/LeanProjectForm'
import { MyLeanProjects } from "./components/lean/MyLeanProjects";
import LeanProjectDetails from "./components/lean/LeanProjectDetails";


import {
  Login,
  Home,
  Agents,
  MyProfile,
  AgentProfile,
} from 'pages'
import { parseJwt } from 'utils/parse-jwt'

import React from 'react'

import {
  AccountCircleOutlined,
  ChatBubbleOutline,
  PeopleAltOutlined,
  StarOutlineRounded,
  VillaOutlined,
} from '@mui/icons-material'

const axiosInstance = axios.create()
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    }
  }

  return request
})

function App() {
  const authProvider: AuthProvider = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null

      if (profileObj) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture,
          }),
        })

        const data = await response.json()

        if (response.status === 200) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userid: data._id,
            }),
          )
        } else {
          return Promise.reject
        }
      }
      localStorage.setItem('token', `${credential}`)

      return Promise.resolve()
    },
    logout: () => {
      const token = localStorage.getItem('token')

      if (token && typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        axios.defaults.headers.common = {}
        window.google?.accounts.id.revoke(token, () => {
          return Promise.resolve()
        })
      }

      return Promise.resolve()
    },
    checkError: () => Promise.resolve(),
    checkAuth: async () => {
      const token = localStorage.getItem('token')

      if (token) {
        return Promise.resolve()
      }
      return Promise.reject()
    },

    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const user = localStorage.getItem('user')
      if (user) {
        return Promise.resolve(JSON.parse(user))
      }
    },
  }
  return (
    <ColorModeContextProvider>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />

      <RefineSnackbarProvider>
        <Refine
          dataProvider={dataProvider(`${process.env.REACT_APP_BACKEND_URL}` || '')}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          resources={[
            {
              name: "lean-projects",
              list: MyLeanProjects,
              create: CreateLeanProjectForm,
              show: LeanProjectDetails,
            },
            {
              name: 'agents',
              list: Agents,
              show: AgentProfile,
              icon: <PeopleAltOutlined />,
            },
            {
              name: 'my-profile',
              options: { label: 'My Profile' },
              list: MyProfile,
              icon: <AccountCircleOutlined />,
            },
          ]}
          Title={Title}
          Sider={Sider}
          Layout={Layout}
          Header={Header}
          routerProvider={routerProvider}
          authProvider={authProvider}
          LoginPage={Login}
          DashboardPage={Home}
        />
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  )
}

export default App
