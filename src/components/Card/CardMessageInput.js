import React, {useRef} from 'react'
import tw, {styled} from 'twin.macro'
import {KEY_COLORS} from "../../configs/color";
import Icon from "@mdi/react";
import {mdiSend} from "@mdi/js";
import {event} from "../../configs/gtag";
import {fetchPost} from "../../hooks/api";
import { useRecoilValue} from "recoil";
import {
  controllerOpenedState,
  controllerTabSelectedState,
  deviceIdState,
  keyColorIdState, tutorialState
} from "../../store/app";
import {useKey} from "react-use";
import {joinedState} from "../../store/agora";
import {useI18n} from "use-mini18n";

const Container = styled.div(({isOpen}) => [
  tw`bottom-0 right-0 w-full h-12 flex justify-between items-center px-6 bg-gray-900 z-50
     w-full md:w-96 transition-all duration-500 ease-in-out
  `,
  isOpen ? tw`fixed visible bottom-0` : tw`invisible -bottom-full`,
  `z-index: 60;`
])
const SendButton = styled.button(({keyColorId}) => [
  tw`text-white w-9 h-9 rounded flex justify-center items-center`,
  `background-color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`,
])
const MessageInput = styled.input(() => [
  tw`bg-transparent border border-gray-300 rounded py-1 px-2 h-9 text-base text-white`,
  'width: calc(100% - 3rem);'
])

export const CardMessageInput = () => {
  const { t } = useI18n()
  const deviceId = useRecoilValue(deviceIdState)
  const keyColorId = useRecoilValue(keyColorIdState)
  const joined = useRecoilValue(joinedState)
  const isOpen = useRecoilValue(controllerOpenedState)
  const selectedTab = useRecoilValue(controllerTabSelectedState)
  const isTutorialOpen = useRecoilValue(tutorialState)
  const $inputMessage = useRef(null)
  const handleSendMessage = async () => {
    if ($inputMessage.current.value.length > 0 && joined && deviceId) {
      const action = 'speak_in_text'
      const label = localStorage.getItem('isAdmin') ? 'registered' : 'anonymous'
      event({action, label})
      await fetchPost(deviceId, joined, $inputMessage.current.value)
      $inputMessage.current.value = ''
    }
  }
  useKey(e => e.keyCode === 13, async () => await handleSendMessage())
  return (
    <Container isOpen={!isTutorialOpen && isOpen && selectedTab === 'chat'}>
      <MessageInput
        type="text"
        ref={$inputMessage}
        placeholder={t['chat_text_placeholder']}
      />
      <SendButton keyColorId={keyColorId} onClick={handleSendMessage}><Icon path={mdiSend} size={1.2} /></SendButton>
    </Container>
  )
}
