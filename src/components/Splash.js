import React, {useState, useEffect} from 'react'
import tw, { styled } from 'twin.macro'
import Icon from '@mdi/react'
import { mdiChevronRight } from '@mdi/js'
import { ButtonGroup } from "./Button";
import { BackgroundGradientFrom, BackgroundGradientTo } from "./BackgroundGradient";
import { KEY_COLORS } from "../configs/color";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {isAccessedState, isCoCAgreeState, keyColorIdState, tutorialState} from "../store/app";
import {TitleOneLine} from "./Typography";
import {useI18n} from "use-mini18n";

const BackgroundBase = styled.div(({splashOpen}) => [
  tw`visible`,
  ` position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 100;
    opacity: 1;
    transition: all 1000ms;
  `,
  !splashOpen && tw`invisible opacity-0`
])

const Main = styled.div(() => [
  tw`absolute top-1/2 left-1/2`,
  `transform: translate(-50%, -50%)`
])
const Sub = tw.div`mt-16 md:mt-24`
const AnimTitleMain = tw.h1`text-4xl italic tracking-widest md:flex md:text-5xl`
const AParagraphMain = tw.p`overflow-hidden md:mr-6 last:mr-0`
const ASpanMain = styled.span(({isShow, delay, color}) => [
  tw`text-white`,
  `display: block;
   transform: translateY(${ isShow ? '0' : '4rem'});
   transition: all 800ms ease-out;
   transition-delay: ${delay * 180}ms;
   color: rgb(${color});
   `,
])

const AnimSub = styled.h2(({isShow, delay}) => [
  tw`text-lg italic tracking-widest text-white md:text-2xl`,
  `transition: all 500ms;
   transition-delay: ${delay * 180}ms;
   opacity: ${isShow ? 1 : 0};
  `,
])
const ASpanSub = tw.span`block whitespace-pre md:inline`
const SpanMdNone = tw.span`md:hidden`

const HeaderTitleContainer = tw.div`fixed left-10 top-2`
const StepContainer = styled.div(({isShow}) => [
  tw`absolute w-full top-0 left-0 invisible transition-all duration-1000 transform opacity-0 scale-95 h-full`,
  isShow && tw`visible opacity-100 scale-100`
])
const ButtonLanguage = styled.button(({isActive, keyColorId}) => [
  tw`text-white tracking-widest text-lg focus:outline-none`,
  isActive && `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
])
const Welcome = styled.h1(({keyColorId}) => [
  tw`text-3xl text-center mt-14`,
  `color: rgb(${KEY_COLORS[keyColorId || 0].primary});`,
])
const Policy = tw.p`text-sm text-white tracking-widest mt-12 leading-6 whitespace-pre-wrap`
const ButtonStart = ({ keyColorId, handleStart }) => {
  const { t } = useI18n()
  const Wrapper = tw.div``
  const Button = styled.button(({keyColorId}) => [
    tw`text-lg tracking-widest flex items-center font-bold`,
    `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
  ])
  return (
    <Wrapper>
      <Button keyColorId={keyColorId} onClick={handleStart}>
        <span>{t['welcome_enter']}</span>
        <Icon path={mdiChevronRight} size={1} />
      </Button>
    </Wrapper>
  )
}
const ButtonPrivacyPolicy = tw.a`block text-base text-white tracking-widest font-bold pr-2 pb-2 md:pr-8 md:pb-0`

export const Splash = () => {
  const keyColorId = useRecoilValue(keyColorIdState)
  const isAccessed = useRecoilValue(isAccessedState)
  const isCoCAgreed = useRecoilValue(isCoCAgreeState)
  const [splashOpen, setSplashOpen] = useState(true)
  const [mainAnime, setMainAnime] = useState(false)
  const [step, setStep] = useState(0)
  const setIsOpenTutorial = useSetRecoilState(tutorialState)
  const { t, lang, changeLang } = useI18n()
  const handleStart = () => {
    // Tutorialを開く処理
    setIsOpenTutorial(true)
    setStep(-1)
    setSplashOpen(false)
  }
  useEffect(() => {
    setTimeout(() => {
      setMainAnime(true)
      setTimeout(() => {
        if (isCoCAgreed) {
          setStep(-1)
          setTimeout(() => {
            setSplashOpen(false)
          }, 200)
        } else {
          setStep(1)
        }
      }, 3000)
    }, 1000)
  }, [isAccessed, isCoCAgreed])
  return (
    <BackgroundBase splashOpen={splashOpen}>
      <BackgroundGradientFrom color={KEY_COLORS[keyColorId].primary} />
      <BackgroundGradientTo color={KEY_COLORS[keyColorId].secondary} />
      <StepContainer isShow={step === 0}>
        <Main>
          <AnimTitleMain style={{ lineHeight: '50px'}}>
            <AParagraphMain>
              <ASpanMain color={KEY_COLORS[keyColorId].primary} isShow={mainAnime} delay={0}>iamas</ASpanMain>
            </AParagraphMain>
            <AParagraphMain>
              <ASpanMain isShow={mainAnime} delay={1}>open_house:</ASpanMain>
            </AParagraphMain>
            <AParagraphMain>
              <ASpanMain color={KEY_COLORS[keyColorId].secondary} isShow={mainAnime} delay={2}>2021</ASpanMain>
            </AParagraphMain>
          </AnimTitleMain>
          <Sub>
            <AnimSub isShow={mainAnime} delay={6}>
              <ASpanSub>&lt;meta</ASpanSub>
              <ASpanSub><SpanMdNone>&nbsp;&nbsp;</SpanMdNone>&nbsp;&nbsp;type=&quot;forum&quot;</ASpanSub>
              <ASpanSub><SpanMdNone>&nbsp;&nbsp;</SpanMdNone>&nbsp;&nbsp;from=&quot;2021-07-22&quot;</ASpanSub>
              <ASpanSub><SpanMdNone>&nbsp;&nbsp;</SpanMdNone>&nbsp;&nbsp;to=&quot;2021-07-23&quot;&nbsp;<span>/&gt;</span></ASpanSub><br className="hidden md:block" />
              <ASpanSub>&lt;meta</ASpanSub>
              <ASpanSub><SpanMdNone>&nbsp;&nbsp;</SpanMdNone>&nbsp;&nbsp;platform=&quot;i.frame&quot;&nbsp;<span>/&gt;</span></ASpanSub>
            </AnimSub>
          </Sub>
        </Main>
      </StepContainer>
      <StepContainer isShow={step === 1}>
        <HeaderTitleContainer>
          <TitleOneLine palletId={keyColorId} />
        </HeaderTitleContainer>
        <Main className="w-full px-10 md:max-w-xl">
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
          <Welcome keyColorId={keyColorId}>{t['welcome_title']}</Welcome>
          <Policy>{t['welcome_notes']}</Policy>
          <div className="flex flex-col md:flex-row justify-end mt-14 items-end md:items-center">
            <ButtonPrivacyPolicy href="https://faithful-wavelength-1ef.notion.site/iamas-open_house-2021-1c3deedfeaa9445ebce56c23458ea014" target="_blank" rel="noreferrer">{t['welcome_check_pp']}</ButtonPrivacyPolicy>
            <ButtonStart keyColorId={keyColorId} handleStart={handleStart} />
          </div>
        </Main>
      </StepContainer>
    </BackgroundBase>
  )
}
