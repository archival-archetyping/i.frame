import React from 'react'
import tw from 'twin.macro'

const Container = tw.div`flex`
const ButtonWrap = tw.div`pr-8 last:pr-0`

export const ButtonGroup = (props) => {
  const { children } = props
  return (
    <Container>
      {
        children.map((child, index) => (
          <ButtonWrap key={`button-group-button-${index}`}>{child}</ButtonWrap>
        ))
      }
    </Container>
  )
}
