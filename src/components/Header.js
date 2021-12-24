import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import tw, {styled} from 'twin.macro'
import { TitleOneLine } from "./Typography"
import Icon from '@mdi/react'
import { mdiInformation, mdiCardText } from "@mdi/js"
import { BackgroundGradientFrom, BackgroundGradientTo } from "./BackgroundGradient"
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil"
import {
  controllerOpenedState,
  keyColorIdState,
  modalMoreOpenState,
  tutorialState,
  tutorialStepState
} from "../store/app";
import {KEY_COLORS} from "../configs/color"

const Container = styled.div(({opened}) => [
  tw`fixed top-0 left-0 z-30 w-full bg-white h-10 px-2 md:px-8 flex items-center transition-all duration-500 ease-in-out opacity-95`,
  `backdrop-filter: blur(4px);`,
  opened && `
    @media (min-width: 768px) {
      width: calc(100% - 24rem);
    }
  `,
])
const Inner = tw.div`flex justify-between w-full items-center`
const Buttons = tw.div`relative text-white flex items-center`
const TutorialTarget = styled.div(({isOpenTutorial, tutorialStep}) => [
  tw`relative z-10 border-4 border-transparent`,
  isOpenTutorial && tutorialStep === 3 && tw`border-4 border-key-orange animate-pulse`
])

export const Header = () => {
  const [isOpenTutorial, setIsOpenTutorial] = useRecoilState(tutorialState)
  const keyColorId = useRecoilValue(keyColorIdState)
  const tutorialStep = useRecoilValue(tutorialStepState)
  const controllerOpened = useRecoilValue(controllerOpenedState)
  const setMoreIsOpen = useSetRecoilState(modalMoreOpenState)
  const matchSession = useRouteMatch('/session/:id')
  const matchInstallation = useRouteMatch('/installation/:id')
  const handleOpenTutorial = () => setIsOpenTutorial(true)
  const handleOpenModal = () => setMoreIsOpen(true)
  return (
    <Container opened={controllerOpened}>
      <BackgroundGradientFrom color={KEY_COLORS[keyColorId].primary} />
      <BackgroundGradientTo color={KEY_COLORS[keyColorId].secondary} />
      <Inner>
        <TutorialTarget isOpenTutorial={isOpenTutorial} tutorialStep={tutorialStep}>
          {
            isOpenTutorial
              ? <TitleOneLine palletId={keyColorId} />
              : <Link to={'/'}><TitleOneLine palletId={keyColorId} /></Link>
          }
        </TutorialTarget>
        <Buttons>
          {
            (matchSession || matchInstallation) && (
              <Icon className="cursor-pointer mr-2" path={mdiCardText} size={1} onClick={handleOpenModal} />
            )
          }
          <Icon className="cursor-pointer" path={mdiInformation} size={1} onClick={handleOpenTutorial} />
        </Buttons>
      </Inner>
    </Container>
  )
}
