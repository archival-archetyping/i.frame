import React from 'react'
import tw, { styled } from 'twin.macro'
import {useRecoilValue} from "recoil";
import {controllerOpenedState} from "../store/app";

const Wrapper = styled.div(({opened}) => [
  tw`transition-all pt-10 w-full min-h-full`,
  `@media (min-width: 768px) {
     width: calc(100% - 0.25rem);
   }`,
  opened && `
    @media (min-width: 768px) {
      width: calc(100% - 24rem);
    }
  `
])

export const Container = ({children}) => {
  const controllerOpened = useRecoilValue(controllerOpenedState)
  return (
    <Wrapper opened={controllerOpened}>{children}</Wrapper>
  )
}
