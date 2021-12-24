import React, { useCallback, useRef } from 'react'
import {useSetRecoilState, useRecoilValue, useRecoilState} from 'recoil'
import {APP_ID, clientState, joinedState, userMuteState} from "../../store/agora";
import {channelNameState, controllerTabSelectedState, deviceIdState, keyColorIdState} from "../../store/app";
import {fetchCreateRoom, fetchCreateVoiceToken, fetchJoinRoom, fetchToggleVoice} from "../../hooks/api";
import tw, {styled} from 'twin.macro'
import { useI18n } from "use-mini18n"
import {KEY_COLORS} from "../../configs/color";
import {event} from "../../configs/gtag";

const Container = tw.div`mt-10`
const InputRoomName = tw.input`w-full border-b bg-transparent focus:outline-none h-8 mt-2 text-lg`
const ButtonWrapper = tw.div`flex justify-end mt-4`
const ButtonCreateAndEnterRoom = styled.button(({keyColorId}) => [
  tw`font-bold text-lg`,
  `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
])

export const CardCreateRoom = ({handleLeave, handleLoading}) => {
  const [channelName, setChannelName] = useRecoilState(channelNameState)
  const keyColorId = useRecoilValue(keyColorIdState)
  const setSelectTab = useSetRecoilState(controllerTabSelectedState)
  const setJoined = useSetRecoilState(joinedState)
  const setMuted = useSetRecoilState(userMuteState)
  const client = useRecoilValue(clientState)
  const deviceId = useRecoilValue(deviceIdState)
  const $inputRoomName = useRef(null)
  const { t } = useI18n()
  const type = 'anonymous'
  const limit = 999
  const handleInputName = (event) => setChannelName(event.target.value || '')

  const handleCreateRoom = useCallback(async () => {
    if ($inputRoomName.current.value.length > 0) {
      handleLeave()
      handleLoading(true)
      fetchCreateRoom(type, limit, $inputRoomName.current.value, true, true)
        .then(async (create_result) => {
          const { id } = create_result
          const token_result = await fetchCreateVoiceToken(id, deviceId)
          if (token_result && token_result.is_success) {
            const { token } = token_result
            const uid = await client.join(APP_ID, id, token)
            if (uid) {
              const join_result = await fetchJoinRoom(id, deviceId, uid)
              const mute_result = await fetchToggleVoice(deviceId, true)
              if (mute_result && mute_result.is_success) {
                setMuted(true)
              }
              if (join_result && join_result.is_success) {
                const action = 'create_new_chat'
                const label = localStorage.getItem('isAdmin') ? 'registered' : 'anonymous'
                event({action, label, value: id})
                setJoined(id)
                setSelectTab('chat')
                handleLoading(false)
                setChannelName('')
              }
            }
          } else {
            handleLoading(false)
            window.alert('エラーしました')
          }
        })
        .catch(e => {
          handleLoading(false)
          console.log(e)
        })
    } else {
      handleLoading(false)
    }

  }, [client, deviceId, handleLeave, handleLoading, setJoined, setMuted, setSelectTab])

  return (
    <Container>
      <InputRoomName
        type="text"
        placeholder={t['chat_create_name']}
        ref={$inputRoomName}
        onKeyPress={handleInputName}
        onCompositionEnd={handleInputName}
        defaultValue={channelName}
        autoFocus
      />
      <ButtonWrapper>
        <ButtonCreateAndEnterRoom keyColorId={keyColorId} onClick={handleCreateRoom}>
          <span>{t['chat_create_button']}</span>
        </ButtonCreateAndEnterRoom>
      </ButtonWrapper>
    </Container>
  )
}
