import React, {useCallback} from 'react'
import tw, { styled } from 'twin.macro'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  cocOpenState,
  controllerOpenedState,
  isCoCAgreeState,
  keyColorIdState,
  tutorialState,
  iconIdState, deviceIdState, tutorialStepState
} from "../store/app";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import {KEY_COLORS} from "../configs/color";
import {ICONS, UserIcon, getRandomIcon} from "./Icon";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import {fetchChangeIcon} from "../hooks/api";
import {useI18n} from "use-mini18n";
import {useWindowSize} from "react-use";

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
const CarouselInner = tw.div`text-sm text-white tracking-widest text-left leading-6 px-5 pt-4 pb-10`
const CoCTitle = styled.h3(({keyColorId}) => [
  tw`text-lg tracking-widest mt-5 mb-8`,
  `color: rgb(${KEY_COLORS[keyColorId || 0].primary});`
])

const ButtonNext = ({keyColorId, clickHandler, hasNext, handleAgreeCoC, t}) => {
  const Wrapper = styled.button(({keyColorId}) => [
    tw`absolute bottom-3 right-3 z-20 focus:outline-none text-sm font-bold flex items-center`,
    `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
  ])
  return (
    <>
      {
        hasNext
          ? (<Wrapper keyColorId={keyColorId} onClick={clickHandler}>
            <span>{t['coc_agree']}</span>
            <Icon path={mdiChevronRight} size={1} />
          </Wrapper>)
          : (<Wrapper keyColorId={keyColorId} onClick={handleAgreeCoC}>
              <span>{t['coc_decide']}</span>
            </Wrapper>)
      }
    </>
  )
}

const ButtonPrev = () => false

export const CoC = () => {
  const [isOpenCoC, setIsOpenCoC] = useRecoilState(cocOpenState)
  const [iconId, setIconId] = useRecoilState(iconIdState)
  const deviceId = useRecoilValue(deviceIdState)
  const keyColorId = useRecoilValue(keyColorIdState)
  const controllerOpened = useRecoilValue(controllerOpenedState)
  const setIsOpenTutorial = useSetRecoilState(tutorialState)
  const setTutorialStep = useSetRecoilState(tutorialStepState)
  const setIsCoCAgree = useSetRecoilState(isCoCAgreeState)
  const { width } = useWindowSize()
  const { t, getText, lang } = useI18n()
  const handleAgreeCoC = () => {
    setIsOpenTutorial(false)
    setIsOpenCoC(false)
    setTutorialStep(0)
    localStorage.setItem('isCoCAgree', 'true')
    setIsCoCAgree(true)
  }
  const handleChangeIcon = useCallback(async () => {
    const random_id = getRandomIcon().id
    localStorage.setItem('iconId', String(random_id))
    setIconId(random_id)
    await fetchChangeIcon(deviceId, random_id, keyColorId)
  }, [deviceId, keyColorId, setIconId])
  return (
    <>
      {
        isOpenCoC && (
          <Container opened={controllerOpened}>
            <CarouselContainer>
              <Carousel
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                autoPlay={false}
                renderArrowNext={(clickHandler, hasNext) => ButtonNext({keyColorId, clickHandler, hasNext, handleAgreeCoC, t})}
                renderArrowPrev={ButtonPrev}
              >
                <CarouselInner>
                  <CoCTitle>{t['coc_title']}</CoCTitle>
                  <p className="whitespace-pre-wrap">{t['coc_desc']}</p>
                </CarouselInner>
                <CarouselInner>
                  <p>{t['welcome_desc']}</p>
                  <div className="flex justify-center py-5" onClick={handleChangeIcon}>
                    {
                      iconId && <UserIcon size={width > 768 ? 'large' : 'medium' } user={{icon_id: iconId}}/>
                    }
                  </div>
                  <p className="whitespace-pre-wrap">{getText('welcome_avatar', { avatar: lang === 'en' ? iconId && ICONS[iconId].name_en : iconId && ICONS[iconId].name_ja })}</p>
                </CarouselInner>
              </Carousel>
            </CarouselContainer>
          </Container>
        )
      }
    </>
  )
}
