import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

import { createPostSchema } from '../../../modules/post/post.schema'
import axios from 'axios'
import { useSWRConfig } from 'swr'

import H4 from '../typography/H4'
import ControlledTextarea from '../inputs/ControlledTextarea'
import Button from '../inputs/Button'

const PostContainer = styled.div`
  background-color: ${props => props.theme.white};
  padding: 20px 40px;

  @media (max-width: 500px) {
    padding: 20px;
  }
`
const Title = styled.div`
  font-weight: bold;
  text-align: center;
`

const TextContainer = styled.div`
  margin: 20px 0;
  width: 100%;
`

const BottomContainer = styled.div`
  display: flex;
  align-item: center;
  gap: 5px;

  @media (max-width: 500px) {
    flex-direction: column-reverse;
  }
`

const BottomText = styled.p`
  flex: 1;
`

function CreatePost ({ username }) {
  const { mutate } = useSWRConfig()
  const { control, handleSubmit, formState: { isValid }, reset } = useForm({
    resolver: joiResolver(createPostSchema),
    mode: 'all'
  })

  const onSubmit = async (data) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/post`, data)
    if (response.status === 201) {
      reset()
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/post`)
    }
  }

  return (
    <PostContainer>
      <H4><Title>No que você está pensando, @{username}?</Title></H4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextContainer>
          <ControlledTextarea 
            placeholder="Digite sua mensagem" 
            rows="4" 
            control={control} 
            name="text"
            maxLength="256"
          />
        </TextContainer>
        <BottomContainer>
          <BottomText>A sua mensagem será pública.</BottomText>
          <Button disabled={!isValid}>Postar mensagem</Button>
        </BottomContainer>
      </form>
    </PostContainer>  
  )
}

export default CreatePost