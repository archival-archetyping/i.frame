import React, {useRef} from 'react'
import { useHistory } from 'react-router-dom'
import tw, {styled} from 'twin.macro'
import { ButtonBlock } from "../components/Button";
import {fetchEnter, fetchLoginAdmin} from "../hooks/api";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {deviceIdState, iconIdState, keyColorIdState} from "../store/app";
import Swal from "sweetalert2";
import shortId from 'shortid'
import {useCollection} from "react-firebase-hooks/firestore";
import firebase, {collectionOptions} from "../configs/firebase";
import {getDocuments} from "../util";
import {getRandomIcon} from "../components/Icon";

const Container = tw.div`relative w-full h-full px-7 pb-40 md:pb-10`
const LoginContainer = styled.div(() => [
  tw`absolute top-40 left-1/2 w-8/12`,
  `transform: translateX(-50%);`
])
const AdminLabel = tw.p`w-3/12`
const AdminIdInput = tw.input`w-9/12 h-9 rounded bg-transparent border border-gray-500 px-2`
const AdminPassInput = tw.input`w-9/12 h-9 rounded bg-transparent border border-gray-500 px-2`
const LogoutContainer = styled.div(() => [
  tw`absolute top-40 left-1/2 w-8/12`,
  `transform: translateX(-50%);`
])
const LogoutLabel = tw.div`text-sm text-key-orange text-center`

const Login = () => {
  const history = useHistory()
  const keyColorId = useRecoilValue(keyColorIdState)
  const [deviceId, setDeviceId] = useRecoilState(deviceIdState)
  const setIconId = useSetRecoilState(iconIdState)
  const $inputAdminId = useRef(null)
  const $inputAdminPass = useRef(null)
  const [userCollection] = useCollection(firebase.collection('user'), collectionOptions)
  const [adminCollection] = useCollection(firebase.collection('registered'), collectionOptions)
  const users = getDocuments(userCollection)
  const admins = getDocuments(adminCollection)
  const isLogin = users && users.filter(user => user.device_id === deviceId)[0]?.registered_id
  const admin_user = isLogin && admins && admins.filter(admin => admin.id === Number(isLogin))[0]
  const setNewDeviceId = () => {
    const uuid = shortId.generate()
    localStorage.setItem('deviceId', uuid)
    setDeviceId(uuid)
    return uuid
  }
  const setNewIconId = () => {
    const random_id = getRandomIcon().id
    localStorage.setItem('iconId', String(random_id))
    setIconId(random_id)
    return random_id
  }
  const handleLogin = async () => {
    if (
      $inputAdminId.current.value.length > 0 &&
      $inputAdminPass.current.value.length > 0
    ) {
      const new_device_id = setNewDeviceId()
      const result_enter = await fetchEnter(new_device_id, 1, 1)
      if (result_enter.is_success) {
        const result_login = await fetchLoginAdmin(new_device_id, $inputAdminId.current.value, $inputAdminPass.current.value)
        if (result_login?.is_success) {
          localStorage.setItem('isAdmin', String(true))
          Swal.fire({ text: 'ログインしました' })
        }
      }
    }
  }
  const handleLogout = async () => {
    const new_device_id = setNewDeviceId()
    const new_icon_id = setNewIconId()
    localStorage.removeItem('isAdmin')
    await fetchEnter(new_device_id, new_icon_id, keyColorId)
  }
  return (
    <Container>
      {
        !isLogin ? (
          <LoginContainer>
            <div>
              <div className="flex justify-between items-center">
                <AdminLabel>ID: </AdminLabel>
                <AdminIdInput ref={$inputAdminId} />
              </div>
              <div className="mt-6 flex justify-between items-center">
                <AdminLabel>PASS: </AdminLabel>
                <AdminPassInput ref={$inputAdminPass} />
              </div>
            </div>
            <div className="flex justify-center mt-10">
              <ButtonBlock onClick={handleLogin}>Login</ButtonBlock>
            </div>
          </LoginContainer>
        ) : (
          <LogoutContainer>
            { admin_user && (
              <LogoutLabel>
                <span className="block text-lg font-bold">{admin_user.name_ja}</span>
                <span>としてログインしています</span>
              </LogoutLabel>
            )}
            <div className="flex justify-center mt-10">
              <ButtonBlock onClick={handleLogout}>Logout</ButtonBlock>
            </div>
            <div className="flex justify-center mt-10">
              <ButtonBlock onClick={() => history.push('/')}>Goto Home</ButtonBlock>
            </div>
          </LogoutContainer>
        )
      }
    </Container>
  )
}

export default Login
