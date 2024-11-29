import { Spinner } from '@nextui-org/react'
import React from 'react'

export default function LoadingComponent({ label }: { label?: string }) {
    return (
        <div className='fixed flex inset-0 justify-center items-center'>
            <Spinner
                label={label || 'Loading...'}
                color='secondary'
                labelColor='secondary'
             />
        </div>
    )
}
