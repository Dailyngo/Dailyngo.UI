import { useStore } from '@/store'
import React from 'react'

const page = () => {

    const {token,login} = useStore()
  return (
    <div
    className='text-tex'
    >page</div>
  )
}

export default page