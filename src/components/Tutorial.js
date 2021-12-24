import React from 'react'
import tw, { styled } from 'twin.macro'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  cocOpenState,
  controllerOpenedState,
  isCoCAgreeState,
  keyColorIdState,
  tutorialState,
  tutorialStepState
} from "../store/app";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import {KEY_COLORS} from "../configs/color";
import Icon from "@mdi/react";
import { mdiChevronRight, mdiChevronLeft } from "@mdi/js";
import {useI18n} from "use-mini18n";
import {ButtonGroup} from "./Button";

const Container = styled.div(({opened}) => [
  tw`fixed top-10 left-0 w-full h-full bg-gray-600 bg-opacity-50 z-30`,
  `height: calc(100% - 2.5rem);
   backdrop-filter: blue(4px);`,
  opened && `
    @media (min-width: 768px) {
      width: calc(100% - 24rem);
    }
  `,
])
const CarouselContainer = styled.div(() => [
  tw`absolute top-0 left-0 bg-black w-full md:top-1/2 md:left-1/2 md:max-w-lg`,
  `@media (min-width: 768px) { transform: translate(-50%, -50%); }`
])
const CarouselInner = tw.div`text-sm text-white tracking-widest text-left leading-6 px-5 pt-4 pb-12`
const ButtonLanguage = styled.button(({isActive, keyColorId}) => [
  tw`text-white tracking-widest text-sm focus:outline-none`,
  isActive && `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
])
const ButtonNext = ({keyColorId, clickHandler, hasNext, isCoCAgree, handleCloseTutorial, handleOpenCoC, t}) => {
  const Wrapper = styled.button(({keyColorId}) => [
    tw`absolute bottom-3 right-3 z-20 focus:outline-none text-sm font-bold flex items-center`,
    `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
  ])
  return (
    <>
      {
        hasNext
          ? (<Wrapper keyColorId={keyColorId} onClick={clickHandler}>
              <span>{t['how_to_next']}</span>
              <Icon path={mdiChevronRight} size={1} />
            </Wrapper>)
          : isCoCAgree
            ? (
              <Wrapper keyColorId={keyColorId} onClick={handleCloseTutorial}>
                <span>{t['how_to_close']}</span>
              </Wrapper>
            )
            : (
              <Wrapper keyColorId={keyColorId} onClick={handleOpenCoC}>
                <span>{t['how_to_next']}</span>
                <Icon path={mdiChevronRight} size={1} />
              </Wrapper>
            )
      }
    </>
  )
}
const ButtonPrev = ({keyColorId, clickHandler, hasPrev}) => {
  const Wrapper = styled.button(({keyColorId}) => [
    tw`absolute bottom-3 left-3 z-20 focus:outline-none text-sm font-bold flex items-center`,
    `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
  ])
  return (
    <>
      { hasPrev && (
        <Wrapper keyColorId={keyColorId} onClick={clickHandler}>
          <Icon path={mdiChevronLeft} size={1} />
        </Wrapper>
      )}
    </>
  )
}
export const Tutorial = () => {
  const { lang, changeLang } = useI18n()
  const [isOpenTutorial, setIsOpenTutorial] = useRecoilState(tutorialState)
  const setIsOpenCoC = useSetRecoilState(cocOpenState)
  const isCoCAgree = useRecoilValue(isCoCAgreeState)
  const keyColorId = useRecoilValue(keyColorIdState)
  const controllerOpened = useRecoilValue(controllerOpenedState)
  const setTutorialStep = useSetRecoilState(tutorialStepState)
  const { t } = useI18n()
  const onChange = (step) => setTutorialStep(step)
  const handleCloseTutorial = () => {
    setIsOpenTutorial(false)
    setTutorialStep(0)
  }
  const handleOpenCoC = () => {
    setIsOpenTutorial(false)
    setIsOpenCoC(true)
  }
  return (
    <>
      {
        isOpenTutorial && (
          <Container opened={controllerOpened}>
            <CarouselContainer>
              <div className="pt-4 pl-5">
                <ButtonGroup>
                  <ButtonLanguage
                    isActive={lang === 'en'}
                    keyColorId={keyColorId}
                    onClick={() => changeLang('en')}
                  >English</ButtonLanguage>
                  <ButtonLanguage
                    isActive={lang === 'ja'}
                    keyColorId={keyColorId}
                    onClick={() => changeLang('ja')}
                  >日本語</ButtonLanguage>
                </ButtonGroup>
              </div>
              <Carousel
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                autoPlay={false}
                renderArrowNext={(clickHandler, hasNext) => ButtonNext({keyColorId, clickHandler, hasNext, isCoCAgree, handleCloseTutorial, handleOpenCoC, t})}
                renderArrowPrev={(clickHandler, hasPrev) => ButtonPrev({keyColorId, clickHandler, hasPrev})}
                onChange={onChange}
              >
                <CarouselInner>{t['how_to_step_1']}</CarouselInner>
                <CarouselInner>{t['how_to_step_2']}</CarouselInner>
                <CarouselInner>{t['how_to_step_3']}</CarouselInner>
                <CarouselInner>{t['how_to_step_4']}</CarouselInner>
              </Carousel>
            </CarouselContainer>
          </Container>
        )
      }
    </>
  )
}
