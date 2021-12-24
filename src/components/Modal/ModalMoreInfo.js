import React from 'react'
import tw, {styled} from 'twin.macro'
import {KEY_COLORS} from "../../configs/color";
import Icon from '@mdi/react'
import {mdiClose} from '@mdi/js'

const Container = styled.div(({isOpen}) => [
  tw`absolute -bottom-full left-0 px-2 z-50 w-full transition-all duration-500 md:w-6/12`,
  isOpen && tw`bottom-0`
])
const ContentsWrapper = tw.div`relative w-full`
const Inner = tw.div`px-6 py-8 bg-white max-h-80 md:max-h-96 overflow-y-scroll whitespace-pre-wrap`

const ButtonClose = ({keyColorId, handleClose}) => {
  const Wrapper = styled.button(({keyColorId}) => [
    tw`absolute top-3 right-4 z-10`,
    `color: rgb(${KEY_COLORS[keyColorId || 0].secondary});`
  ])
  return (
    <Wrapper keyColorId={keyColorId} onClick={handleClose}>
      <Icon path={mdiClose} size={1.2} />
    </Wrapper>
  )
}

export const ModalMoreInfo = (props) => {
  const { keyColorId, isOpen, handleClose, children } = props
  return (
    <Container isOpen={isOpen}>
      <ContentsWrapper>
        <ButtonClose keyColorId={keyColorId} handleClose={handleClose} />
        <Inner>
          {
            children
          }
        </Inner>
      </ContentsWrapper>
    </Container>
  )
}
