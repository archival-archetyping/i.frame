import React from 'react'
import tw,{styled} from 'twin.macro'
import { ButtonBlock } from "../components/Button";
import Swal from "sweetalert2";

const Container = tw.div`relative w-full h-full px-7 pb-40 md:pb-10`
const LogoutContainer = styled.div(() => [
  tw`absolute top-40 left-1/2 w-8/12`,
  `transform: translateX(-50%);`
])

const Admin = () => {
  const handleClearCache = () => {
    localStorage.removeItem('deviceId')
    localStorage.removeItem('iconId')
    localStorage.removeItem('isCoCAgree')
    localStorage.removeItem('isAccessed')
    localStorage.removeItem('isAdmin')
    Swal.fire({ text: 'キャッシュをクリアしました'})
  }
  return (
    <Container>
      {
        (
          <LogoutContainer>
            <div className="flex flex-col items-center justify-center mt-10">
              <ButtonBlock onClick={handleClearCache}>Clear cache</ButtonBlock>
              <p className="text-key-orange text-sm text-center mt-4">キャッシュをクリアしたら<br />リロードしてください。</p>
            </div>
          </LogoutContainer>
        )
      }
    </Container>
  )
}

export default Admin
