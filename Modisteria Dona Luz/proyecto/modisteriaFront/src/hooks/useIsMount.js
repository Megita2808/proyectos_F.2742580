import { useRef,useEffect } from "react"

export default function useIsFirstRender() {
    const IsFirstRender = useRef(true)
    useEffect(() => {
      IsFirstRender.current = false
    }, [])
    return IsFirstRender.current 
}