import { useEffect, useState } from "react"

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [isMessageInvisible, setIsMessageInvisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true)
      setIsMessageInvisible(true)
    }, 1000)
  }, [])

  return (
    <div>
      { !isMessageInvisible && <div>Hello world</div> }
      { isButtonVisible && <button>Button</button>}
    </div>
  )
}