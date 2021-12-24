import React from 'react'
import tw from 'twin.macro'
import Icon from '@mdi/react'
import { mdiClose } from "@mdi/js";

const Container = tw.div`
  w-full bg-white bg-opacity-90 px-3 py-4
  rounded-md border border-black shadow-md
`
const TitleWrapper = tw.div`flex justify-between items-center`
const Title = tw.h3`text-base font-bold`
const ButtonClose = tw.button`text-gray-500 w-5 h-5`
const Content = tw.p`text-sm mt-2`

export const CardNotification = (props) => {
  const { title, content } = props
  return (
    <Container {...props}>
      <TitleWrapper>
        <Title>{title}</Title>
        <ButtonClose><Icon path={mdiClose} /></ButtonClose>
      </TitleWrapper>
      <Content>{content}</Content>
    </Container>
  )
}
