import React from 'react'
import {Controller} from './Controller'
import {MockController} from './MockController'
import {useRecoilValue} from "recoil";
import {cocOpenState, tutorialState} from "../../store/app";

export const ControllerSwitcher = () => {
  const isTutorialOpen = useRecoilValue(tutorialState)
  const isOpenCoC = useRecoilValue(cocOpenState)
  return (
    <>
      {
        (isTutorialOpen || isOpenCoC)
          ? <MockController />
          : <Controller />
      }
    </>
  )
}
